<template>
  <div class="leaderboard">
    <div class="leaderboard-title">
      {{ lg("leaderboard") }}
    </div>
    <div class="board-switch-btn">
      <div
        :class="[
          'board-btn',
          selectLeaderboard === 'new_start'
            ? 'new-start-selected'
            : 'new-start-btn',
          'mouse-click',
        ]"
        @click="switchLeaderboard('new_start')"
      >
        {{ lg("new_start") }}
      </div>
      <div
        :class="[
          'board-btn',
          selectLeaderboard === 'season' ? 'board-btn-selected' : 'roman-btn',
          'mouse-click',
        ]"
        @click="switchLeaderboard('season')"
      >
        {{ lg("season_champion") }}
      </div>
    </div>
    <div class="board-cards">
      <div
        class="board-card"
        v-for="(item, index) in leaderboardData"
        :key="index"
      >
        <div class="winner-num">
          <img
            src="@/assets/images/gold.png"
            alt=""
            width="40"
            v-if="index === 0"
          />
          <img
            src="@/assets/images/sliver.png"
            alt=""
            width="40"
            v-if="index === 1"
          />
          <img
            src="@/assets/images/bronze.png"
            alt=""
            width="40"
            v-if="index === 2"
          />
        </div>
        <div class="winner-info">
          <div class="winner-avatar">
            <img :src="gods[item.avatar].url" alt="Zeus" width="120" />
          </div>
          <div class="winner-name">
            {{
              item.nick_name.length > 10
                ? hideMiddleStr(item.nick_name, 5, 2)
                : item.nick_name
            }}
            No.{{ index + 1 }}
          </div>
        </div>
        <div class="winner-ares">{{ lg("win") }} {{ item.reward }} ARES</div>
      </div>
    </div>
    <!--<div class="tips">-->
    <!--  * {{lg("leaderboard_tips")}}-->
    <!--</div>-->
  </div>
  <div class="about-box">
    <div
      class="about-table"
      v-if="selectLeaderboard === 'season' && championData.length > 0"
    >
      <a-table
        :columns="columns"
        :data-source="championData"
        size="middle"
        :pagination="false"
        :row-key="(record) => record.id"
        :scroll="{ x: 'max-content' }"
      >
        <template v-slot:nickName="text, record, index">
          <div class="tableUsername">
            <div class="tableUserIndex">{{ index + 4 }}</div>
            <span>{{ text }}</span>
          </div>
        </template>
      </a-table>
    </div>
    <div class="about-box-title">
      {{ lg("about_trojan_war") }}
    </div>
    <div class="about-desc">
      {{ lg("trojan_war") }}
    </div>
    <div class="win-now mouse-click" @click="toWin">{{ lg("win_now") }}!</div>
  </div>
</template>

<script>
import { hideMiddleStr } from "@/utils/format";
import { gods } from "@/utils/contant";
import { methodType, request } from "@/utils/request";
import data_main_list from "@/data/main_list";
const tokenLockAbi = require("@/data/token_locked.abi.json");
import apis from "@/utils/apis";
import { appStore } from "@/store";
import Decimal from "decimal.js";

