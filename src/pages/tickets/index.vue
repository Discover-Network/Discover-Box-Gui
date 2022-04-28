<template>
  <div class="tickets-wrapper">
    <div class="tickets-title">{{ lg("get_your_tickets_now") }}！</div>
    <div class="ticket-card">
      <div class="card-title">
        {{ lg("get_your_tickets_now_stake_title_prefix") }}
        {{ minBalance }}
        {{ lg("get_your_tickets_now_stake_title_suffix") }}
      </div>
      <div class="content">
        <div v-if="stakeBalance === 0 || minBalance > balance">
          <div class="card-input-group">
            <div>{{ lg("amount") }}</div>
            <a-input :value="balance" class="card-input" :disabled="true" />
          </div>
          <div class="buy-ares">
            <div class="card-input-group">
              <div>{{ lg("lack_of_amount") }}</div>
              <a-input
                :value="balance >= minBalance ? 0 : minBalance - balance"
                class="card-input amount-btn"
                :disabled="true"
              />
            </div>
            <div class="buy-aresBtn mouseClick" @click="toUniswap">
              {{ lg("buy") }} DISC
            </div>
          </div>
        </div>
        <div class="card-input-group" v-if="stakeBalance <= 0">
          <div>{{ lg("stake_token") }}</div>
          <a-input
            :value="minBalance + ' ARES'"
            class="card-input"
            :disabled="true"
          />
        </div>
        <div class="staked" v-else>
          <div>{{ lg("stake_tokens") }}</div>
          <div>
            <img src="@/assets/images/bag.png" alt="coin" width="42" />&nbsp;
            <span>{{ stakeBalance }}</span> ARES
          </div>
        </div>
        <div class="stake-step">
          <div class="stake-step-title">
            <span>0 Days</span>
            <div>
              <span>10 Days</span>
            </div>
            <div>
              <span>20 Days</span>
            </div>
            <span>30 Days</span>
          </div>
          <span class="steps" ref="steps"></span>
        </div>
        <div class="card-footer" v-if="isStaking">
          <div type="primary" class="bottom-btn mouseClick" @click="toWin">
            {{ lg("win_now") }}!
          </div>
          <div class="bottom-btn mouseClick" @click="goBack">
            {{ lg("cancel") }}
          </div>
        </div>
        <div class="card-footer" v-else>
          <div
            type="primary"
            :class="[
              'bottom-btn',
              btnDisable ? 'btn-disable' : '',
              'mouseClick',
            ]"
            v-if="stakeBalance > 0"
            @click="renew"
          >
            {{ lg("renew") }}
          </div>
          <div
            type="primary"
            class="bottom-btn mouseClick"
            v-else
            @click="stake"
          >
            {{ lg("stake") }}
          </div>

          <div
            :class="[
              'bottom-btn',
              unStakeDisable ? 'btn-disable' : '',
              'mouseClick',
            ]"
            @click="unStake"
          >
            {{ lg("withdraw") }}
          </div>
        </div>
      </div>
    </div>

    <a-modal
      title=""
      :visible="modalShow"
      :footer="null"
      :closable="false"
      v-if="modalShow"
    >
      <div class="modalContent">
        <div>
          {{ lg("get_your_tickets_now_stake_title_prefix") }} {{ minBalance }}
          {{ lg("get_your_tickets_now_stake_title_suffix") }}
        </div>
        <div class="modalBtns">
          <div class="modalBtn bottom-btn mouseClick" @click="toUniswap">
            {{ lg("buy") }} ARES
          </div>
          <div class="modalBtn bottom-btn mouseClick" @click="cancel()">
            {{ lg("cancel") }}
          </div>
        </div>
      </div>
    </a-modal>

    <a-modal
      title=""
      :visible="showApprove"
      :footer="null"
      :closable="false"
      :mask-closable="true"
      @cancel="showApprove = !showApprove"
      v-if="showApprove"
    >
      <div class="modalContent">
        <div class="modalDesc">
          You haven’t authorized it yet，please authorize it first！
        </div>
        <div class="modalBtns">
          <div class="modalBtn bottom-btn mouseClick" @click="approve">
            {{ lg("approve") }}
          </div>
        </div>
      </div>
    </a-modal>

    <a-modal
      title=""
      :visible="stakeSuccess"
      :footer="null"
      :closable="false"
      v-if="stakeSuccess"
    >
      <div class="modalContent">
        <div class="modalDesc">
          Congratulations on your successful staking and get the game ticket!
        </div>
        <div class="modalBtns">
          <div class="modalBtn bottom-btn mouseClick" @click="toWin">
            {{ lg("win_now") }}
          </div>
          <div
            class="modalBtn bottom-btn mouseClick"
            @click="stakeSuccess = !stakeSuccess"
          >
            {{ lg("cancel") }}
          </div>
        </div>
      </div>
    </a-modal>

    <div class="loading" v-show="loading">
      <img src="/static/img//loading.gif" alt="" />
    </div>
  </div>
