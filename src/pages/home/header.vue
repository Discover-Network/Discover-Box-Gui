<template>
  <div class="header">
    <div class="header-nav">
      <div class="share-btn mouse-click" @click="showShare">
        <img src="@/assets/images/coin.png" alt="" />
        {{ lg("Share_to_Earn") }}
      </div>
      <div class="connect-wallet">
        {{
          appStore.defaultAddress !== ""
            ? hideMiddleStr(appStore.defaultAddress, 5, 5)
            : lg("Connect_Wallet")
        }}
        <div class="account-wrapper">
          <div class="arrow">
            <span></span>
          </div>
          <div class="account-content">
            <div class="extract">
              <div>{{ lg("My_Rewards_Account") }}</div>
              <div class="ares">{{ gameAccountBalance }} DISC</div>
              <div class="ex-btn mouse-click" @click="showExtract">
                {{ lg("Extract") }}
              </div>
            </div>
            <div class="balance-wrapper">
              <div>{{ lg("My_Wallet_Balance") }}</div>
              <div>
                <img src="@/assets/images/bag.png" alt="/" />
              </div>
              <div class="ares">{{ walletBalance }} DISC</div>
            </div>
          </div>
        </div>
      </div>
      <div class="message">
        <a-badge :count="message.length">
          <BellFilled
            type="bell"
            theme="filled"
            style="color: #1de4ae"
            :class="[message.length > 0 ? 'bell-ani' : '']"
          />
        </a-badge>
        <div class="message-list">
          <div
            class="message-item"
            v-for="(item, index) in message"
            :key="index"
          >
            <div class="arrow" v-if="index === 0">
              <span></span>
            </div>
            <div class="cancel" @click="readMessage(item)">
              <!--3h ago-->
              <CloseOutlined style="color: #1de4ae" />
            </div>
            <div class="message-content">{{ item.content }}</div>
          </div>
        </div>
      </div>
      <div class="language">
        {{ langType.toUpperCase() === "ZH" ? "CN" : langType.toUpperCase() }}
        <div class="dropdown-menu">
          <div @click="setAppLang('en')">EN</div>
          <div @click="setAppLang('zh')">CN</div>
        </div>
      </div>
    </div>
    <div class="account">
      <div class="content">
        <div @click="toWin" class="box-logo mouse-click">
          <img src="@/assets/images/logo.png" alt="" />
        </div>
        <div class="balance" @click="toWin">
          <div class="balance-btn">
            <img src="@/assets/images/coin.png" alt="coin" height="50" />&nbsp;
            <span>{{ this.prize }} </span> <span>DISC</span>
          </div>
          <div class="price">{{ lg("in_prize") }}!</div>
        </div>
        <div class="buy-ares">
          <div class="buy-ares-btn mouse-click" @click="buyTickets">
            {{ lg("Buy_Tickets") }}
          </div>
        </div>
        <div class="desc">
          {{ lg("upNow") }}
          <span style="color: #282d71">{{ winTotalNum }}</span>
          {{ lg("peopleParticipated") }}
        </div>
      </div>
    </div>
    <div class="box-hero">
      <img src="@/assets/images/box_hero.png" alt="" />
    </div>

    <a-modal
      title=""
      :visible="modalShow"
      :footer="null"
      :closable="false"
      v-if="modalShow"
      :centered="true"
    >
      <div class="modal-content">
        <div>
          <!--{{lg("tikkets_tips_prefix")}} {{miniBalance}} {{lg("tikkets_tips_suffix")}}-->
          {{ lg("stake_tip_prefix") }} {{ configStore.minBalance }}
          {{ lg("stake_tip_suffix") }}
        </div>
        <div class="modal-btns">
          <div class="modal-btns bottom-btn" @click="buyTickets">
            {{ lg("stake") }}
          </div>
          <div class="modal-btns bottom-btn" @click="modalShow = false">
            {{ lg("cancel") }}
          </div>
        </div>
      </div>
    </a-modal>

    <BoxExtract
      v-model:extractShow="extractShow"
      :nickName="nickName"
      @freshBonus="getMyBonus"
      :maxGameBalance="gameAccountBalance"
      :totalWinAres="totalWinAres"
    ></BoxExtract>

    <ShareEarn
      v-model:showShareEarn="showShareEarn"
      v-if="showShareEarn"
    ></ShareEarn>
  </div>
</template>