export default {
  name: "LeaderBoard",
  data() {
    return {
      gods,
      leaderboardData: [],
      championData: [],
      selectLeaderboard: "new_start",
      columns: [
        {
          dataIndex: "id",
          className: "tableHide",
        },
        {
          title: "User",
          dataIndex: "nick_name",
          align: "left",
          scopedSlots: { customRender: "nickName" },
        },
        {
          title: "Rewards",
          dataIndex: "reward",
          align: "center",
        },
        {
          title: "Address",
          dataIndex: "address",
          align: "center",
        },
      ],
      gamePermissions: false,
    };
  },
  computed: {
    token_data() {
      let temp = data_main_list[0];
      return JSON.parse(JSON.stringify(temp));
    },
  },
  mounted() {
    const store = appStore();
    store.$subscribe((mutation, state) => {
      if (mutation.events.key === "accessToken" && state.accessToken) {
        this.getLeaderboard(1);
      }
    });
    if (store.accessToken !== "") {
      this.getLeaderboard(1);
    }
    this.getStaked();
  },
  methods: {
    hideMiddleStr,
    switchLeaderboard(type) {
      this.playBtnSound();
      this.selectLeaderboard = type;
      if (type === "new_start") {
        this.getLeaderboard(1);
      } else {
        this.getLeaderboard(2);
      }
    },
    getLeaderboard(type) {
      this.leaderboardData = [];
      request(apis.leaderboardList, methodType.GET, { type: type }).then(
        (result) => {
          this.leaderboardData = result.data;
          if (this.leaderboardData.length > 3) {
            this.leaderboardData = this.leaderboardData.slice(0, 3);
            if (type === 2) {
              this.championData = result.data.slice(3);
            }
          }
        }
      );
    },
    playBtnSound() {
      let sound = document.querySelector("#mouseSound");
      sound.play();
    },
    async getStaked() {
      let v = this;
      const local_address = await v.action.getAddress();
      const reward_address = v.token_data.locked_address;
      const decimals = v.token_data.reward_decimals;
      let contract = new v.myWeb3.eth.Contract(tokenLockAbi, reward_address);
      contract.methods.balanceOf(local_address).call(function (error, result) {
        let balance = new Decimal(result).div(Math.pow(10, decimals)).toFixed();
        if (balance > 0) {
          contract.methods
            .usersStaked(local_address)
            .call(function (error, result) {
              console.log("stake time", result);
              const now = parseInt(new Date().getTime() / 1000);
              if (now < result.endTime) {
                v.gamePermissions = true;
              }
            });
        }
      });
    },
    async toWin() {
      this.playBtnSound();
      if (this.gamePermissions) {
        this.$router.push("/win");
      } else {
        this.$router.push("/tickets");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.leaderboard {
  min-height: 620px;
  background: #fff;
  padding: 0 160px 20px 160px;
}

.leaderboard-title {
  padding-top: 50px;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  color: #282d71;
}

.board-switch-btn {
  display: flex;
  width: 500px;
  border-radius: 15px;
  margin: 20px auto;
  border: 2px solid #282d71;
  font-weight: bold;
}

.board-btn {
  background: #e7ebff;
  color: #282d71;
  width: 250px;
  height: 53px;
  line-height: 53px;
  text-align: center;
  cursor: pointer;
  border-radius: 11px 0 0 11px;
}

.board-btn-selected {
  background: #282d71;
  color: #fff;
  border-radius: 0 11px 11px 0;
}

.new-start-selected {
  background: #282d71;
  color: #fff;
}

.new-start-btn {
  border-radius: 13px 0 0 13px;
}

.roman-btn {
  border-radius: 0 13px 13px 0;
}

.board-cards {
  margin-top: 50px;
  display: flex;
  justify-content: space-around;
}

.board-card {
  width: 300px;
  color: #fff;
  background: #242d4d;
  box-shadow: 10px 15px 15px rgba(0, 0, 0, 0.12);
  border-radius: 30px;
  padding-bottom: 30px;
}

.winner-num {
  width: 50px;
  height: 60px;
  background: #e7ebff;
  box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.16);
  opacity: 1;
  border-radius: 0 0 31px 32px;
  margin-left: 50px;
  text-align: center;
  padding-top: 5px;
}
.winner-info {
  margin: 0 auto;
  text-align: center;
}

.winner-avatar {
  padding: 8px;
  width: 136px;
  border-radius: 50%;
  margin: 0 auto;
  background-color: #284165;
}

.winner-avatar img {
  border-radius: 50%;
  border: 2px solid #fff;
}

.winner-name {
  font-size: 24px;
  font-weight: bold;
  padding: 10px 0;
}

.winner-ares {
  width: 200px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #284265;
  font-size: 22px;
  border-radius: 31px;
  margin: 0 auto;
}

.tips {
  margin-top: 40px;
  text-align: center;
  font-size: 16px;
  color: #0a133f;
  font-family: Poppins, serif;
}

.about-table {
  border-radius: 20px;
  max-width: 80%;
  margin: 0 auto;
  margin-top: -100px;

  table {
    border: none !important;
    font-family: Poppins, serif;
    color: #2e4765;
    font-size: 16px;
  }
  .ant-table-wrapper {
    padding: 20px 20px !important;
  }
  .ant-table-thead > tr > th {
    background: #e7ebff;
    color: #0e174f;
    border-right: none;
  }
}

.about-box {
  /*height: 402px;*/
  padding: 50px 0;
  background: #1de4ae;
  text-align: center;
  color: #242d4d;
}

.about-box-title {
  font-size: 40px;
  padding-top: 20px;
}

.about-desc {
  font-family: Poppins, serif;
  line-height: 22px;
  font-weight: 300;
  font-size: 17px;
  width: 60%;
  margin: 0 auto;
  padding: 20px 0 50px 0;
}

.win-now {
  width: 213px;
  height: 54px;
  line-height: 54px;
  background: #282d71;
  box-shadow: 1px 5px 0px #005e8c;
  border-radius: 15px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 0 auto;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  color: #fff;
}

.win-now:before {
  content: "";
  background-color: rgba(255, 255, 255, 0.5);
  height: 100%;
  width: 3em;
  display: block;
  position: absolute;
  top: 0;
  left: -100px;
  transform: skewX(-45deg) translateX(0);
  transition: none;
}

.win-now:hover {
  color: #fff;
  border-bottom: 4px solid darken(#0029c0, 10%);
}

.win-now:hover:before {
  transform: skewX(-45deg) translateX(17em);
  transition: all 0.5s ease-in-out;
}

@media screen and (max-width: 750px) {
  .leaderboard {
    padding: 0 20px 20px 20px;
  }

  .board-switch-btn {
    width: 320px;
  }

  .board-cards {
    flex-direction: column;
    align-items: center;
    row-gap: 20px;
    padding-bottom: 30px;
  }

  .about-table {
    max-width: 100%;
  }
}
</style>