</template>

<script>
import data_main_list from "@/data/main_list.js";
const tokenAbi = require("@/data/token_abi.json");
const trojanAbi = require("@/data/trojan_abi.json");
import Decimal from "decimal.js";
import { appConfigStore } from "@/store/config";
import { storeToRefs } from "pinia/dist/pinia";

export default {
  name: "BuyTickets",
  data() {
    return {
      modalShow: false,
      balance: 0,
      stakeBalance: 0,
      allowance: false,
      stepRate: 0,
      loading: false,
      btnDisable: true,
      unStakeDisable: true,
      showApprove: false,
      stakeSuccess: false,
      isStaking: false,
    };
  },
  setup() {
    const configStore = appConfigStore();
    const { minBalance } = storeToRefs(configStore);
    return {
      minBalance,
      configStore,
    };
  },
  computed: {
    token_data() {
      let temp = data_main_list[0];
      return JSON.parse(JSON.stringify(temp));
    },
  },
  created() {},
  mounted() {
    this.getBalance();
    this.addBtnSound();
    this.checkApprove();
    this.getStaked();
  },
  methods: {
    async getBalance() {
      let v = this;
      const local_address = await v.action.getAddress();
      const trc20_address = v.token_data.token_address;
      const decimals = v.token_data.token_decimals;
      let contract = new v.myWeb3.eth.Contract(tokenAbi, trc20_address);
      await contract.methods
        .balanceOf(local_address)
        .call(function (error, result) {
          let balance = new Decimal(result)
            .div(Math.pow(10, decimals))
            .toFixed();
          v.balance = balance;
        });
    },
    toUniswap() {
      window.open(
        "https://app.uniswap.org/#/swap?outputCurrency=0x358AA737e033F34df7c54306960a38d09AaBd523&use=V2"
      );
    },
    goBack() {
      window.history.go(-1);
    },
    async checkApprove() {
      let v = this;
      if (v.token_data.token_address === "") {
        console.log(`check approving return`);
        return false;
      }
      const local_address = await v.action.getAddress();
      let contract = new v.myWeb3.eth.Contract(
        tokenAbi,
        v.token_data.token_address
      );
      contract.methods
        .allowance(local_address, v.token_data.trojan_reward_address)
        .call(function (error, result) {
          console.log("check approving", result);

          if (result > 0) {
            console.log(`check approving return`, result);
            v.allowance = true;
            v.showApprove = false;
            //清空检测事件
            v.approveHash = "";
            if (v.timer) {
              clearInterval(v.timer);
            }
          }
        });
    },
    async approve() {
      let v = this;
      const reward_address = v.token_data.trojan_reward_address;
      const token_address = v.token_data.token_address;
      const local_address = await v.action.getAddress();

      v.loading = true;
      //approve
      let contract = new v.myWeb3.eth.Contract(tokenAbi, token_address);
      const approveData = contract.methods
        .approve(reward_address, "10000000000000000000000000")
        .encodeABI();
      console.log("approvedata", approveData);
      v.myWeb3.eth
        .sendTransaction({
          from: local_address,
          to: token_address,
          value: 0,
          data: approveData,
        })
        .on("transactionHash", function (hash) {
          //hash
          console.log(`hash: ` + hash);
          v.loading = false;
          v.timer = setInterval(v.checkApprove, 1000);
          //server order
        })
        .on("receipt", function (receipt) {
          //receipt
          console.log(receipt);
          v.loading = false;
        })
        .on("error", function (receipt) {
          //receipt
          console.log(receipt);
          v.loading = false;
        });
    },
    async stake() {
      let v = this;

      console.log("stake", v.allowance, v.btnDisable, v.stakeBalance);
      if (!this.allowance) {
        this.showApprove = !this.showApprove;
        return false;
      }

      // let num = v.input_num_stake;
      let num = this.miniBalance;
      const reward_address = v.token_data.trojan_reward_address;
      const local_address = await v.action.getAddress();
      console.log("local_address", local_address);
      console.log("reward_address", reward_address);
      v.loading = true;
      if (v.token_data.id === "Ares") {
        //调用合约执行
        let reward_contract = new v.myWeb3.eth.Contract(
          trojanAbi,
          reward_address
        );
        let stakeNum = new Decimal(num)
          .mul(Math.pow(10, v.token_data.token_decimals))
          .toFixed();
        console.log("stakeNum", stakeNum);
        const reward_stakeData = reward_contract.methods
          .stake(stakeNum)
          .encodeABI();
        console.log("reward_stakeData", reward_stakeData);

        const rewardReceipt = await v.myWeb3.eth.sendTransaction(
          {
            from: local_address,
            to: reward_address,
            value: 0,
            data: reward_stakeData,
          },
          function (error) {
            if (
              error &&
              error.message.includes("User denied transaction signature")
            ) {
              console.log("User Rejections: ", error);
              v.loading = false;
            }
          }
        );
        console.log("rewardReceipt", rewardReceipt);
        // this.refreshStakeInfo();
        await v.getStaked();
        v.stakeSuccess = true;
      }
      v.loading = false;
    },
    async getStaked() {
      let v = this;
      const local_address = await v.action.getAddress();
      const reward_address = v.token_data.trojan_reward_address;
      const decimals = v.token_data.reward_decimals;
      let contract = new v.myWeb3.eth.Contract(trojanAbi, reward_address);

      contract.methods.balanceOf(local_address).call(function (error, result) {
        let balance = new Decimal(result).div(Math.pow(10, decimals)).toFixed();
        v.stakeBalance = balance;

        console.log("balance", balance);

        contract.methods
          .usersStaked(local_address)
          .call(function (error, result) {
            const now = parseInt(new Date().getTime() / 1000);
            if (now > result.endTime && balance > 0) {
              v.stepRate = 100;
              v.btnDisable = false;
              v.unStakeDisable = false;
              v.isStaking = false;
            } else if (now < result.endTime) {
              v.btnDisable = true;
              v.unStakeDisable = true;
              v.isStaking = true;
              v.stepRate =
                ((now - result.startTime) /
                  (result.endTime - result.startTime)) *
                100;
            } else {
              v.stepRate = 0;
              v.isStaking = false;
            }
            v.updateStep();
          });
      });
    },
    async renew() {
      const v = this;

      if (v.btnDisable) {
        return false;
      }

      this.loading = true;
      const local_address = await v.action.getAddress();
      const reward_address = v.token_data.trojan_reward_address;
      let contract = new v.myWeb3.eth.Contract(trojanAbi, reward_address);
      const renewData = contract.methods.renew().encodeABI();

      const rewardReceipt = await v.myWeb3.eth.sendTransaction(
        {
          from: local_address,
          to: reward_address,
          value: 0,
          data: renewData,
        },
        function (error) {
          if (
            error &&
            error.message.includes("User denied transaction signature")
          ) {
            console.log("User Rejections: ", error);
            v.loading = false;
          }
        }
      );
      console.log("rewardReceipt", rewardReceipt);
      await v.getStaked();
      v.stakeSuccess = true;
      v.loading = false;
    },
    async unStake() {
      let v = this;
      if (v.unStakeDisable || v.stakeBalance <= 0) {
        return false;
      }

      let num = this.stakeBalance;
      const reward_address = v.token_data.trojan_reward_address;
      const local_address = await v.action.getAddress();
      v.loading = true;
      let reward_contract = new v.myWeb3.eth.Contract(
        trojanAbi,
        reward_address
      );
      let stakeNum = new Decimal(num)
        .mul(Math.pow(10, v.token_data.token_decimals))
        .toFixed();
      const reward_stakeData = reward_contract.methods
        .withdraw(stakeNum)
        .encodeABI();

      const rewardReceipt = await v.myWeb3.eth.sendTransaction(
        {
          from: local_address,
          to: reward_address,
          value: 0,
          data: reward_stakeData,
        },
        function (error) {
          if (
            error &&
            error.message.includes("User denied transaction signature")
          ) {
            console.log("User Rejections: ", error);
            v.loading = false;
          }
        }
      );
      console.log("rewardReceipt", rewardReceipt);
      v.getStaked();
      v.loading = false;
    },
    updateStep() {
      const dom = this.$refs.steps;
      dom.setAttribute("style", "width: " + this.stepRate + "%;");
    },
    async toWin() {
      if (!this.isStaking) {
        this.modalShow = true;
      } else {
        this.$router.push("/win");
      }
    },
    cancel() {
      this.modalShow = false;
    },
    addBtnSound() {
      const btns = document.getElementsByClassName("mouseClick");
      for (let i = 0; i < btns.length; i++) {
        btns[i].onclick = () => {
          let sound = document.querySelector("#mouseSound");
          sound.play();
        };
      }
    },
  },
};
</script>