<script>
import { hideMiddleStr } from "@/utils/format";
import BoxExtract from "@/components/extract";
import ShareEarn from "@/pages/home/share_earn.vue";
import apis from "@/utils/apis.js";
import { methodType, request } from "@/utils/request";
import data_main_list from "@/data/main_list";
import tokenAbi from "@/data/token_abi.json";
import trojanAbi from "@/data/trojan_abi.json";
import { appStore as AppStore } from "@/store";
import { appConfigStore } from "@/store/config";
import Decimal from "decimal.js";

export default {
  name: "BoxHeader",
  components: {
    BoxExtract,
    ShareEarn,
  },
  data() {
    return {
      gameAccountBalance: 0,
      totalWinAres: 0,
      message: [],
      langType: "en",
      walletBalance: 0,
      prize: 500000,
      winTotalNum: 0,
      gamePermissions: false,
      modalShow: false,
      extractShow: false,
      showShareEarn: false,
      nickName: "haha",
    };
  },
  setup() {
    const appStore = AppStore();
    const configStore = appConfigStore();
    return {
      appStore,
      configStore,
    };
  },
  computed: {
    token_data() {
      let temp = data_main_list[0];
      return JSON.parse(JSON.stringify(temp));
    },
  },
  mounted() {
    this.appStore.$subscribe((mutation, state) => {
      if (mutation.events.key === "accessToken" && state.accessToken) {
        this.init();
      }
    });
    this.getBalance();
    this.getStaked();
    this.setAppLang();
    this.getPrize();
    this.getParticipationNum();
    if (this.appStore.accessToken !== "") {
      this.init();
    }
  },
  methods: {
    hideMiddleStr,
    async init() {
      this.getMessage();
      this.getMyBonus();
    },
    async getBalance() {
      let v = this;
      const local_address = await v.action.getAddress();
      const trc20_address = data_main_list[0].token_address;
      const decimals = data_main_list[0].token_decimals;

      let contract = new v.myWeb3.eth.Contract(tokenAbi, trc20_address);
      await contract.methods
        .balanceOf(local_address)
        .call(function (error, result) {
          let balance = new Decimal(result)
            .div(Math.pow(10, decimals))
            .toFixed(3);
          v.num_balance = balance;
        });
    },
    async getStaked() {
      let v = this;
      const local_address = await v.action.getAddress();
      const reward_address = v.token_data.trojan_reward_address;
      const decimals = v.token_data.reward_decimals;
      let contract = new v.myWeb3.eth.Contract(trojanAbi, reward_address);
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
    getMyBonus() {
      request(apis.myBonus, methodType.GET).then((result) => {
        this.gameAccountBalance = result.data.balance;
        this.totalWinAres = result.data.total_win;
      });
    },
    showShare() {
      this.showShareEarn = true;
    },
    async toWin() {
      this.playBtnSound();
      if (!this.gamePermissions) {
        this.$router.push("/win");
      } else {
        this.modalShow = true;
      }
    },
    showExtract() {
      this.playBtnSound();
      this.extractShow = true;
    },
    setAppLang(str) {
      const v = this;
      if (str) {
        v.langType = str;
      }
      window.lang = v.langType;
    },
    getMessage() {
      request(apis.messageList, methodType.GET, { state: 1 }).then((res) => {
        this.message = res.data.items;
      });
    },
    readMessage(item) {
      const param = {
        id: item.id,
      };
      request(apis.readMessage, methodType.POST, param).then((res) => {
        console.log("readMessage:", res);
        const newMessage = [];
        this.message.map((m) => {
          if (item.id !== m.id) {
            newMessage.push(m);
          }
        });
        this.message = newMessage;
      });
    },
    getPrize() {
      request(apis.prize, methodType.GET, {}).then((res) => {
        this.prize = res.data.total;
      });
    },
    getParticipationNum() {
      request(apis.participationNum, methodType.GET, {}).then((res) => {
        this.winTotalNum = res.data.part_in_address;
      });
    },
    buyTickets() {
      this.playBtnSound();
      this.$router.push("/tickets");
    },
    playBtnSound() {
      let sound = document.querySelector("#mouseSound");
      sound.play();
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  height: 853px;
  position: relative;
  overflow: hidden;
  padding: 50px 100px 0 100px;
  background: #11143c;
  color: white;
  background: url("../../assets/images/bg.jpg") no-repeat;
  background-size: cover;
}
.header-nav {
  cursor: pointer;
  z-index: 110;
  display: flex;
  column-gap: 15px;
  justify-content: flex-end;
  position: relative;
  z-index: 100;
}

.share-btn {
  height: 41px;
  line-height: 41px;
  background: #1de4ae;
  box-shadow: 1px 5px 0px #004867;
  border-radius: 8px;
  font-weight: 400;
  color: #282d71;
  font-size: 16px;
  padding: 0 10px;
  cursor: pointer;
  position: relative;
  z-index: 110;
  img {
    width: 24px;
    height: 24px;
  }
}

.connect-wallet,
.language {
  width: 190px;
  height: 45px;
  line-height: 40px;
  text-align: center;
  font-size: 18px;
  color: #1de4ae;
  border: 2px solid #1de4ae;
  border-radius: 12px;
  position: relative;
}

.account-wrapper {
  display: none;
  width: 341px;
  height: 180px;
  background: #242d4d;
  border: 1px solid #1de4ae;
  border-radius: 8px;
  position: absolute;
  left: -85px;
  top: 60px;
  .arrow {
    width: 0;
    height: 0;
    border-left: 17px solid transparent;
    border-right: 17px solid transparent;
    border-bottom: 17px solid #1de4ae;
    position: relative;
    margin: 0 auto;
    top: -17px;
  }

  .arrow span {
    display: block;
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 15px solid #242d4d;
    position: absolute;
    left: -15px;
    top: 2px;
  }

  .account-content {
    display: flex;
    font-size: 16px;
    padding: 13px 0;
    color: #fff;
    cursor: default;
    img {
      width: 40px;
      height: 40px;
    }
    .ares {
      min-width: 104px;
      height: 29px;
      line-height: 29px;
      background: #284265;
      border-radius: 31px;
      margin: 15px auto;
      padding: 0 1px;
    }
  }

  .balance-wrapper {
    width: 50%;
    line-height: 20px;
    text-align: center;
    padding: 0 20px;
    div:nth-child(2) {
      margin: 10px 0;
    }
    .ares {
      margin: 0 auto;
    }
  }

  .extract {
    border-right: 1px solid #1de4ae;
    width: 50%;
    line-height: 20px;
    padding: 0 15px;
    .ex-btn {
      width: 89px;
      height: 25px;
      line-height: 25px;
      background: #282d71;
      box-shadow: 1px 3px 0 #005e8c;
      opacity: 1;
      border-radius: 6px;
      margin: 0 auto;
      cursor: pointer;
    }
  }
}

.connect-wallet {
  &:hover .account-wrapper {
    display: block;
  }
}

.message {
  border: 2px solid #1de4ae;
  border-radius: 12px;
  height: 45px;
  width: 45px;
  line-height: 45px;
  padding: 0 5px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  /deep/ .ant-badge-count {
    min-height: 17px;
    height: 17px;
    line-height: 17px;
    background: #fff;
    color: #0e1750;
    transform: translate(10%, -10%);
  }
  &:hover {
    .message-list {
      display: block;
    }
  }
  .ant-badge {
    display: block;
    font-size: 26px;
    &:hover {
      .message-list {
        display: block;
      }
    }
  }
  .phone-bell {
    display: none;
  }
  .bell-badge {
    background: #fff;
    width: 11px;
    height: 11px;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    left: 12px;
    border: 2px solid #0e1750;
  }
}

.message-item {
  min-width: 388px;
  height: 45px;
  background: #242d4d;
  border: 1px solid #1de4ae;
  line-height: 45px;
  border-radius: 8px;
  position: relative;
  margin-top: 13px;
  .arrow {
    width: 0;
    height: 0;
    border-left: 17px solid transparent;
    border-right: 17px solid transparent;
    border-bottom: 17px solid #1de4ae;
    position: relative;
    margin: 0 auto;
    top: -17px;
    left: 120px;
  }

  .arrow span {
    display: block;
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 15px solid #242d4d;
    position: absolute;
    left: -15px;
    top: 2px;
  }
}

.cancel {
  font-size: 12px;
  width: 13px;
  position: absolute;
  right: 10px;
  top: 0;
  height: 10px;
  line-height: 12px;
  padding: 5px 0;
  color: #607ff6;
  .anticon {
    vertical-align: top;
  }
}

.message-content {
  height: 45px;
  line-height: 45px;
  position: absolute;
  top: 0;
  padding: 0 20px;
  display: flex;
  align-items: center;
  column-gap: 10px;
  .label {
    width: 9px;
    height: 9px;
    background: #ffbb01;
    border: 1px solid #ffbb01;
    border-radius: 50%;
    opacity: 1;
  }
}

.message-list {
  display: none;
  position: absolute;
  width: 500px;
  top: 25px;
  left: -350px;
  padding-top: 20px;
}

.language {
  width: 50px;
  position: relative;
}

.language:hover .dropdown-menu {
  display: block;
}

.dropdown-menu {
  display: none;
  width: 50px;
  text-align: center;
  z-index: 100;
  color: #1de4ae;
  background: #242d4d;
  margin-top: 2px;
}

.dropdown-menu > div:hover {
  color: #92a7fd;
}

.bell-ani {
  animation: bellAnimation 5000ms infinite;
}

@keyframes bellAnimation {
  0% {
    transform: rotate(0deg);
  }
  8.0% {
    transform: rotate(0deg);
  }
  12.0% {
    transform: rotate(42deg);
  }
  16.0% {
    transform: rotate(-35deg);
  }
  20.0% {
    transform: rotate(0deg);
  }
  23.0% {
    transform: rotate(28deg);
  }
  26.0% {
    transform: rotate(-20deg);
  }
  29.0% {
    transform: rotate(0deg);
  }
  31.0% {
    transform: rotate(16deg);
  }
  33.0% {
    transform: rotate(-12deg);
  }
  35.0% {
    transform: rotate(0deg);
  }
  37.0% {
    transform: rotate(-6deg);
  }
  39.0% {
    transform: rotate(0deg);
  }
  40.0% {
    transform: rotate(6deg);
  }
  44.0% {
    transform: rotate(-3deg);
  }
  49.0% {
    transform: rotate(2deg);
  }
  55.0% {
    transform: rotate(0deg);
  }
  62.0% {
    transform: rotate(1deg);
  }
  70.0% {
    transform: rotate(0deg);
  }
}

.account {
  width: 50%;
}

.account .content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 100;
  padding: 30px;
  margin: 0 auto;
}

.box-logo {
  cursor: pointer;
  width: 478px;
  height: 245px;
  img {
    width: 478px;
    height: 198px;
  }
}

.balance {
  width: 350px;
  text-align: center;
  cursor: pointer;
}

.price {
  font-size: 23px;
  margin-top: 5px;
}

.balance-btn {
  background: #284265;
  width: 300px;
  height: 65px;
  line-height: 65px;
  padding: 2px 0;
  font-size: 33px !important;
  margin: 0 auto;
  margin-top: 20px;
  border-radius: 50px;
  cursor: pointer;
  text-align: center;
}

.buy-ares {
  height: 100px;
  background: url("../../assets/images/tickets.png");
  background-size: 100%;
  width: 285px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50px;
  animation: buyAresAnimation 4s infinite;
}

.buy-ares-btn {
  background: #282d71;
  box-shadow: 1px 5px 0 #005e8c;
  border-radius: 15px;
  font-size: 25px;
  width: 150px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  cursor: pointer;
}

@keyframes buyAresAnimation {
  5%,
  50% {
    transform: scale(1);
  }
  10% {
    transform: scale(0.9);
  }
  15% {
    transform: scale(1.15);
  }
  20% {
    transform: scale(1.15) rotate(-5deg);
  }
  25% {
    transform: scale(1.15) rotate(5deg);
  }
  30% {
    transform: scale(1.15) rotate(-3deg);
  }
  35% {
    transform: scale(1.15) rotate(2deg);
  }
  40% {
    transform: scale(1.15) rotate(0);
  }
}

.box-hero {
  position: absolute;
  top: 40px;
  right: 230px;
  z-index: 50;
  img {
    width: 540px;
  }
}

.desc {
  margin-top: 50px;
  text-align: center;
  font-family: "Poppins", serif;
}

.modal-content {
  color: #fff;
  font-size: 20px;
  & > div:first-child {
    font-size: 18px;
    line-height: 30px;
    font-family: Poppins, serif;
  }
}

.modal-btns {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  color: #242d4d;
}

.modal-btn {
  overflow: hidden;
  position: relative;
  text-align: center;
}
.bottom-btn {
  cursor: pointer;
  width: 146px;
  height: 47px;
  line-height: 50px;
  background: #1de4ae;
  box-shadow: 1px 5px 0px #004867;
  border-radius: 5px;
}

@media screen and (max-width: 750px) {
  .header {
    height: 732px;
    padding: 50px 20px 0 20px;
  }
  .header-nav {
    .share-btn {
      overflow: hidden;
      padding: 0 5px;
      font-size: 14px;
      width: 170px;
    }
  }
  .account-wrapper {
    left: -110px;
  }

  .account {
    width: 100%;
  }

  .box-logo {
    height: 200px;
    img {
      width: 70%;
      height: initial;
      margin-top: 20px;
    }
  }

  .box-hero {
    top: 245px;
    right: 20px;
    img {
      width: 230px;
    }
  }
}
</style>