<style scoped lang="scss">
.tickets-wrapper {
  width: 100%;
  height: calc(100vh - 33px);
  min-height: 800px;
  color: #fff;
  position: relative;
  background: url("../../assets/images/bg.jpg");
  background-size: cover;
}

.tickets-title {
  width: 100%;
  text-align: center;
  padding-top: 100px;
  height: 53px;
  font-size: 35px;
  margin: 0 auto;
  font-weight: bold;
  color: #ffffff;
}

.ticket-card {
  width: 687px;
  margin: 80px auto;
  background: #242d4d;
  border: 4px solid #1de4ae;
  border-radius: 33px;
  padding: 50px 30px;
  text-align: center;
}

.card-title {
  height: 25px;
  font-size: 21px;
  font-weight: bold;
  line-height: 30px;
  color: #ffffff;
  text-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
}

.content {
  width: 87%;
  padding: initial;
  padding-top: 30px;
  margin: 0 auto;
}

.content .card-input-group {
  margin-top: 20px;
}

.card-input-group div {
  text-align: left;
  margin-bottom: 10px;
  padding-left: 8px;
}

.card-input-group .ant-input {
  border: 2px solid #1de4ae;
  color: #242d4d;
  height: 45px;
  line-height: 45px;
  font-size: 18px;
  border-radius: 15px;
}

.staked {
  margin-top: 55px;
  div:first-child {
    font-size: 20px;
    font-weight: bold;
    color: #ffffff;
    margin-bottom: 16px;
    text-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  }
  div:last-child {
    width: 292px;
    height: 50px;
    line-height: 50px;
    font-size: 22px;
    background: #284265;
    border-radius: 31px;
    margin: 0 auto;
  }
}

.card-input {
  width: 100%;
  height: 50px;
  font-family: "Poppins", serif;
}

.buy-ares {
  display: flex;
  align-items: flex-end;
  column-gap: 20px;
  justify-content: space-between;
}

.amount-btn {
  min-width: 400px;
}

.buy-aresBtn {
  width: 125px;
  background: #1de4ae;
  box-shadow: 1px 5px 0px #004867;
  height: 45px;
  line-height: 45px;
  cursor: pointer;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  font-size: 20px;
}

.card-footer {
  margin-top: 50px;
  display: flex;
  justify-content: space-around;
}

.bottom-btn {
  width: 160px;
  height: 53px;
  font-size: 22px;
  line-height: 53px;
  cursor: pointer;
  background: #1de4ae;
  box-shadow: 1px 5px 0 #004867;
  border-radius: 15px;
  position: relative;
  overflow: hidden;
}

.modalContent {
  color: #fff;
}

.modalBtns {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.modalBtn {
  text-align: center;
}

.buy-aresBtn:before,
.bottom-btn:before {
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

.buy-aresBtn:hover,
.bottom-btn:hover {
  color: #fff;
}

.buy-aresBtn:hover:before,
.bottom-btn:hover:before {
  transform: skewX(-45deg) translateX(350px);
  transition: all 0.5s ease-in-out;
}

.stake-step-title {
  margin-top: 57px;
  height: 12px;
  background: #4b64c9;
  border: 2px solid rgba(10, 19, 63, 0.49);
  border-radius: 15px;
  display: flex;
  position: relative;
  span {
    position: absolute;
    top: 10px;
  }
  span:last-child {
    right: 0;
  }
  & > div {
    width: 33%;
    height: 8px;
    position: relative;
    text-align: right;
    border-right: 2px solid #2a3c86;
    span {
      right: -20px !important;
    }
  }
}

.stake-step {
  position: relative;
  .steps {
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    width: 0;
    height: 12px;
    border-radius: 6px;
    background: #1de4ae;
    transition: all 1s ease-in-out;
  }
}

.btn-disable {
  background: #1de4ae;
  opacity: 0.3;
}

.loading {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.3;

  img {
    margin-top: 300px;
  }
}

.modalDesc {
  font-size: 20px;
  text-align: center;
}

@media screen and (max-width: 750px) {
  .ticket-card {
    width: 96%;
  }

  .tickets-title {
    font-size: 35px;
  }

  .content {
    width: 100%;
    padding: 0;
    margin-top: 55px;
  }

  .buy-ares {
    column-gap: 7px;
  }

  .amount-btn {
    min-width: 200px;
  }

  .bottom-btn {
    width: 120px;
  }
}
</style>
