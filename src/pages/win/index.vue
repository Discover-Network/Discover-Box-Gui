<template>
  <div class="winner-wrapper">
    <div class="bg-animation">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div id="stars4"></div>
    </div>
    <div class="winner-header">
      <div class="winner-header-left">
        <div class="back-btn m-backBtn mouseClick" @click="goBack">
          <i class="fa fa-long-arrow-left" aria-hidden="true"></i>
        </div>
        <div class="prize-pot">
          <div>
            <img src="@/assets/images/coin.png" alt="coin" width="40" />
          </div>
          <div>
            <div>{{ lg("Prize_Pot") }}</div>
            <div class="prize-num">{{ prize }}</div>
          </div>
        </div>

        <div
          class="prize-pot bound mouseClick"
          @click="changeShowCard('myRewards')"
        >
          <div class="">
            <img src="@/assets/images/bag.png" alt="coin" width="40" />
          </div>
          <div>
            <div>{{ gameAccountBalance }} DISC</div>
          </div>
        </div>
      </div>

      <div class="winner-account">
        <div class="winner-title">
          {{ title === "" ? "" : lg(title) }}
          {{ title === "win_now" ? "!" : "" }}
        </div>
        <div class="winner-account-infos">
          <div
            class="winner-count-down mouseClick"
            @click="changeTitle('win_now')"
          >
            <img src="@/assets/images/countdown.png" alt="trojan" width="35" />
            {{ formatTime(countDownTime) }} 60{{ lg("min") }}
          </div>
          <div class="winner-award mouseClick" @click="showWinHistory = true">
            <img src="@/assets/images/Book.png" alt="trojan" width="35" />
          </div>
          <div class="winner-medium mouseClick" @click="toMedium">
            <img src="@/assets/images/medium.png" alt="trojan" width="40" />
          </div>
          <div
            class="winner-accountInfo mouseClick"
            @click="changeTitle('my_profile')"
          >
            <img
              src="@/assets/images/account.png"
              alt="trojan"
              width="30"
              v-if="selectGodUrl === ''"
            />
            <div v-if="selectGodUrl !== '' && nickName !== ''">
              <img :src="selectGodUrl" alt="" width="35" />
              <span class="nickName">
                {{
                  nickName.length > 10
                    ? hideMiddleStr(nickName, 4, 4)
                    : nickName
                }}
              </span>
            </div>
          </div>
          <div class="head-menu">
            <div class="menu-icon mouseClick">
              <MenuOutlined
                v-if="!showHeaderMenu"
                type="menu"
                style="font-size: 30px; font-weight: bold"
                @click="showHeaderMenu = !showHeaderMenu"
              />
              <CloseOutlined
                v-else
                type="close"
                style="font-size: 30px; font-weight: bold"
                @click="showHeaderMenu = !showHeaderMenu"
              />
            </div>
            <div class="sub-menu" v-if="showHeaderMenu">
              <div
                class="winner-accountInfo mouseClick"
                @click="changeTitle('my_profile')"
              >
                <img
                  src="@/assets/images/account.png"
                  alt="trojan"
                  width="28"
                  v-if="selectGodUrl === ''"
                />
                <div v-if="selectGodUrl !== '' && nickName !== ''">
                  <img :src="selectGodUrl" alt="" width="35" />
                </div>
              </div>
              <div
                class="winner-award mouseClick"
                @click="changeShowCard('myRewards')"
              >
                <img src="@/assets/images/bag.png" alt="coin" width="35" />
              </div>
              <div
                class="winner-award mouseClick"
                @click="showWinHistory = true"
              >
                <img src="@/assets/images/Book.png" alt="trojan" width="28" />
              </div>
              <div class="winner-medium mouseClick" @click="toMedium">
                <img src="@/assets/images/medium.png" alt="trojan" width="28" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="m-winner-title">
      {{ title === "" ? "" : lg(title) }} {{ title === "win_now" ? "!" : "" }}
    </div>
    <div
      class="winner-tips"
      :style="winnerTipsShow"
      v-show="title === 'win_now'"
    >
      <div class="tips-logo">
        <img src="@/assets/images/broadcast.png" alt="" width="30" />
      </div>
      <div class="marquee-box">
        <div class="marquee-wrapper" ref="marqueeWrapper">
          <div class="marquee-item" ref="marqueeItem">
            <!--<div class="marquee-text" v-for="(item, index) in broadcasts" :key="index">{{item}}</div>-->
            <div class="marquee-text">
              {{ broadcasts[showBroadcastsIndex] }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="winner-content-cards" v-if="title === 'win_now'">
      <div class="winner-content-card">
        <div class="winner-content-card-status">{{ lg("completed") }}</div>
        <div class="winner-card-desc">
          {{ lg("completed_tips_prefix") }}
          {{ lastWinMoney }}
          {{ lg("completed_tips_subfix") }}
        </div>
        <div class="winner-card-footer">
          <div class="winner-card-footer-img">
            <img :src="gods[lastSelectGodIndex].trs_url" alt="" height="200" />
          </div>
        </div>
      </div>

      <div class="winner-content-card" @click="toPlayGame()">
        <div class="winner-content-card-status winner-btn-now">
          {{ lg("now") }}
        </div>
        <div class="winner-card-desc">{{ lg("win_now_tips") }}</div>
        <div class="winner-card-footer">
          <div class="winner-card-footer-img" style="cursor: pointer">
            <img src="/static/img/gods_trs/staff.png" alt="" width="200" />
            <div class="maskCountdown" v-if="countDownTime > 0">
              {{ formatTime(countDownTime) }} 60{{ lg("min") }}
            </div>
          </div>
        </div>
      </div>

      <div class="winner-content-card">
        <div class="winner-content-card-status winner-btn-later">
          {{ lg("later") }}
        </div>
        <div class="winner-card-desc">{{ lg("later_tips") }}</div>
        <div class="winner-card-footer">
          <div class="winner-card-footer-img">
            <img src="/static/img/gods_trs/Ares.png" alt="" width="200" />
          </div>
        </div>
      </div>
    </div>

    <div class="winner-profile-wrapper" v-if="showCard === 'myProfile'">
      <div class="profile-user-name">
        <div class="profile-title">{{ lg("user_name") }}</div>
        <a-input v-model:value="nickName"></a-input>
      </div>
      <div class="profile-avatar">
        <div class="profile-title">
          {{ lg("select_avatar") }}
        </div>
        <div class="profile-avatars">
          <div
            v-for="(item, index) in gods"
            :key="index"
            :class="[
              'profile-avatar-info',
              item.index === selectGodIndex ? 'profile-avatar-info-select' : '',
            ]"
          >
            <img
              :src="item.url"
              alt=""
              width="50"
              @click="setSelectGod(item.name, index)"
            />
            <div
              class="profile-avatar-select"
              v-if="item.index === selectGodIndex"
            >
              <i class="fa fa-check" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="profile-address">
        <div class="profile-title">
          {{ lg("you_address") }}
        </div>
        <a-input :value="showCard"></a-input>
      </div>
      <div class="profile-btn mouseClick" @click="updateUserProfile()">
        {{ lg("ok") }}
      </div>
    </div>

    <div class="my-rewards-wrapper" v-show="showCard === 'myRewards'">
      <div class="my-rewards-title">{{ lg("my_rewards_account") }}</div>
      <div class="my-rewards-switch-btn">
        <div
          :class="[
            'my-rewards-btn',
            selectedRewards === 'today'
              ? 'my-rewards-btn-selected'
              : 'todayBtn',
            'mouseClick',
          ]"
          @click="switchRewardsType('today')"
        >
          {{ lg("today") }}
        </div>
        <div
          :class="[
            'my-rewards-btn',
            selectedRewards === 'total'
              ? 'my-rewards-total-selected'
              : 'romanBtn',
            'mouseClick',
          ]"
          @click="switchRewardsType('total')"
        >
          {{ lg("total") }}
        </div>
      </div>
      <div class="my-rewards-content">
        <div class="my-rewards-content-avatar">
          <img :src="selectGodUrl" alt="" />
        </div>
        <div class="my-rewards-content-name">
          {{ nickName.length > 15 ? hideMiddleStr(nickName, 8, 4) : nickName }}
        </div>
        <div class="my-rewards-content-ares">
          {{ lg("win") }}
          {{ selectedRewards === "today" ? todayWinAres : totalWinAres }} ARES
        </div>
        <div class="record-btns">
          <div class="win-record" @click="showMyWinHistory = true">
            <img src="@/assets/images/award.png" alt="" width="20" />
            {{ lg("Winning_Records") }}
          </div>

          <div class="win-record" @click="showWithdrawHistory = true">
            <img src="@/assets/images/bag.png" alt="" width="20" />
            {{ lg("Extract_Records") }}
          </div>
        </div>
      </div>

      <div class="rewardsExtractBtn" @click="showExtract">
        {{ lg("Extract") }}
      </div>
    </div>

    <extract
      v-model:extractShow="extractShow"
      :nickName="nickName"
      :maxGameBalance="gameAccountBalance"
      :totalWinAres="totalWinAres"
    ></extract>

    <winHistory
      v-model:showWinHistory="showWinHistory"
      v-if="showWinHistory"
    ></winHistory>

    <myWinHistory
      v-model:showMyWinHistory="showMyWinHistory"
      v-if="showMyWinHistory"
    ></myWinHistory>

    <myWithdraw
      v-model:showWithdrawHistory="showWithdrawHistory"
      v-if="showWithdrawHistory"
    ></myWithdraw>

    <a-modal
      title=""
      :visible="rewardsLess"
      :footer="null"
      :closable="false"
      v-if="rewardsLess"
      :width="750"
      :centered="true"
    >
      <div class="rewards-less-wrapper">
        <div class="rewards-less-content">
          {{ lg("extract_less_tip") }} {{ minWithdraw }} ARES.
        </div>
        <div
          class="extract-max-btn extract-footer-btn less-btn mouseClick"
          @click="rewardsLess = false"
        >
          {{ lg("ok") }}
        </div>
      </div>
    </a-modal>

    <a-modal
      title=""
      :visible="whiteListTip"
      :footer="null"
      :closable="false"
      v-if="whiteListTip"
      :width="750"
      :centered="true"
    >
      <div class="rewards-less-wrapper">
        <div class="rewards-less-content">
          <p v-if="tipsType === 'whiteList'">{{ lg("not_in_whitelist") }}</p>
          <p v-if="tipsType === 'outTime'">{{ lg("played_tips") }}</p>
        </div>
        <div
          class="extract-max-btn extract-footer-btn less-btn mouseClick"
          @click="whiteListTip = false"
        >
          {{ lg("ok") }}
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import extract from "@/components/extract.vue";
import winHistory from "@/pages/win/win_history.vue";
import myWinHistory from "@/pages/win/my_win_history.vue";
import myWithdraw from "@/pages/win/withdraw_history.vue";
import { gods } from "@/utils/contant";
import { hideMiddleStr } from "@/utils/format";
import { appStore as AppStore } from "@/store";
import { appConfigStore } from "@/store/config";
import { methodType, request } from "@/utils/request";
import apis from "@/utils/apis";

export default {
  name: "BoxWin",
  components: { extract, winHistory, myWinHistory, myWithdraw },
  data() {
    return {
      gods,
      title: "win_now",
      selectGodIndex: 1,
      nickName: "",
      showCard: "",
      selectedRewards: "today",
      extractShow: false,
      selectGodUrl: "",
      todayWinAres: 0,
      totalWinAres: 0,
      gameAccountBalance: 0,
      broadcasts: [],
      extractAccount: "",
      lastWinMoney: 0,
      lastSelectGodIndex: 0,
      lastPlayGameTime: 0,
      countDownInterval: null,
      countDownTime: 0,
      timerMarquee: null,
      showWinHistory: false,
      showMyWinHistory: false,
      showWithdrawHistory: false,
      broadcastInterval: null,
      updateDataInterval: null,
      broadcastShow: true,
      prize: 500000,
      minWithdraw: 1000,
      rewardsLess: false,
      winnerTipsShow: "visibility: hidden",
      whiteListTip: false,
      showBroadcastsIndex: -1,
      showHeaderMenu: false,
      tipsType: "whiteList",
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
  created() {
    if (!this.appStore.accessToken) {
      window.location.href = "/";
    }
  },
  mounted() {
    this.init();
    // this.runMarquee();
    this.initBroadcastInterval();
    this.updateDataInterval = setInterval(() => {
      this.getBroadcast();
    }, 1000 * 60);
    this.addBtnSound();
  },
  beforeUnmount() {
    if (this.countDownInterval) {
      clearInterval(this.countDownInterval);
    }
    if (this.broadcastInterval) {
      clearInterval(this.broadcastInterval);
    }

    if (this.updateDataInterval) {
      clearInterval(this.updateDataInterval);
    }
  },
  methods: {
    init() {
      this.getUserProfile();
      this.getMyBonus();
      this.getBroadcast();
      this.getLastPlayGameInfo();
    },
    hideMiddleStr,
    initBroadcastInterval() {
      if (this.broadcastInterval) {
        clearInterval(this.broadcastInterval);
      }
      this.broadcastInterval = setInterval(() => {
        this.broadcastShow = !this.broadcastShow;
        if (
          this.broadcasts.length > 0 &&
          this.broadcastShow &&
          this.title === "win_now"
        ) {
          this.winnerTipsShow = "visibility: visible";
          this.showBroadcastsIndex + 1 >= this.broadcasts.length
            ? (this.showBroadcastsIndex = 0)
            : this.showBroadcastsIndex++;
        } else {
          this.winnerTipsShow = "visibility: hidden";
        }
      }, 10000);
    },
    initCountDown() {
      if (this.countDownInterval) {
        clearInterval(this.countDownInterval);
      }

      const now = parseInt(new Date() / 1000);
      let startTime = new Date(new Date().setMinutes(0, 0, 1));
      let endTime = new Date(new Date().setMinutes(0, 0, 0) + 60 * 60 * 1000);
      startTime = parseInt((startTime - 1) / 1000);
      endTime = parseInt((endTime - 1) / 1000);
      const diffTime = endTime - now;
      if (this.lastPlayGameTime > startTime) {
        this.countDownTime = diffTime;
        this.countDownInterval = setInterval(() => {
          this.countDownTime -= 1;
          if (this.countDownTime < 0) {
            clearInterval(this.countDownInterval);
            this.countDownInterval = null;
          }
        }, 1000);
      }
    },
    setSelectGod(name, index) {
      this.selectGodIndex = index;
    },
    goBack() {
      this.$router.push("/");
    },
    changeTitle(title) {
      this.title = title;
      if (title === "my_profile") {
        this.showCard = "myProfile";
      } else if (title === "win_now") {
        this.showCard = "";
      }
    },
    changeShowCard(cardName) {
      this.showCard = cardName;
      if (cardName === "myRewards") {
        this.title = "";
        this.switchRewardsType("today");
      }
    },
    toPlayGame() {
      let v = this;
      v.playBtnSound();
      const address = v.myWeb3.utils.toChecksumAddress(
        this.appStore.defaultAddress
      );
      if (this.configStore.whiteList.indexOf(address) < 0) {
        this.whiteListTip = true;
        this.tipsType = "whiteList";
        return;
      }
      if (this.countDownTime <= 0) {
        this.$router.push("/games");
      } else {
        this.whiteListTip = true;
        this.tipsType = "outTime";
      }
    },
    switchRewardsType(type) {
      this.playBtnSound();
      this.selectedRewards = type;
      request(apis.myBonus, methodType.GET).then((result) => {
        this.totalWinAres = result.data.total_win;
        this.todayWinAres = result.data.today_win;
        this.gameAccountBalance = result.data.balance;
      });
    },
    getMyBonus() {
      request(apis.myBonus, methodType.GET, {}).then((result) => {
        this.totalWinAres = result.data.total_win;
        this.todayWinAres = result.data.today_win;
        this.gameAccountBalance = result.data.balance;
      });
    },
    getUserProfile() {
      request(apis.profile, methodType.GET, {}).then((result) => {
        this.nickName = result.data.nick_name;
        this.selectGodIndex = result.data.avatar;
        this.selectGodUrl = this.gods[result.data.avatar].url;
      });
    },
    updateUserProfile() {
      this.playBtnSound();
      const data = {
        avatar: this.selectGodIndex,
        nick_name: this.nickName,
      };
      request(apis.profile, methodType.POST, data).then(() => {
        this.title = "win_now";
        this.showCard = "";
        this.selectGodUrl = this.gods[this.selectGodIndex].url;
      });
    },
    getBroadcast() {
      let language = window.lang;
      if (language === "zh") {
        language = "zh_CN";
      }
      request(apis.broadcasts, methodType.GET, { page: 0, size: 20 }).then(
        (result) => {
          this.broadcasts = result.data.items;
        }
      );
    },
    showExtract() {
      this.playBtnSound();
      if (this.gameAccountBalance < this.minWithdraw) {
        this.rewardsLess = !this.rewardsLess;
      } else {
        this.extractShow = !this.extractShow;
      }
    },
    extractConfirm() {
      if (this.extractNum < 100) {
        this.rewardsLess = !this.rewardsLess;
      } else {
        this.shareCardShow = !this.shareCardShow;
        this.extractShow = false;
      }
    },
    getLastPlayGameInfo() {
      request(apis.myGamesHistory, methodType.GET, { page: 0, size: 1 }).then(
        (result) => {
          this.lastWinMoney = result.data.items[0].bonus;
          this.lastPlayGameTime = result.data.items[0].play_time;
          this.lastSelectGodIndex =
            result.data.items[0].cards[result.data.items[0].chosen_index] - 1;
          this.initCountDown();
        }
      );
    },
    runMarquee() {
      // this.stopMarquee();
      // this.timerMarquee = requestAnimationFrame(this.landscapeMarquee);
    },
    stopMarquee() {
      this.timerMarquee && cancelAnimationFrame(this.timerMarquee);
    },
    //横向滚动
    landscapeMarquee() {
      this.$refs.marqueeItem.clientWidth +
        this.$refs.marqueeWrapper.scrollLeft >=
      this.$refs.marqueeItem.scrollWidth
        ? (this.$refs.marqueeWrapper.scrollLeft = 0)
        : this.$refs.marqueeWrapper.scrollLeft++;
      this.timerMarquee = requestAnimationFrame(this.landscapeMarquee);
    },
    formatTime(second) {
      if (second <= 0) {
        return "";
      } else {
        const h = Math.floor((second / 3600) % 24);
        const m = Math.floor((second / 60) % 60);
        let s = Math.floor(second % 60);
        if (s < 10) {
          s = "0" + s;
        }
        if (h < 1) {
          return m + ":" + s;
        } else {
          return h + ":" + m + ":" + s;
        }
      }
    },
    toMedium() {
      window.open(
        "https://aresprotocollab.medium.com/trojan-box-game-paced-into-beta-version-and-gaming-tutorial-is-issued-aed2a8115c30",
        "_blank)"
      );
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
    playBtnSound() {
      let sound = document.querySelector("#mouseSound");
      sound.play();
    },
  },
};
</script>

<style scoped lang="scss">
.winner-wrapper {
  width: 100%;
  min-height: 100vh;
  color: #fff;
  position: relative;
  background: url("../../assets/images/bg.jpg");
  background-size: cover;
  padding: 0 200px 50px 200px;
}

.bg-animation {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

#stars {
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: 117px 1613px #607ff6, 1488px 635px #607ff6, 944px 914px #607ff6,
    647px 277px #607ff6, 1792px 1205px #607ff6, 656px 1517px #607ff6,
    820px 1839px #607ff6, 1153px 1400px #607ff6, 870px 13px #607ff6,
    550px 702px #607ff6, 1155px 1056px #607ff6, 88px 1709px #607ff6,
    1450px 1090px #607ff6, 1929px 457px #607ff6, 1390px 905px #607ff6,
    1771px 269px #607ff6, 1741px 669px #607ff6, 432px 64px #607ff6,
    563px 996px #607ff6, 1918px 1873px #607ff6, 1845px 1211px #607ff6,
    231px 1503px #607ff6, 37px 220px #607ff6, 1970px 495px #607ff6,
    1812px 925px #607ff6, 67px 1398px #607ff6, 535px 279px #607ff6,
    1837px 829px #607ff6, 1945px 685px #607ff6, 1677px 1817px #607ff6,
    1317px 1415px #607ff6, 1785px 905px #607ff6, 1787px 1554px #607ff6,
    802px 1296px #607ff6, 512px 1101px #607ff6, 583px 1364px #607ff6,
    336px 558px #607ff6, 979px 334px #607ff6, 106px 792px #607ff6,
    204px 34px #607ff6, 1845px 1763px #607ff6, 445px 1599px #607ff6,
    386px 453px #607ff6, 471px 952px #607ff6, 1466px 1676px #607ff6,
    1885px 303px #607ff6, 51px 1717px #607ff6, 1211px 299px #607ff6,
    1546px 1887px #607ff6, 1067px 33px #607ff6, 1088px 1326px #607ff6,
    1938px 760px #607ff6, 470px 648px #607ff6, 1213px 269px #607ff6,
    1767px 78px #607ff6, 977px 976px #607ff6, 1926px 175px #607ff6,
    722px 1512px #607ff6, 945px 227px #607ff6, 1811px 99px #607ff6,
    1912px 1406px #607ff6, 1602px 1243px #607ff6, 610px 449px #607ff6,
    654px 1393px #607ff6, 1930px 1193px #607ff6, 258px 1184px #607ff6,
    89px 265px #607ff6, 824px 1494px #607ff6, 1506px 1435px #607ff6,
    1027px 753px #607ff6, 1px 1197px #607ff6, 530px 1161px #607ff6,
    864px 1555px #607ff6, 1610px 1604px #607ff6, 1035px 1114px #607ff6,
    1456px 133px #607ff6, 1196px 1253px #607ff6, 361px 1037px #607ff6,
    834px 351px #607ff6, 436px 1676px #607ff6, 1194px 1007px #607ff6,
    1141px 647px #607ff6, 319px 454px #607ff6, 937px 1769px #607ff6,
    1872px 1013px #607ff6, 733px 643px #607ff6, 1250px 511px #607ff6,
    189px 296px #607ff6, 1639px 163px #607ff6, 1584px 336px #607ff6,
    1912px 1343px #607ff6, 1298px 1307px #607ff6, 1750px 902px #607ff6,
    1129px 845px #607ff6, 1899px 1470px #607ff6, 1427px 232px #607ff6,
    1391px 838px #607ff6, 1225px 1819px #607ff6, 190px 1366px #607ff6,
    1865px 518px #607ff6, 203px 1383px #607ff6, 1455px 614px #607ff6,
    423px 354px #607ff6, 1678px 1790px #607ff6, 241px 608px #607ff6,
    1089px 730px #607ff6, 1342px 38px #607ff6, 1848px 249px #607ff6,
    1874px 1785px #607ff6, 1040px 1837px #607ff6, 751px 261px #607ff6,
    510px 1975px #607ff6, 52px 795px #607ff6, 1786px 1310px #607ff6,
    498px 712px #607ff6, 190px 375px #607ff6, 1341px 722px #607ff6,
    43px 1394px #607ff6, 1821px 1687px #607ff6, 106px 130px #607ff6,
    1717px 1978px #607ff6, 168px 151px #607ff6, 183px 740px #607ff6,
    945px 1381px #607ff6, 669px 1170px #607ff6, 1285px 1816px #607ff6,
    110px 1217px #607ff6, 1623px 813px #607ff6, 869px 647px #607ff6,
    867px 582px #607ff6, 735px 1240px #607ff6, 519px 1896px #607ff6,
    132px 156px #607ff6, 1649px 193px #607ff6, 241px 1109px #607ff6,
    643px 484px #607ff6, 574px 1282px #607ff6, 1952px 564px #607ff6,
    1978px 145px #607ff6, 329px 903px #607ff6, 1674px 617px #607ff6,
    1978px 558px #607ff6, 1808px 1715px #607ff6, 1526px 1238px #607ff6,
    475px 1330px #607ff6, 810px 425px #607ff6, 1709px 634px #607ff6,
    1658px 336px #607ff6, 425px 194px #607ff6, 352px 96px #607ff6,
    148px 180px #607ff6, 1139px 1046px #607ff6, 1809px 1233px #607ff6,
    1669px 171px #607ff6, 263px 1394px #607ff6, 534px 715px #607ff6,
    396px 1008px #607ff6, 589px 1445px #607ff6, 1190px 381px #607ff6,
    1709px 279px #607ff6, 520px 891px #607ff6, 1136px 1867px #607ff6,
    1280px 1233px #607ff6, 836px 296px #607ff6, 1348px 646px #607ff6,
    1539px 913px #607ff6, 423px 781px #607ff6, 1271px 1805px #607ff6,
    696px 564px #607ff6, 1549px 804px #607ff6, 303px 1555px #607ff6,
    1449px 1903px #607ff6, 66px 687px #607ff6, 1164px 856px #607ff6,
    1958px 1326px #607ff6, 125px 157px #607ff6, 508px 1669px #607ff6,
    465px 725px #607ff6, 1925px 1440px #607ff6, 405px 793px #607ff6,
    278px 110px #607ff6, 1084px 1065px #607ff6, 1077px 705px #607ff6,
    663px 1844px #607ff6, 734px 263px #607ff6, 870px 1761px #607ff6,
    103px 1169px #607ff6, 1506px 1295px #607ff6, 1883px 926px #607ff6,
    335px 1361px #607ff6, 1126px 1284px #607ff6, 257px 1165px #607ff6,
    837px 580px #607ff6, 1211px 1362px #607ff6, 1137px 1380px #607ff6,
    135px 632px #607ff6, 1491px 1965px #607ff6, 1098px 195px #607ff6,
    506px 417px #607ff6, 693px 1243px #607ff6, 622px 1862px #607ff6,
    1412px 1343px #607ff6, 948px 1894px #607ff6, 1315px 1363px #607ff6,
    754px 1098px #607ff6, 1931px 930px #607ff6, 1831px 342px #607ff6,
    1751px 1839px #607ff6, 84px 775px #607ff6, 1662px 1488px #607ff6,
    617px 1769px #607ff6, 1869px 1292px #607ff6, 963px 432px #607ff6,
    371px 1114px #607ff6, 37px 642px #607ff6, 21px 1184px #607ff6,
    602px 366px #607ff6, 414px 524px #607ff6, 282px 244px #607ff6,
    1689px 868px #607ff6, 943px 681px #607ff6, 898px 679px #607ff6,
    449px 1774px #607ff6, 1678px 1313px #607ff6, 475px 1811px #607ff6,
    1146px 1509px #607ff6, 1151px 1863px #607ff6, 1617px 846px #607ff6,
    82px 1077px #607ff6, 324px 1317px #607ff6, 1516px 885px #607ff6,
    1706px 1526px #607ff6, 1925px 1180px #607ff6, 553px 967px #607ff6,
    1072px 536px #607ff6, 1715px 1816px #607ff6, 185px 286px #607ff6,
    1362px 1600px #607ff6, 628px 1938px #607ff6, 1187px 412px #607ff6,
    569px 211px #607ff6, 1959px 1356px #607ff6, 1571px 105px #607ff6,
    319px 1111px #607ff6, 36px 1364px #607ff6, 502px 1788px #607ff6,
    1051px 1993px #607ff6, 1617px 773px #607ff6, 424px 1507px #607ff6,
    1623px 1955px #607ff6, 307px 662px #607ff6, 183px 1048px #607ff6,
    1919px 1453px #607ff6, 1006px 1817px #607ff6, 468px 673px #607ff6,
    1142px 1375px #607ff6, 1228px 443px #607ff6, 1734px 552px #607ff6,
    20px 1041px #607ff6, 1783px 334px #607ff6, 98px 1237px #607ff6,
    1356px 1940px #607ff6, 853px 1779px #607ff6, 1910px 560px #607ff6,
    1174px 1656px #607ff6, 110px 1724px #607ff6, 542px 1771px #607ff6,
    1758px 1931px #607ff6, 1463px 1401px #607ff6, 1155px 84px #607ff6,
    1504px 835px #607ff6, 750px 322px #607ff6, 407px 1900px #607ff6,
    1600px 1141px #607ff6, 657px 886px #607ff6, 526px 714px #607ff6,
    18px 836px #607ff6, 1546px 1548px #607ff6, 22px 469px #607ff6,
    594px 1466px #607ff6, 1160px 1078px #607ff6, 627px 1055px #607ff6,
    195px 699px #607ff6, 1099px 684px #607ff6, 530px 551px #607ff6,
    1160px 1325px #607ff6, 894px 727px #607ff6, 1157px 98px #607ff6,
    136px 1483px #607ff6, 1875px 1975px #607ff6, 1803px 566px #607ff6,
    318px 1073px #607ff6, 1866px 1656px #607ff6, 543px 414px #607ff6,
    719px 474px #607ff6, 1115px 738px #607ff6, 353px 875px #607ff6,
    184px 1938px #607ff6, 1854px 1534px #607ff6, 420px 1698px #607ff6,
    1480px 1550px #607ff6, 522px 203px #607ff6, 1897px 1904px #607ff6,
    975px 1708px #607ff6, 1774px 602px #607ff6, 1908px 274px #607ff6,
    61px 715px #607ff6, 983px 1156px #607ff6, 326px 1013px #607ff6,
    641px 290px #607ff6, 1522px 120px #607ff6, 405px 1637px #607ff6,
    1021px 1099px #607ff6, 631px 1145px #607ff6, 982px 1967px #607ff6,
    200px 651px #607ff6, 795px 351px #607ff6, 790px 1082px #607ff6,
    144px 1572px #607ff6, 1542px 901px #607ff6, 158px 1524px #607ff6,
    849px 1843px #607ff6, 1807px 203px #607ff6, 1747px 45px #607ff6,
    1603px 1738px #607ff6, 617px 1966px #607ff6, 342px 748px #607ff6,
    1779px 1173px #607ff6, 1428px 152px #607ff6, 589px 1998px #607ff6,
    1940px 1838px #607ff6, 115px 272px #607ff6, 1217px 1395px #607ff6,
    1402px 1491px #607ff6, 1833px 1814px #607ff6, 243px 966px #607ff6,
    319px 578px #607ff6, 813px 364px #607ff6, 669px 882px #607ff6,
    551px 134px #607ff6, 1819px 920px #607ff6, 740px 1826px #607ff6,
    1021px 952px #607ff6, 1575px 453px #607ff6, 324px 419px #607ff6,
    929px 417px #607ff6, 885px 1112px #607ff6, 503px 187px #607ff6,
    1908px 362px #607ff6, 1063px 1601px #607ff6, 169px 1792px #607ff6,
    789px 963px #607ff6, 1697px 948px #607ff6, 1761px 1810px #607ff6,
    1844px 1591px #607ff6, 1709px 949px #607ff6, 1402px 1396px #607ff6,
    1037px 225px #607ff6, 1832px 518px #607ff6, 1728px 1782px #607ff6,
    194px 1421px #607ff6, 1395px 742px #607ff6, 1478px 1325px #607ff6,
    40px 593px #607ff6, 1732px 117px #607ff6, 51px 158px #607ff6,
    1598px 1672px #607ff6, 701px 849px #607ff6, 1403px 1979px #607ff6,
    145px 1414px #607ff6, 550px 906px #607ff6, 1366px 460px #607ff6,
    142px 1379px #607ff6, 34px 1864px #607ff6, 1346px 308px #607ff6,
    293px 998px #607ff6, 21px 1868px #607ff6, 540px 1033px #607ff6,
    60px 746px #607ff6, 1602px 1476px #607ff6, 180px 804px #607ff6,
    345px 1982px #607ff6, 1439px 640px #607ff6, 939px 1834px #607ff6,
    20px 432px #607ff6, 492px 1549px #607ff6, 109px 1579px #607ff6,
    1796px 1403px #607ff6, 1079px 519px #607ff6, 1664px 389px #607ff6,
    1627px 1061px #607ff6, 823px 419px #607ff6, 1399px 1882px #607ff6,
    1906px 344px #607ff6, 1189px 848px #607ff6, 117px 882px #607ff6,
    1262px 33px #607ff6, 1048px 434px #607ff6, 1208px 1309px #607ff6,
    1616px 408px #607ff6, 1833px 853px #607ff6, 1433px 1656px #607ff6,
    811px 1861px #607ff6, 439px 1672px #607ff6, 1105px 248px #607ff6,
    328px 1652px #607ff6, 13px 1658px #607ff6, 685px 987px #607ff6,
    985px 403px #607ff6, 1664px 1206px #607ff6, 1993px 1925px #607ff6,
    440px 917px #607ff6, 1835px 319px #607ff6, 1404px 1907px #607ff6,
    624px 1443px #607ff6, 843px 954px #607ff6, 478px 1567px #607ff6,
    895px 1602px #607ff6, 1231px 871px #607ff6, 1267px 1646px #607ff6,
    475px 334px #607ff6, 784px 796px #607ff6, 1294px 199px #607ff6,
    109px 702px #607ff6, 1978px 362px #607ff6, 291px 940px #607ff6,
    971px 1343px #607ff6, 74px 719px #607ff6, 36px 715px #607ff6,
    1007px 1423px #607ff6, 860px 314px #607ff6, 631px 177px #607ff6,
    1900px 1590px #607ff6, 1239px 1348px #607ff6, 1346px 1270px #607ff6,
    1934px 1475px #607ff6, 1553px 559px #607ff6, 588px 1969px #607ff6,
    670px 1269px #607ff6, 1484px 376px #607ff6, 20px 1424px #607ff6,
    1396px 8px #607ff6, 969px 244px #607ff6, 1807px 538px #607ff6,
    1873px 891px #607ff6, 636px 1142px #607ff6, 1474px 1562px #607ff6,
    763px 350px #607ff6, 663px 700px #607ff6, 500px 1469px #607ff6,
    1302px 722px #607ff6, 181px 291px #607ff6, 266px 893px #607ff6,
    1403px 654px #607ff6, 492px 460px #607ff6, 1503px 1369px #607ff6,
    23px 1662px #607ff6, 349px 333px #607ff6, 1435px 1017px #607ff6,
    1441px 705px #607ff6, 1708px 1446px #607ff6, 1041px 911px #607ff6,
    1063px 780px #607ff6, 1158px 1356px #607ff6, 767px 1454px #607ff6,
    1912px 797px #607ff6, 1731px 1759px #607ff6, 1378px 1390px #607ff6,
    1815px 1364px #607ff6, 960px 270px #607ff6, 1343px 427px #607ff6,
    275px 203px #607ff6, 1319px 1092px #607ff6, 1455px 770px #607ff6,
    283px 1503px #607ff6, 1505px 901px #607ff6, 1738px 1561px #607ff6,
    1526px 1935px #607ff6, 1757px 669px #607ff6, 1640px 620px #607ff6,
    1750px 722px #607ff6, 748px 66px #607ff6, 1149px 540px #607ff6,
    159px 953px #607ff6, 200px 1426px #607ff6, 515px 1110px #607ff6,
    1552px 737px #607ff6, 1094px 1459px #607ff6, 778px 799px #607ff6,
    1031px 523px #607ff6, 743px 1825px #607ff6, 1100px 882px #607ff6,
    1088px 1836px #607ff6, 255px 599px #607ff6, 67px 1361px #607ff6,
    247px 1721px #607ff6, 1722px 346px #607ff6, 1822px 155px #607ff6,
    452px 1973px #607ff6, 415px 1960px #607ff6, 1109px 57px #607ff6,
    273px 1392px #607ff6, 404px 1071px #607ff6, 1212px 353px #607ff6,
    370px 460px #607ff6, 795px 1523px #607ff6, 1932px 340px #607ff6,
    51px 1473px #607ff6, 1268px 364px #607ff6, 1512px 1862px #607ff6,
    1678px 1801px #607ff6, 1796px 579px #607ff6, 254px 251px #607ff6,
    1466px 1717px #607ff6, 893px 379px #607ff6, 1153px 923px #607ff6,
    913px 1808px #607ff6, 791px 789px #607ff6, 417px 1924px #607ff6,
    1336px 1599px #607ff6, 1695px 908px #607ff6, 1120px 114px #607ff6,
    493px 1949px #607ff6, 68px 1905px #607ff6, 969px 481px #607ff6,
    1420px 1095px #607ff6, 800px 1117px #607ff6, 390px 234px #607ff6,
    356px 1644px #607ff6, 1098px 1486px #607ff6, 1360px 521px #607ff6,
    149px 1198px #607ff6, 354px 747px #607ff6, 1749px 487px #607ff6,
    470px 76px #607ff6, 1672px 289px #607ff6, 1731px 545px #607ff6,
    1547px 1590px #607ff6, 498px 692px #607ff6, 398px 1592px #607ff6,
    1846px 1237px #607ff6, 1537px 1474px #607ff6, 1726px 1374px #607ff6,
    1922px 858px #607ff6, 376px 321px #607ff6, 985px 227px #607ff6,
    234px 1421px #607ff6, 760px 745px #607ff6, 1990px 1132px #607ff6,
    1560px 1597px #607ff6, 338px 1310px #607ff6, 1924px 1664px #607ff6,
    547px 1747px #607ff6, 1639px 1282px #607ff6, 1202px 337px #607ff6,
    1985px 779px #607ff6, 737px 456px #607ff6, 89px 501px #607ff6,
    963px 792px #607ff6, 655px 1447px #607ff6, 1492px 1994px #607ff6,
    1171px 254px #607ff6, 892px 827px #607ff6, 1735px 442px #607ff6,
    1474px 1187px #607ff6, 846px 1518px #607ff6, 557px 1805px #607ff6,
    738px 945px #607ff6, 795px 68px #607ff6, 663px 1956px #607ff6,
    1607px 290px #607ff6, 1524px 15px #607ff6, 1097px 1911px #607ff6,
    157px 1939px #607ff6, 935px 1065px #607ff6, 1809px 1708px #607ff6,
    164px 1157px #607ff6, 83px 855px #607ff6, 625px 501px #607ff6,
    814px 398px #607ff6, 552px 695px #607ff6, 597px 1546px #607ff6,
    1237px 1417px #607ff6, 628px 284px #607ff6, 866px 767px #607ff6,
    1403px 1394px #607ff6, 765px 1563px #607ff6, 1648px 109px #607ff6,
    1205px 1659px #607ff6, 921px 1313px #607ff6, 1319px 243px #607ff6,
    18px 125px #607ff6, 7px 777px #607ff6, 181px 418px #607ff6,
    1062px 1892px #607ff6, 382px 106px #607ff6, 994px 751px #607ff6,
    964px 234px #607ff6, 40px 118px #607ff6, 278px 706px #607ff6,
    1540px 1978px #607ff6, 425px 1661px #607ff6, 1050px 321px #607ff6,
    735px 1729px #607ff6, 1438px 260px #607ff6, 1229px 1109px #607ff6,
    186px 1041px #607ff6, 244px 1184px #607ff6, 392px 1472px #607ff6,
    670px 1249px #607ff6, 1260px 1443px #607ff6, 1977px 1511px #607ff6,
    1240px 773px #607ff6, 303px 513px #607ff6, 63px 1530px #607ff6,
    610px 792px #607ff6, 1987px 1647px #607ff6, 676px 1597px #607ff6,
    1740px 1244px #607ff6, 816px 1661px #607ff6, 351px 802px #607ff6,
    252px 1082px #607ff6, 31px 365px #607ff6, 1453px 984px #607ff6,
    667px 1233px #607ff6, 1247px 1800px #607ff6, 839px 270px #607ff6,
    775px 913px #607ff6, 1966px 1398px #607ff6, 499px 813px #607ff6,
    922px 1982px #607ff6, 1409px 1902px #607ff6, 1499px 1766px #607ff6,
    721px 899px #607ff6, 788px 807px #607ff6, 989px 1355px #607ff6,
    1248px 1274px #607ff6, 849px 1091px #607ff6, 1799px 1036px #607ff6,
    1486px 700px #607ff6, 170px 1989px #607ff6, 1275px 799px #607ff6,
    772px 2000px #607ff6, 1642px 362px #607ff6, 216px 940px #607ff6,
    1893px 281px #607ff6, 1944px 1298px #607ff6, 1294px 400px #607ff6,
    1523px 441px #607ff6, 1829px 340px #607ff6, 468px 170px #607ff6,
    1099px 967px #607ff6, 1331px 665px #607ff6, 1174px 1553px #607ff6,
    1567px 325px #607ff6, 1028px 1399px #607ff6, 781px 1451px #607ff6,
    1912px 1954px #607ff6, 874px 873px #607ff6, 1298px 1722px #607ff6,
    1879px 706px #607ff6, 57px 1221px #607ff6, 1116px 1432px #607ff6,
    48px 811px #607ff6, 101px 916px #607ff6, 677px 304px #607ff6,
    1203px 639px #607ff6, 1391px 199px #607ff6, 1895px 1988px #607ff6,
    1462px 1023px #607ff6, 1216px 1751px #607ff6, 1261px 663px #607ff6,
    1290px 1119px #607ff6, 137px 1793px #607ff6, 1052px 1470px #607ff6,
    1561px 226px #607ff6, 1156px 402px #607ff6, 709px 693px #607ff6,
    1040px 1911px #607ff6, 1624px 1115px #607ff6, 551px 475px #607ff6,
    416px 1090px #607ff6, 1183px 451px #607ff6, 58px 765px #607ff6,
    743px 1016px #607ff6, 198px 369px #607ff6, 1645px 1503px #607ff6,
    997px 22px #607ff6, 1447px 1323px #607ff6, 379px 883px #607ff6,
    1171px 1195px #607ff6, 919px 133px #607ff6, 1400px 517px #607ff6,
    725px 804px #607ff6, 1600px 699px #607ff6, 357px 581px #607ff6,
    266px 1713px #607ff6, 848px 1749px #607ff6, 1963px 1045px #607ff6,
    119px 1136px #607ff6;
  -webkit-animation: animStar 50s linear infinite;
  -moz-animation: animStar 50s linear infinite;
  -ms-animation: animStar 50s linear infinite;
  animation: animStar 50s linear infinite;
}
#stars:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: 117px 1613px #607ff6, 1488px 635px #607ff6, 944px 914px #607ff6,
    647px 277px #607ff6, 1792px 1205px #607ff6, 656px 1517px #607ff6,
    820px 1839px #607ff6, 1153px 1400px #607ff6, 870px 13px #607ff6,
    550px 702px #607ff6, 1155px 1056px #607ff6, 88px 1709px #607ff6,
    1450px 1090px #607ff6, 1929px 457px #607ff6, 1390px 905px #607ff6,
    1771px 269px #607ff6, 1741px 669px #607ff6, 432px 64px #607ff6,
    563px 996px #607ff6, 1918px 1873px #607ff6, 1845px 1211px #607ff6,
    231px 1503px #607ff6, 37px 220px #607ff6, 1970px 495px #607ff6,
    1812px 925px #607ff6, 67px 1398px #607ff6, 535px 279px #607ff6,
    1837px 829px #607ff6, 1945px 685px #607ff6, 1677px 1817px #607ff6,
    1317px 1415px #607ff6, 1785px 905px #607ff6, 1787px 1554px #607ff6,
    802px 1296px #607ff6, 512px 1101px #607ff6, 583px 1364px #607ff6,
    336px 558px #607ff6, 979px 334px #607ff6, 106px 792px #607ff6,
    204px 34px #607ff6, 1845px 1763px #607ff6, 445px 1599px #607ff6,
    386px 453px #607ff6, 471px 952px #607ff6, 1466px 1676px #607ff6,
    1885px 303px #607ff6, 51px 1717px #607ff6, 1211px 299px #607ff6,
    1546px 1887px #607ff6, 1067px 33px #607ff6, 1088px 1326px #607ff6,
    1938px 760px #607ff6, 470px 648px #607ff6, 1213px 269px #607ff6,
    1767px 78px #607ff6, 977px 976px #607ff6, 1926px 175px #607ff6,
    722px 1512px #607ff6, 945px 227px #607ff6, 1811px 99px #607ff6,
    1912px 1406px #607ff6, 1602px 1243px #607ff6, 610px 449px #607ff6,
    654px 1393px #607ff6, 1930px 1193px #607ff6, 258px 1184px #607ff6,
    89px 265px #607ff6, 824px 1494px #607ff6, 1506px 1435px #607ff6,
    1027px 753px #607ff6, 1px 1197px #607ff6, 530px 1161px #607ff6,
    864px 1555px #607ff6, 1610px 1604px #607ff6, 1035px 1114px #607ff6,
    1456px 133px #607ff6, 1196px 1253px #607ff6, 361px 1037px #607ff6,
    834px 351px #607ff6, 436px 1676px #607ff6, 1194px 1007px #607ff6,
    1141px 647px #607ff6, 319px 454px #607ff6, 937px 1769px #607ff6,
    1872px 1013px #607ff6, 733px 643px #607ff6, 1250px 511px #607ff6,
    189px 296px #607ff6, 1639px 163px #607ff6, 1584px 336px #607ff6,
    1912px 1343px #607ff6, 1298px 1307px #607ff6, 1750px 902px #607ff6,
    1129px 845px #607ff6, 1899px 1470px #607ff6, 1427px 232px #607ff6,
    1391px 838px #607ff6, 1225px 1819px #607ff6, 190px 1366px #607ff6,
    1865px 518px #607ff6, 203px 1383px #607ff6, 1455px 614px #607ff6,
    423px 354px #607ff6, 1678px 1790px #607ff6, 241px 608px #607ff6,
    1089px 730px #607ff6, 1342px 38px #607ff6, 1848px 249px #607ff6,
    1874px 1785px #607ff6, 1040px 1837px #607ff6, 751px 261px #607ff6,
    510px 1975px #607ff6, 52px 795px #607ff6, 1786px 1310px #607ff6,
    498px 712px #607ff6, 190px 375px #607ff6, 1341px 722px #607ff6,
    43px 1394px #607ff6, 1821px 1687px #607ff6, 106px 130px #607ff6,
    1717px 1978px #607ff6, 168px 151px #607ff6, 183px 740px #607ff6,
    945px 1381px #607ff6, 669px 1170px #607ff6, 1285px 1816px #607ff6,
    110px 1217px #607ff6, 1623px 813px #607ff6, 869px 647px #607ff6,
    867px 582px #607ff6, 735px 1240px #607ff6, 519px 1896px #607ff6,
    132px 156px #607ff6, 1649px 193px #607ff6, 241px 1109px #607ff6,
    643px 484px #607ff6, 574px 1282px #607ff6, 1952px 564px #607ff6,
    1978px 145px #607ff6, 329px 903px #607ff6, 1674px 617px #607ff6,
    1978px 558px #607ff6, 1808px 1715px #607ff6, 1526px 1238px #607ff6,
    475px 1330px #607ff6, 810px 425px #607ff6, 1709px 634px #607ff6,
    1658px 336px #607ff6, 425px 194px #607ff6, 352px 96px #607ff6,
    148px 180px #607ff6, 1139px 1046px #607ff6, 1809px 1233px #607ff6,
    1669px 171px #607ff6, 263px 1394px #607ff6, 534px 715px #607ff6,
    396px 1008px #607ff6, 589px 1445px #607ff6, 1190px 381px #607ff6,
    1709px 279px #607ff6, 520px 891px #607ff6, 1136px 1867px #607ff6,
    1280px 1233px #607ff6, 836px 296px #607ff6, 1348px 646px #607ff6,
    1539px 913px #607ff6, 423px 781px #607ff6, 1271px 1805px #607ff6,
    696px 564px #607ff6, 1549px 804px #607ff6, 303px 1555px #607ff6,
    1449px 1903px #607ff6, 66px 687px #607ff6, 1164px 856px #607ff6,
    1958px 1326px #607ff6, 125px 157px #607ff6, 508px 1669px #607ff6,
    465px 725px #607ff6, 1925px 1440px #607ff6, 405px 793px #607ff6,
    278px 110px #607ff6, 1084px 1065px #607ff6, 1077px 705px #607ff6,
    663px 1844px #607ff6, 734px 263px #607ff6, 870px 1761px #607ff6,
    103px 1169px #607ff6, 1506px 1295px #607ff6, 1883px 926px #607ff6,
    335px 1361px #607ff6, 1126px 1284px #607ff6, 257px 1165px #607ff6,
    837px 580px #607ff6, 1211px 1362px #607ff6, 1137px 1380px #607ff6,
    135px 632px #607ff6, 1491px 1965px #607ff6, 1098px 195px #607ff6,
    506px 417px #607ff6, 693px 1243px #607ff6, 622px 1862px #607ff6,
    1412px 1343px #607ff6, 948px 1894px #607ff6, 1315px 1363px #607ff6,
    754px 1098px #607ff6, 1931px 930px #607ff6, 1831px 342px #607ff6,
    1751px 1839px #607ff6, 84px 775px #607ff6, 1662px 1488px #607ff6,
    617px 1769px #607ff6, 1869px 1292px #607ff6, 963px 432px #607ff6,
    371px 1114px #607ff6, 37px 642px #607ff6, 21px 1184px #607ff6,
    602px 366px #607ff6, 414px 524px #607ff6, 282px 244px #607ff6,
    1689px 868px #607ff6, 943px 681px #607ff6, 898px 679px #607ff6,
    449px 1774px #607ff6, 1678px 1313px #607ff6, 475px 1811px #607ff6,
    1146px 1509px #607ff6, 1151px 1863px #607ff6, 1617px 846px #607ff6,
    82px 1077px #607ff6, 324px 1317px #607ff6, 1516px 885px #607ff6,
    1706px 1526px #607ff6, 1925px 1180px #607ff6, 553px 967px #607ff6,
    1072px 536px #607ff6, 1715px 1816px #607ff6, 185px 286px #607ff6,
    1362px 1600px #607ff6, 628px 1938px #607ff6, 1187px 412px #607ff6,
    569px 211px #607ff6, 1959px 1356px #607ff6, 1571px 105px #607ff6,
    319px 1111px #607ff6, 36px 1364px #607ff6, 502px 1788px #607ff6,
    1051px 1993px #607ff6, 1617px 773px #607ff6, 424px 1507px #607ff6,
    1623px 1955px #607ff6, 307px 662px #607ff6, 183px 1048px #607ff6,
    1919px 1453px #607ff6, 1006px 1817px #607ff6, 468px 673px #607ff6,
    1142px 1375px #607ff6, 1228px 443px #607ff6, 1734px 552px #607ff6,
    20px 1041px #607ff6, 1783px 334px #607ff6, 98px 1237px #607ff6,
    1356px 1940px #607ff6, 853px 1779px #607ff6, 1910px 560px #607ff6,
    1174px 1656px #607ff6, 110px 1724px #607ff6, 542px 1771px #607ff6,
    1758px 1931px #607ff6, 1463px 1401px #607ff6, 1155px 84px #607ff6,
    1504px 835px #607ff6, 750px 322px #607ff6, 407px 1900px #607ff6,
    1600px 1141px #607ff6, 657px 886px #607ff6, 526px 714px #607ff6,
    18px 836px #607ff6, 1546px 1548px #607ff6, 22px 469px #607ff6,
    594px 1466px #607ff6, 1160px 1078px #607ff6, 627px 1055px #607ff6,
    195px 699px #607ff6, 1099px 684px #607ff6, 530px 551px #607ff6,
    1160px 1325px #607ff6, 894px 727px #607ff6, 1157px 98px #607ff6,
    136px 1483px #607ff6, 1875px 1975px #607ff6, 1803px 566px #607ff6,
    318px 1073px #607ff6, 1866px 1656px #607ff6, 543px 414px #607ff6,
    719px 474px #607ff6, 1115px 738px #607ff6, 353px 875px #607ff6,
    184px 1938px #607ff6, 1854px 1534px #607ff6, 420px 1698px #607ff6,
    1480px 1550px #607ff6, 522px 203px #607ff6, 1897px 1904px #607ff6,
    975px 1708px #607ff6, 1774px 602px #607ff6, 1908px 274px #607ff6,
    61px 715px #607ff6, 983px 1156px #607ff6, 326px 1013px #607ff6,
    641px 290px #607ff6, 1522px 120px #607ff6, 405px 1637px #607ff6,
    1021px 1099px #607ff6, 631px 1145px #607ff6, 982px 1967px #607ff6,
    200px 651px #607ff6, 795px 351px #607ff6, 790px 1082px #607ff6,
    144px 1572px #607ff6, 1542px 901px #607ff6, 158px 1524px #607ff6,
    849px 1843px #607ff6, 1807px 203px #607ff6, 1747px 45px #607ff6,
    1603px 1738px #607ff6, 617px 1966px #607ff6, 342px 748px #607ff6,
    1779px 1173px #607ff6, 1428px 152px #607ff6, 589px 1998px #607ff6,
    1940px 1838px #607ff6, 115px 272px #607ff6, 1217px 1395px #607ff6,
    1402px 1491px #607ff6, 1833px 1814px #607ff6, 243px 966px #607ff6,
    319px 578px #607ff6, 813px 364px #607ff6, 669px 882px #607ff6,
    551px 134px #607ff6, 1819px 920px #607ff6, 740px 1826px #607ff6,
    1021px 952px #607ff6, 1575px 453px #607ff6, 324px 419px #607ff6,
    929px 417px #607ff6, 885px 1112px #607ff6, 503px 187px #607ff6,
    1908px 362px #607ff6, 1063px 1601px #607ff6, 169px 1792px #607ff6,
    789px 963px #607ff6, 1697px 948px #607ff6, 1761px 1810px #607ff6,
    1844px 1591px #607ff6, 1709px 949px #607ff6, 1402px 1396px #607ff6,
    1037px 225px #607ff6, 1832px 518px #607ff6, 1728px 1782px #607ff6,
    194px 1421px #607ff6, 1395px 742px #607ff6, 1478px 1325px #607ff6,
    40px 593px #607ff6, 1732px 117px #607ff6, 51px 158px #607ff6,
    1598px 1672px #607ff6, 701px 849px #607ff6, 1403px 1979px #607ff6,
    145px 1414px #607ff6, 550px 906px #607ff6, 1366px 460px #607ff6,
    142px 1379px #607ff6, 34px 1864px #607ff6, 1346px 308px #607ff6,
    293px 998px #607ff6, 21px 1868px #607ff6, 540px 1033px #607ff6,
    60px 746px #607ff6, 1602px 1476px #607ff6, 180px 804px #607ff6,
    345px 1982px #607ff6, 1439px 640px #607ff6, 939px 1834px #607ff6,
    20px 432px #607ff6, 492px 1549px #607ff6, 109px 1579px #607ff6,
    1796px 1403px #607ff6, 1079px 519px #607ff6, 1664px 389px #607ff6,
    1627px 1061px #607ff6, 823px 419px #607ff6, 1399px 1882px #607ff6,
    1906px 344px #607ff6, 1189px 848px #607ff6, 117px 882px #607ff6,
    1262px 33px #607ff6, 1048px 434px #607ff6, 1208px 1309px #607ff6,
    1616px 408px #607ff6, 1833px 853px #607ff6, 1433px 1656px #607ff6,
    811px 1861px #607ff6, 439px 1672px #607ff6, 1105px 248px #607ff6,
    328px 1652px #607ff6, 13px 1658px #607ff6, 685px 987px #607ff6,
    985px 403px #607ff6, 1664px 1206px #607ff6, 1993px 1925px #607ff6,
    440px 917px #607ff6, 1835px 319px #607ff6, 1404px 1907px #607ff6,
    624px 1443px #607ff6, 843px 954px #607ff6, 478px 1567px #607ff6,
    895px 1602px #607ff6, 1231px 871px #607ff6, 1267px 1646px #607ff6,
    475px 334px #607ff6, 784px 796px #607ff6, 1294px 199px #607ff6,
    109px 702px #607ff6, 1978px 362px #607ff6, 291px 940px #607ff6,
    971px 1343px #607ff6, 74px 719px #607ff6, 36px 715px #607ff6,
    1007px 1423px #607ff6, 860px 314px #607ff6, 631px 177px #607ff6,
    1900px 1590px #607ff6, 1239px 1348px #607ff6, 1346px 1270px #607ff6,
    1934px 1475px #607ff6, 1553px 559px #607ff6, 588px 1969px #607ff6,
    670px 1269px #607ff6, 1484px 376px #607ff6, 20px 1424px #607ff6,
    1396px 8px #607ff6, 969px 244px #607ff6, 1807px 538px #607ff6,
    1873px 891px #607ff6, 636px 1142px #607ff6, 1474px 1562px #607ff6,
    763px 350px #607ff6, 663px 700px #607ff6, 500px 1469px #607ff6,
    1302px 722px #607ff6, 181px 291px #607ff6, 266px 893px #607ff6,
    1403px 654px #607ff6, 492px 460px #607ff6, 1503px 1369px #607ff6,
    23px 1662px #607ff6, 349px 333px #607ff6, 1435px 1017px #607ff6,
    1441px 705px #607ff6, 1708px 1446px #607ff6, 1041px 911px #607ff6,
    1063px 780px #607ff6, 1158px 1356px #607ff6, 767px 1454px #607ff6,
    1912px 797px #607ff6, 1731px 1759px #607ff6, 1378px 1390px #607ff6,
    1815px 1364px #607ff6, 960px 270px #607ff6, 1343px 427px #607ff6,
    275px 203px #607ff6, 1319px 1092px #607ff6, 1455px 770px #607ff6,
    283px 1503px #607ff6, 1505px 901px #607ff6, 1738px 1561px #607ff6,
    1526px 1935px #607ff6, 1757px 669px #607ff6, 1640px 620px #607ff6,
    1750px 722px #607ff6, 748px 66px #607ff6, 1149px 540px #607ff6,
    159px 953px #607ff6, 200px 1426px #607ff6, 515px 1110px #607ff6,
    1552px 737px #607ff6, 1094px 1459px #607ff6, 778px 799px #607ff6,
    1031px 523px #607ff6, 743px 1825px #607ff6, 1100px 882px #607ff6,
    1088px 1836px #607ff6, 255px 599px #607ff6, 67px 1361px #607ff6,
    247px 1721px #607ff6, 1722px 346px #607ff6, 1822px 155px #607ff6,
    452px 1973px #607ff6, 415px 1960px #607ff6, 1109px 57px #607ff6,
    273px 1392px #607ff6, 404px 1071px #607ff6, 1212px 353px #607ff6,
    370px 460px #607ff6, 795px 1523px #607ff6, 1932px 340px #607ff6,
    51px 1473px #607ff6, 1268px 364px #607ff6, 1512px 1862px #607ff6,
    1678px 1801px #607ff6, 1796px 579px #607ff6, 254px 251px #607ff6,
    1466px 1717px #607ff6, 893px 379px #607ff6, 1153px 923px #607ff6,
    913px 1808px #607ff6, 791px 789px #607ff6, 417px 1924px #607ff6,
    1336px 1599px #607ff6, 1695px 908px #607ff6, 1120px 114px #607ff6,
    493px 1949px #607ff6, 68px 1905px #607ff6, 969px 481px #607ff6,
    1420px 1095px #607ff6, 800px 1117px #607ff6, 390px 234px #607ff6,
    356px 1644px #607ff6, 1098px 1486px #607ff6, 1360px 521px #607ff6,
    149px 1198px #607ff6, 354px 747px #607ff6, 1749px 487px #607ff6,
    470px 76px #607ff6, 1672px 289px #607ff6, 1731px 545px #607ff6,
    1547px 1590px #607ff6, 498px 692px #607ff6, 398px 1592px #607ff6,
    1846px 1237px #607ff6, 1537px 1474px #607ff6, 1726px 1374px #607ff6,
    1922px 858px #607ff6, 376px 321px #607ff6, 985px 227px #607ff6,
    234px 1421px #607ff6, 760px 745px #607ff6, 1990px 1132px #607ff6,
    1560px 1597px #607ff6, 338px 1310px #607ff6, 1924px 1664px #607ff6,
    547px 1747px #607ff6, 1639px 1282px #607ff6, 1202px 337px #607ff6,
    1985px 779px #607ff6, 737px 456px #607ff6, 89px 501px #607ff6,
    963px 792px #607ff6, 655px 1447px #607ff6, 1492px 1994px #607ff6,
    1171px 254px #607ff6, 892px 827px #607ff6, 1735px 442px #607ff6,
    1474px 1187px #607ff6, 846px 1518px #607ff6, 557px 1805px #607ff6,
    738px 945px #607ff6, 795px 68px #607ff6, 663px 1956px #607ff6,
    1607px 290px #607ff6, 1524px 15px #607ff6, 1097px 1911px #607ff6,
    157px 1939px #607ff6, 935px 1065px #607ff6, 1809px 1708px #607ff6,
    164px 1157px #607ff6, 83px 855px #607ff6, 625px 501px #607ff6,
    814px 398px #607ff6, 552px 695px #607ff6, 597px 1546px #607ff6,
    1237px 1417px #607ff6, 628px 284px #607ff6, 866px 767px #607ff6,
    1403px 1394px #607ff6, 765px 1563px #607ff6, 1648px 109px #607ff6,
    1205px 1659px #607ff6, 921px 1313px #607ff6, 1319px 243px #607ff6,
    18px 125px #607ff6, 7px 777px #607ff6, 181px 418px #607ff6,
    1062px 1892px #607ff6, 382px 106px #607ff6, 994px 751px #607ff6,
    964px 234px #607ff6, 40px 118px #607ff6, 278px 706px #607ff6,
    1540px 1978px #607ff6, 425px 1661px #607ff6, 1050px 321px #607ff6,
    735px 1729px #607ff6, 1438px 260px #607ff6, 1229px 1109px #607ff6,
    186px 1041px #607ff6, 244px 1184px #607ff6, 392px 1472px #607ff6,
    670px 1249px #607ff6, 1260px 1443px #607ff6, 1977px 1511px #607ff6,
    1240px 773px #607ff6, 303px 513px #607ff6, 63px 1530px #607ff6,
    610px 792px #607ff6, 1987px 1647px #607ff6, 676px 1597px #607ff6,
    1740px 1244px #607ff6, 816px 1661px #607ff6, 351px 802px #607ff6,
    252px 1082px #607ff6, 31px 365px #607ff6, 1453px 984px #607ff6,
    667px 1233px #607ff6, 1247px 1800px #607ff6, 839px 270px #607ff6,
    775px 913px #607ff6, 1966px 1398px #607ff6, 499px 813px #607ff6,
    922px 1982px #607ff6, 1409px 1902px #607ff6, 1499px 1766px #607ff6,
    721px 899px #607ff6, 788px 807px #607ff6, 989px 1355px #607ff6,
    1248px 1274px #607ff6, 849px 1091px #607ff6, 1799px 1036px #607ff6,
    1486px 700px #607ff6, 170px 1989px #607ff6, 1275px 799px #607ff6,
    772px 2000px #607ff6, 1642px 362px #607ff6, 216px 940px #607ff6,
    1893px 281px #607ff6, 1944px 1298px #607ff6, 1294px 400px #607ff6,
    1523px 441px #607ff6, 1829px 340px #607ff6, 468px 170px #607ff6,
    1099px 967px #607ff6, 1331px 665px #607ff6, 1174px 1553px #607ff6,
    1567px 325px #607ff6, 1028px 1399px #607ff6, 781px 1451px #607ff6,
    1912px 1954px #607ff6, 874px 873px #607ff6, 1298px 1722px #607ff6,
    1879px 706px #607ff6, 57px 1221px #607ff6, 1116px 1432px #607ff6,
    48px 811px #607ff6, 101px 916px #607ff6, 677px 304px #607ff6,
    1203px 639px #607ff6, 1391px 199px #607ff6, 1895px 1988px #607ff6,
    1462px 1023px #607ff6, 1216px 1751px #607ff6, 1261px 663px #607ff6,
    1290px 1119px #607ff6, 137px 1793px #607ff6, 1052px 1470px #607ff6,
    1561px 226px #607ff6, 1156px 402px #607ff6, 709px 693px #607ff6,
    1040px 1911px #607ff6, 1624px 1115px #607ff6, 551px 475px #607ff6,
    416px 1090px #607ff6, 1183px 451px #607ff6, 58px 765px #607ff6,
    743px 1016px #607ff6, 198px 369px #607ff6, 1645px 1503px #607ff6,
    997px 22px #607ff6, 1447px 1323px #607ff6, 379px 883px #607ff6,
    1171px 1195px #607ff6, 919px 133px #607ff6, 1400px 517px #607ff6,
    725px 804px #607ff6, 1600px 699px #607ff6, 357px 581px #607ff6,
    266px 1713px #607ff6, 848px 1749px #607ff6, 1963px 1045px #607ff6,
    119px 1136px #607ff6;
}

#stars2 {
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: 1117px 1306px #607ff6, 1078px 1783px #607ff6,
    1179px 1085px #607ff6, 1145px 920px #607ff6, 422px 1233px #607ff6,
    387px 98px #607ff6, 1153px 637px #607ff6, 1084px 782px #607ff6,
    476px 453px #607ff6, 926px 1306px #607ff6, 60px 1086px #607ff6,
    753px 1575px #607ff6, 272px 1684px #607ff6, 1285px 750px #607ff6,
    1416px 1327px #607ff6, 1931px 473px #607ff6, 736px 1395px #607ff6,
    1816px 763px #607ff6, 438px 879px #607ff6, 665px 1902px #607ff6,
    1341px 677px #607ff6, 1404px 1073px #607ff6, 100px 597px #607ff6,
    357px 1689px #607ff6, 1044px 1342px #607ff6, 1954px 502px #607ff6,
    1192px 1308px #607ff6, 540px 1239px #607ff6, 1360px 552px #607ff6,
    89px 752px #607ff6, 659px 1253px #607ff6, 62px 517px #607ff6,
    1375px 1705px #607ff6, 1343px 1511px #607ff6, 1659px 1922px #607ff6,
    1560px 289px #607ff6, 1362px 1799px #607ff6, 1886px 1480px #607ff6,
    1718px 1885px #607ff6, 824px 738px #607ff6, 1060px 1370px #607ff6,
    1781px 1171px #607ff6, 255px 273px #607ff6, 1197px 120px #607ff6,
    213px 7px #607ff6, 1226px 1920px #607ff6, 1844px 207px #607ff6,
    1675px 970px #607ff6, 1435px 1283px #607ff6, 37px 353px #607ff6,
    59px 417px #607ff6, 921px 1602px #607ff6, 1549px 1490px #607ff6,
    638px 1845px #607ff6, 1328px 198px #607ff6, 1050px 1149px #607ff6,
    1884px 711px #607ff6, 333px 263px #607ff6, 342px 1508px #607ff6,
    1388px 1810px #607ff6, 1377px 1558px #607ff6, 890px 487px #607ff6,
    1081px 759px #607ff6, 890px 1515px #607ff6, 911px 1284px #607ff6,
    335px 735px #607ff6, 1140px 549px #607ff6, 1239px 1064px #607ff6,
    226px 71px #607ff6, 1100px 1278px #607ff6, 1851px 1805px #607ff6,
    1370px 1999px #607ff6, 1008px 1122px #607ff6, 785px 813px #607ff6,
    1358px 601px #607ff6, 1833px 1305px #607ff6, 1768px 1304px #607ff6,
    1303px 532px #607ff6, 860px 598px #607ff6, 1329px 593px #607ff6,
    1038px 1088px #607ff6, 408px 405px #607ff6, 965px 82px #607ff6,
    1483px 1438px #607ff6, 310px 1479px #607ff6, 1786px 1500px #607ff6,
    1866px 852px #607ff6, 18px 1757px #607ff6, 1473px 1004px #607ff6,
    1542px 1933px #607ff6, 633px 1970px #607ff6, 1334px 1713px #607ff6,
    175px 28px #607ff6, 592px 894px #607ff6, 121px 1162px #607ff6,
    1601px 1567px #607ff6, 1095px 657px #607ff6, 640px 1233px #607ff6,
    1073px 1255px #607ff6, 840px 1087px #607ff6, 718px 250px #607ff6,
    967px 709px #607ff6, 731px 239px #607ff6, 1623px 593px #607ff6,
    1058px 1820px #607ff6, 516px 1898px #607ff6, 666px 12px #607ff6,
    1997px 1382px #607ff6, 112px 1690px #607ff6, 687px 1309px #607ff6,
    63px 539px #607ff6, 185px 1897px #607ff6, 1055px 1691px #607ff6,
    435px 1517px #607ff6, 1175px 1119px #607ff6, 1721px 133px #607ff6,
    1212px 47px #607ff6, 166px 18px #607ff6, 1416px 1652px #607ff6,
    1409px 1745px #607ff6, 1357px 1232px #607ff6, 1677px 1998px #607ff6,
    448px 1415px #607ff6, 705px 1736px #607ff6, 1031px 1466px #607ff6,
    543px 1651px #607ff6, 1592px 1888px #607ff6, 1749px 1175px #607ff6,
    639px 1114px #607ff6, 1591px 508px #607ff6, 759px 1244px #607ff6,
    824px 380px #607ff6, 942px 955px #607ff6, 723px 732px #607ff6,
    113px 1369px #607ff6, 203px 1739px #607ff6, 868px 733px #607ff6,
    713px 971px #607ff6, 341px 833px #607ff6, 762px 824px #607ff6,
    1359px 310px #607ff6, 1858px 1349px #607ff6, 1531px 692px #607ff6,
    1075px 1512px #607ff6, 1677px 142px #607ff6, 1912px 1478px #607ff6,
    1810px 1078px #607ff6, 426px 844px #607ff6, 1426px 588px #607ff6,
    1909px 654px #607ff6, 1107px 295px #607ff6, 1351px 527px #607ff6,
    1393px 599px #607ff6, 1379px 1068px #607ff6, 228px 1846px #607ff6,
    1271px 374px #607ff6, 1348px 612px #607ff6, 7px 1301px #607ff6,
    1501px 1782px #607ff6, 1795px 423px #607ff6, 1475px 1918px #607ff6,
    1328px 1861px #607ff6, 1624px 51px #607ff6, 1791px 672px #607ff6,
    1594px 1467px #607ff6, 1655px 1603px #607ff6, 919px 850px #607ff6,
    523px 609px #607ff6, 1196px 207px #607ff6, 753px 410px #607ff6,
    686px 1097px #607ff6, 1570px 133px #607ff6, 1996px 1137px #607ff6,
    361px 116px #607ff6, 1015px 462px #607ff6, 76px 1143px #607ff6,
    491px 1818px #607ff6, 1563px 795px #607ff6, 982px 1721px #607ff6,
    831px 1204px #607ff6, 1737px 589px #607ff6, 861px 1579px #607ff6,
    1666px 130px #607ff6, 698px 1799px #607ff6, 726px 1519px #607ff6,
    109px 1208px #607ff6, 1184px 1057px #607ff6, 835px 451px #607ff6,
    896px 594px #607ff6, 35px 893px #607ff6, 895px 542px #607ff6,
    706px 225px #607ff6, 56px 1040px #607ff6, 1954px 108px #607ff6,
    1439px 1423px #607ff6, 26px 1881px #607ff6, 802px 1564px #607ff6,
    273px 708px #607ff6, 40px 31px #607ff6, 859px 108px #607ff6;
  -webkit-animation: animStar 100s linear infinite;
  -moz-animation: animStar 100s linear infinite;
  -ms-animation: animStar 100s linear infinite;
  animation: animStar 100s linear infinite;
}
#stars2:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 2px;
  height: 2px;
  background: transparent;
  box-shadow: 1117px 1306px #607ff6, 1078px 1783px #607ff6,
    1179px 1085px #607ff6, 1145px 920px #607ff6, 422px 1233px #607ff6,
    387px 98px #607ff6, 1153px 637px #607ff6, 1084px 782px #607ff6,
    476px 453px #607ff6, 926px 1306px #607ff6, 60px 1086px #607ff6,
    753px 1575px #607ff6, 272px 1684px #607ff6, 1285px 750px #607ff6,
    1416px 1327px #607ff6, 1931px 473px #607ff6, 736px 1395px #607ff6,
    1816px 763px #607ff6, 438px 879px #607ff6, 665px 1902px #607ff6,
    1341px 677px #607ff6, 1404px 1073px #607ff6, 100px 597px #607ff6,
    357px 1689px #607ff6, 1044px 1342px #607ff6, 1954px 502px #607ff6,
    1192px 1308px #607ff6, 540px 1239px #607ff6, 1360px 552px #607ff6,
    89px 752px #607ff6, 659px 1253px #607ff6, 62px 517px #607ff6,
    1375px 1705px #607ff6, 1343px 1511px #607ff6, 1659px 1922px #607ff6,
    1560px 289px #607ff6, 1362px 1799px #607ff6, 1886px 1480px #607ff6,
    1718px 1885px #607ff6, 824px 738px #607ff6, 1060px 1370px #607ff6,
    1781px 1171px #607ff6, 255px 273px #607ff6, 1197px 120px #607ff6,
    213px 7px #607ff6, 1226px 1920px #607ff6, 1844px 207px #607ff6,
    1675px 970px #607ff6, 1435px 1283px #607ff6, 37px 353px #607ff6,
    59px 417px #607ff6, 921px 1602px #607ff6, 1549px 1490px #607ff6,
    638px 1845px #607ff6, 1328px 198px #607ff6, 1050px 1149px #607ff6,
    1884px 711px #607ff6, 333px 263px #607ff6, 342px 1508px #607ff6,
    1388px 1810px #607ff6, 1377px 1558px #607ff6, 890px 487px #607ff6,
    1081px 759px #607ff6, 890px 1515px #607ff6, 911px 1284px #607ff6,
    335px 735px #607ff6, 1140px 549px #607ff6, 1239px 1064px #607ff6,
    226px 71px #607ff6, 1100px 1278px #607ff6, 1851px 1805px #607ff6,
    1370px 1999px #607ff6, 1008px 1122px #607ff6, 785px 813px #607ff6,
    1358px 601px #607ff6, 1833px 1305px #607ff6, 1768px 1304px #607ff6,
    1303px 532px #607ff6, 860px 598px #607ff6, 1329px 593px #607ff6,
    1038px 1088px #607ff6, 408px 405px #607ff6, 965px 82px #607ff6,
    1483px 1438px #607ff6, 310px 1479px #607ff6, 1786px 1500px #607ff6,
    1866px 852px #607ff6, 18px 1757px #607ff6, 1473px 1004px #607ff6,
    1542px 1933px #607ff6, 633px 1970px #607ff6, 1334px 1713px #607ff6,
    175px 28px #607ff6, 592px 894px #607ff6, 121px 1162px #607ff6,
    1601px 1567px #607ff6, 1095px 657px #607ff6, 640px 1233px #607ff6,
    1073px 1255px #607ff6, 840px 1087px #607ff6, 718px 250px #607ff6,
    967px 709px #607ff6, 731px 239px #607ff6, 1623px 593px #607ff6,
    1058px 1820px #607ff6, 516px 1898px #607ff6, 666px 12px #607ff6,
    1997px 1382px #607ff6, 112px 1690px #607ff6, 687px 1309px #607ff6,
    63px 539px #607ff6, 185px 1897px #607ff6, 1055px 1691px #607ff6,
    435px 1517px #607ff6, 1175px 1119px #607ff6, 1721px 133px #607ff6,
    1212px 47px #607ff6, 166px 18px #607ff6, 1416px 1652px #607ff6,
    1409px 1745px #607ff6, 1357px 1232px #607ff6, 1677px 1998px #607ff6,
    448px 1415px #607ff6, 705px 1736px #607ff6, 1031px 1466px #607ff6,
    543px 1651px #607ff6, 1592px 1888px #607ff6, 1749px 1175px #607ff6,
    639px 1114px #607ff6, 1591px 508px #607ff6, 759px 1244px #607ff6,
    824px 380px #607ff6, 942px 955px #607ff6, 723px 732px #607ff6,
    113px 1369px #607ff6, 203px 1739px #607ff6, 868px 733px #607ff6,
    713px 971px #607ff6, 341px 833px #607ff6, 762px 824px #607ff6,
    1359px 310px #607ff6, 1858px 1349px #607ff6, 1531px 692px #607ff6,
    1075px 1512px #607ff6, 1677px 142px #607ff6, 1912px 1478px #607ff6,
    1810px 1078px #607ff6, 426px 844px #607ff6, 1426px 588px #607ff6,
    1909px 654px #607ff6, 1107px 295px #607ff6, 1351px 527px #607ff6,
    1393px 599px #607ff6, 1379px 1068px #607ff6, 228px 1846px #607ff6,
    1271px 374px #607ff6, 1348px 612px #607ff6, 7px 1301px #607ff6,
    1501px 1782px #607ff6, 1795px 423px #607ff6, 1475px 1918px #607ff6,
    1328px 1861px #607ff6, 1624px 51px #607ff6, 1791px 672px #607ff6,
    1594px 1467px #607ff6, 1655px 1603px #607ff6, 919px 850px #607ff6,
    523px 609px #607ff6, 1196px 207px #607ff6, 753px 410px #607ff6,
    686px 1097px #607ff6, 1570px 133px #607ff6, 1996px 1137px #607ff6,
    361px 116px #607ff6, 1015px 462px #607ff6, 76px 1143px #607ff6,
    491px 1818px #607ff6, 1563px 795px #607ff6, 982px 1721px #607ff6,
    831px 1204px #607ff6, 1737px 589px #607ff6, 861px 1579px #607ff6,
    1666px 130px #607ff6, 698px 1799px #607ff6, 726px 1519px #607ff6,
    109px 1208px #607ff6, 1184px 1057px #607ff6, 835px 451px #607ff6,
    896px 594px #607ff6, 35px 893px #607ff6, 895px 542px #607ff6,
    706px 225px #607ff6, 56px 1040px #607ff6, 1954px 108px #607ff6,
    1439px 1423px #607ff6, 26px 1881px #607ff6, 802px 1564px #607ff6,
    273px 708px #607ff6, 40px 31px #607ff6, 859px 108px #607ff6;
}

#stars3 {
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: 940px 1360px #607ff6, 1071px 539px #607ff6, 1710px 1414px #607ff6,
    836px 299px #607ff6, 1944px 1420px #607ff6, 253px 1449px #607ff6,
    1257px 1250px #607ff6, 1588px 1830px #607ff6, 1077px 1204px #607ff6,
    273px 1081px #607ff6, 1993px 766px #607ff6, 1808px 479px #607ff6,
    917px 263px #607ff6, 663px 1820px #607ff6, 342px 1988px #607ff6,
    727px 1250px #607ff6, 636px 1666px #607ff6, 692px 1112px #607ff6,
    248px 1211px #607ff6, 1422px 1121px #607ff6, 881px 46px #607ff6,
    1531px 1977px #607ff6, 1643px 1023px #607ff6, 684px 1071px #607ff6,
    1142px 1873px #607ff6, 292px 1313px #607ff6, 256px 1237px #607ff6,
    89px 912px #607ff6, 964px 1783px #607ff6, 877px 760px #607ff6,
    1641px 1474px #607ff6, 1492px 24px #607ff6, 1776px 1642px #607ff6,
    183px 602px #607ff6, 1998px 62px #607ff6, 1560px 367px #607ff6,
    1333px 995px #607ff6, 704px 1815px #607ff6, 1809px 712px #607ff6,
    1503px 288px #607ff6, 630px 556px #607ff6, 1715px 125px #607ff6,
    353px 1878px #607ff6, 975px 333px #607ff6, 1740px 1409px #607ff6,
    1341px 1871px #607ff6, 1279px 1064px #607ff6, 169px 874px #607ff6,
    161px 528px #607ff6, 1671px 1669px #607ff6, 169px 632px #607ff6,
    547px 1724px #607ff6, 1904px 110px #607ff6, 679px 1670px #607ff6,
    196px 123px #607ff6, 786px 871px #607ff6, 1840px 324px #607ff6,
    356px 967px #607ff6, 61px 549px #607ff6, 99px 677px #607ff6,
    1719px 87px #607ff6, 1713px 1990px #607ff6, 1717px 1358px #607ff6,
    108px 1187px #607ff6, 51px 869px #607ff6, 1461px 902px #607ff6,
    1034px 891px #607ff6, 962px 1881px #607ff6, 1723px 595px #607ff6,
    479px 901px #607ff6, 1546px 1823px #607ff6, 285px 1208px #607ff6,
    1056px 347px #607ff6, 261px 988px #607ff6, 466px 990px #607ff6,
    1657px 648px #607ff6, 1249px 933px #607ff6, 1552px 1555px #607ff6,
    147px 62px #607ff6, 292px 1157px #607ff6, 1816px 423px #607ff6,
    1714px 757px #607ff6, 1036px 961px #607ff6, 1955px 710px #607ff6,
    1842px 516px #607ff6, 479px 1870px #607ff6, 1579px 1445px #607ff6,
    1225px 1309px #607ff6, 1965px 566px #607ff6, 1575px 1072px #607ff6,
    923px 329px #607ff6, 651px 1514px #607ff6, 865px 1100px #607ff6,
    782px 1873px #607ff6, 115px 299px #607ff6, 14px 1668px #607ff6,
    1666px 1817px #607ff6, 1096px 1068px #607ff6, 1462px 742px #607ff6,
    1384px 1750px #607ff6;
  -webkit-animation: animStar 150s linear infinite;
  -moz-animation: animStar 150s linear infinite;
  -ms-animation: animStar 150s linear infinite;
  animation: animStar 150s linear infinite;
}
#stars3:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 3px;
  height: 3px;
  background: transparent;
  box-shadow: 940px 1360px #607ff6, 1071px 539px #607ff6, 1710px 1414px #607ff6,
    836px 299px #607ff6, 1944px 1420px #607ff6, 253px 1449px #607ff6,
    1257px 1250px #607ff6, 1588px 1830px #607ff6, 1077px 1204px #607ff6,
    273px 1081px #607ff6, 1993px 766px #607ff6, 1808px 479px #607ff6,
    917px 263px #607ff6, 663px 1820px #607ff6, 342px 1988px #607ff6,
    727px 1250px #607ff6, 636px 1666px #607ff6, 692px 1112px #607ff6,
    248px 1211px #607ff6, 1422px 1121px #607ff6, 881px 46px #607ff6,
    1531px 1977px #607ff6, 1643px 1023px #607ff6, 684px 1071px #607ff6,
    1142px 1873px #607ff6, 292px 1313px #607ff6, 256px 1237px #607ff6,
    89px 912px #607ff6, 964px 1783px #607ff6, 877px 760px #607ff6,
    1641px 1474px #607ff6, 1492px 24px #607ff6, 1776px 1642px #607ff6,
    183px 602px #607ff6, 1998px 62px #607ff6, 1560px 367px #607ff6,
    1333px 995px #607ff6, 704px 1815px #607ff6, 1809px 712px #607ff6,
    1503px 288px #607ff6, 630px 556px #607ff6, 1715px 125px #607ff6,
    353px 1878px #607ff6, 975px 333px #607ff6, 1740px 1409px #607ff6,
    1341px 1871px #607ff6, 1279px 1064px #607ff6, 169px 874px #607ff6,
    161px 528px #607ff6, 1671px 1669px #607ff6, 169px 632px #607ff6,
    547px 1724px #607ff6, 1904px 110px #607ff6, 679px 1670px #607ff6,
    196px 123px #607ff6, 786px 871px #607ff6, 1840px 324px #607ff6,
    356px 967px #607ff6, 61px 549px #607ff6, 99px 677px #607ff6,
    1719px 87px #607ff6, 1713px 1990px #607ff6, 1717px 1358px #607ff6,
    108px 1187px #607ff6, 51px 869px #607ff6, 1461px 902px #607ff6,
    1034px 891px #607ff6, 962px 1881px #607ff6, 1723px 595px #607ff6,
    479px 901px #607ff6, 1546px 1823px #607ff6, 285px 1208px #607ff6,
    1056px 347px #607ff6, 261px 988px #607ff6, 466px 990px #607ff6,
    1657px 648px #607ff6, 1249px 933px #607ff6, 1552px 1555px #607ff6,
    147px 62px #607ff6, 292px 1157px #607ff6, 1816px 423px #607ff6,
    1714px 757px #607ff6, 1036px 961px #607ff6, 1955px 710px #607ff6,
    1842px 516px #607ff6, 479px 1870px #607ff6, 1579px 1445px #607ff6,
    1225px 1309px #607ff6, 1965px 566px #607ff6, 1575px 1072px #607ff6,
    923px 329px #607ff6, 651px 1514px #607ff6, 865px 1100px #607ff6,
    782px 1873px #607ff6, 115px 299px #607ff6, 14px 1668px #607ff6,
    1666px 1817px #607ff6, 1096px 1068px #607ff6, 1462px 742px #607ff6,
    1384px 1750px #607ff6;
}

#stars4 {
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: 233px 1976px #607ff6, 1196px 1119px #607ff6, 646px 740px #607ff6,
    335px 645px #607ff6, 1119px 1452px #607ff6, 176px 1870px #607ff6,
    639px 1711px #607ff6, 647px 1388px #607ff6, 1516px 1108px #607ff6,
    464px 66px #607ff6, 331px 344px #607ff6, 772px 1189px #607ff6,
    1516px 1850px #607ff6, 1500px 1463px #607ff6, 1275px 876px #607ff6,
    1107px 645px #607ff6, 977px 478px #607ff6, 583px 1179px #607ff6,
    284px 395px #607ff6, 1220px 461px #607ff6, 1160px 249px #607ff6,
    196px 865px #607ff6, 670px 1915px #607ff6, 1449px 382px #607ff6,
    1191px 546px #607ff6, 1329px 605px #607ff6, 1945px 458px #607ff6,
    995px 749px #607ff6, 1495px 861px #607ff6, 708px 1731px #607ff6,
    348px 653px #607ff6, 548px 1298px #607ff6, 1606px 990px #607ff6,
    1049px 1204px #607ff6, 253px 1501px #607ff6, 1154px 166px #607ff6,
    1087px 104px #607ff6, 1034px 1161px #607ff6, 1681px 462px #607ff6,
    577px 1897px #607ff6, 193px 1901px #607ff6, 1701px 1755px #607ff6,
    864px 1297px #607ff6, 800px 1289px #607ff6, 676px 28px #607ff6,
    185px 1341px #607ff6, 379px 1151px #607ff6, 1224px 1725px #607ff6,
    280px 541px #607ff6, 473px 1196px #607ff6, 921px 1628px #607ff6,
    969px 432px #607ff6, 1475px 758px #607ff6, 1195px 993px #607ff6,
    876px 1840px #607ff6, 1274px 1689px #607ff6, 1977px 1101px #607ff6,
    837px 527px #607ff6, 1785px 1610px #607ff6, 1650px 1843px #607ff6,
    1127px 1508px #607ff6, 401px 1050px #607ff6, 51px 1105px #607ff6,
    545px 880px #607ff6, 1786px 1672px #607ff6, 318px 260px #607ff6,
    568px 254px #607ff6, 1026px 1527px #607ff6, 1242px 852px #607ff6,
    1785px 982px #607ff6, 1318px 1071px #607ff6, 398px 1061px #607ff6,
    1509px 257px #607ff6, 599px 928px #607ff6, 1195px 1800px #607ff6,
    1254px 906px #607ff6, 141px 26px #607ff6, 1384px 1502px #607ff6,
    476px 767px #607ff6, 1973px 722px #607ff6, 1339px 1031px #607ff6,
    778px 818px #607ff6, 213px 1320px #607ff6, 184px 221px #607ff6,
    983px 1911px #607ff6, 923px 1439px #607ff6, 1936px 581px #607ff6,
    1105px 625px #607ff6, 325px 729px #607ff6, 1475px 204px #607ff6,
    1483px 1564px #607ff6, 1327px 1272px #607ff6, 1187px 1944px #607ff6,
    1945px 1471px #607ff6, 116px 960px #607ff6, 1660px 1610px #607ff6,
    412px 1022px #607ff6, 1552px 1516px #607ff6, 1517px 1892px #607ff6,
    306px 829px #607ff6, 1416px 462px #607ff6, 1575px 1460px #607ff6,
    424px 1500px #607ff6, 1530px 1169px #607ff6, 1388px 1608px #607ff6,
    185px 416px #607ff6, 634px 1446px #607ff6, 767px 479px #607ff6,
    71px 426px #607ff6, 1937px 145px #607ff6, 1955px 1312px #607ff6,
    1811px 611px #607ff6, 1145px 569px #607ff6, 1460px 676px #607ff6,
    131px 1858px #607ff6, 1557px 473px #607ff6, 735px 130px #607ff6,
    112px 1531px #607ff6, 1312px 305px #607ff6, 409px 1032px #607ff6,
    149px 1964px #607ff6, 535px 1215px #607ff6, 1382px 630px #607ff6,
    1437px 1368px #607ff6, 362px 1181px #607ff6, 388px 181px #607ff6,
    274px 1287px #607ff6, 1858px 1414px #607ff6, 661px 1935px #607ff6,
    675px 1205px #607ff6, 1829px 1725px #607ff6, 1937px 1145px #607ff6,
    237px 908px #607ff6, 1059px 1185px #607ff6, 824px 1248px #607ff6,
    1167px 1730px #607ff6, 180px 1961px #607ff6, 1663px 203px #607ff6,
    374px 221px #607ff6, 724px 1883px #607ff6, 970px 1362px #607ff6,
    832px 505px #607ff6, 313px 233px #607ff6, 1909px 597px #607ff6,
    434px 201px #607ff6, 587px 995px #607ff6, 1833px 623px #607ff6,
    1464px 561px #607ff6, 231px 593px #607ff6, 1558px 1433px #607ff6,
    1986px 1767px #607ff6, 1753px 1728px #607ff6, 1153px 1623px #607ff6,
    249px 229px #607ff6, 1503px 1186px #607ff6, 1784px 137px #607ff6,
    841px 403px #607ff6, 1400px 354px #607ff6, 197px 499px #607ff6,
    1188px 681px #607ff6, 158px 391px #607ff6, 443px 1099px #607ff6,
    723px 1445px #607ff6, 1408px 1235px #607ff6, 1908px 195px #607ff6,
    271px 891px #607ff6, 469px 1693px #607ff6, 580px 11px #607ff6,
    1533px 70px #607ff6, 859px 761px #607ff6, 1510px 1844px #607ff6,
    421px 558px #607ff6, 1132px 1453px #607ff6, 757px 1987px #607ff6,
    212px 293px #607ff6, 569px 323px #607ff6, 1404px 1394px #607ff6,
    252px 1386px #607ff6, 1668px 1857px #607ff6, 123px 1684px #607ff6,
    105px 490px #607ff6, 1083px 1769px #607ff6, 1071px 1953px #607ff6,
    1271px 1159px #607ff6, 699px 1491px #607ff6, 1744px 1997px #607ff6,
    1868px 1973px #607ff6, 1438px 1449px #607ff6, 1222px 1921px #607ff6,
    1328px 1210px #607ff6, 438px 873px #607ff6, 809px 780px #607ff6,
    491px 1524px #607ff6, 447px 1830px #607ff6, 927px 1936px #607ff6,
    564px 691px #607ff6, 1784px 1747px #607ff6, 1978px 1722px #607ff6,
    1599px 1480px #607ff6, 1276px 729px #607ff6, 731px 1174px #607ff6,
    1586px 1711px #607ff6, 451px 1340px #607ff6, 1075px 1899px #607ff6,
    13px 575px #607ff6, 309px 1340px #607ff6, 981px 183px #607ff6,
    248px 1315px #607ff6, 849px 80px #607ff6, 1754px 1540px #607ff6,
    73px 1432px #607ff6, 1208px 1828px #607ff6, 65px 575px #607ff6,
    1098px 730px #607ff6, 127px 1358px #607ff6, 185px 19px #607ff6,
    1222px 1679px #607ff6, 1122px 315px #607ff6, 1906px 452px #607ff6,
    761px 284px #607ff6, 813px 492px #607ff6, 1344px 843px #607ff6,
    118px 1834px #607ff6, 1620px 359px #607ff6, 1755px 1246px #607ff6,
    299px 1076px #607ff6, 1746px 158px #607ff6, 6px 1635px #607ff6,
    143px 190px #607ff6, 101px 468px #607ff6, 137px 971px #607ff6,
    1221px 1929px #607ff6, 1752px 650px #607ff6, 1635px 1761px #607ff6,
    1522px 833px #607ff6, 908px 153px #607ff6, 1044px 350px #607ff6,
    1151px 1940px #607ff6, 822px 210px #607ff6, 1774px 310px #607ff6,
    796px 1447px #607ff6, 1069px 1903px #607ff6, 217px 565px #607ff6,
    662px 1370px #607ff6, 1876px 1570px #607ff6, 847px 46px #607ff6,
    1042px 1689px #607ff6, 1584px 1434px #607ff6, 1791px 908px #607ff6,
    973px 908px #607ff6, 793px 747px #607ff6, 122px 483px #607ff6,
    1137px 1374px #607ff6, 1757px 1791px #607ff6, 513px 225px #607ff6,
    63px 731px #607ff6, 1179px 1926px #607ff6, 346px 18px #607ff6,
    589px 175px #607ff6, 87px 302px #607ff6, 380px 1295px #607ff6,
    450px 921px #607ff6, 1667px 1973px #607ff6, 1495px 1373px #607ff6,
    1462px 1850px #607ff6, 540px 288px #607ff6, 1208px 1051px #607ff6,
    1554px 1095px #607ff6, 1009px 1516px #607ff6, 181px 572px #607ff6,
    165px 387px #607ff6, 549px 1835px #607ff6, 960px 16px #607ff6,
    1360px 403px #607ff6, 1251px 43px #607ff6, 1905px 1813px #607ff6,
    1106px 866px #607ff6, 1809px 277px #607ff6, 1828px 1720px #607ff6,
    295px 1610px #607ff6, 523px 166px #607ff6, 1069px 692px #607ff6,
    1292px 217px #607ff6, 11px 1721px #607ff6, 99px 1045px #607ff6,
    51px 1584px #607ff6, 1053px 266px #607ff6, 1287px 1235px #607ff6,
    747px 1722px #607ff6, 1542px 736px #607ff6, 1256px 18px #607ff6,
    102px 609px #607ff6, 586px 1339px #607ff6, 1843px 1697px #607ff6,
    824px 1687px #607ff6, 1124px 882px #607ff6, 395px 501px #607ff6,
    1456px 672px #607ff6, 1472px 1648px #607ff6, 1326px 1164px #607ff6,
    777px 1672px #607ff6, 81px 345px #607ff6, 91px 386px #607ff6,
    243px 411px #607ff6, 1560px 90px #607ff6, 6px 1771px #607ff6,
    1601px 616px #607ff6, 1220px 1808px #607ff6, 1160px 836px #607ff6,
    246px 1777px #607ff6, 456px 863px #607ff6, 97px 1138px #607ff6,
    1811px 942px #607ff6, 213px 414px #607ff6, 891px 392px #607ff6,
    1044px 927px #607ff6, 1856px 216px #607ff6, 957px 347px #607ff6,
    1486px 406px #607ff6, 838px 912px #607ff6, 803px 361px #607ff6,
    564px 826px #607ff6, 1597px 949px #607ff6, 1206px 289px #607ff6,
    33px 1035px #607ff6, 1762px 1377px #607ff6, 789px 1815px #607ff6,
    1594px 1342px #607ff6, 1668px 880px #607ff6, 1539px 1581px #607ff6,
    1547px 53px #607ff6, 861px 1433px #607ff6, 693px 1618px #607ff6,
    1762px 782px #607ff6, 1568px 682px #607ff6, 1126px 1762px #607ff6,
    1242px 134px #607ff6, 495px 959px #607ff6, 1606px 219px #607ff6,
    1878px 1415px #607ff6, 1652px 797px #607ff6, 782px 1903px #607ff6,
    1774px 1133px #607ff6, 1430px 408px #607ff6, 265px 394px #607ff6,
    890px 336px #607ff6, 1051px 311px #607ff6, 461px 1559px #607ff6,
    1931px 91px #607ff6, 1160px 380px #607ff6, 1442px 1058px #607ff6,
    1157px 364px #607ff6, 586px 227px #607ff6, 1365px 715px #607ff6,
    1658px 1655px #607ff6, 1923px 1664px #607ff6, 1023px 1844px #607ff6,
    1939px 1367px #607ff6, 1203px 1305px #607ff6, 359px 642px #607ff6,
    1056px 425px #607ff6, 787px 202px #607ff6, 1609px 1850px #607ff6,
    1964px 200px #607ff6, 1537px 586px #607ff6, 1589px 903px #607ff6,
    1063px 1694px #607ff6, 760px 1185px #607ff6, 597px 1396px #607ff6,
    294px 452px #607ff6, 433px 818px #607ff6, 199px 840px #607ff6,
    1332px 1937px #607ff6, 169px 1907px #607ff6, 591px 834px #607ff6,
    1716px 1032px #607ff6, 45px 1879px #607ff6, 686px 1469px #607ff6,
    1520px 475px #607ff6, 1122px 859px #607ff6, 973px 1541px #607ff6,
    269px 477px #607ff6, 1390px 716px #607ff6, 1791px 783px #607ff6,
    824px 2000px #607ff6, 1211px 1717px #607ff6, 1008px 1587px #607ff6,
    1422px 204px #607ff6, 234px 556px #607ff6, 506px 550px #607ff6,
    942px 1670px #607ff6, 397px 853px #607ff6, 599px 795px #607ff6,
    762px 1926px #607ff6, 1202px 1424px #607ff6, 135px 1316px #607ff6,
    1442px 1692px #607ff6, 977px 652px #607ff6, 564px 1648px #607ff6,
    997px 1474px #607ff6, 67px 1366px #607ff6, 1860px 1451px #607ff6,
    1105px 772px #607ff6, 1886px 1396px #607ff6, 1510px 658px #607ff6,
    976px 1544px #607ff6, 894px 543px #607ff6, 1098px 1189px #607ff6,
    690px 77px #607ff6, 770px 733px #607ff6, 557px 1403px #607ff6,
    1758px 1623px #607ff6, 1341px 812px #607ff6, 699px 967px #607ff6,
    277px 866px #607ff6, 1526px 1828px #607ff6, 8px 977px #607ff6,
    1707px 952px #607ff6, 12px 1900px #607ff6, 72px 921px #607ff6,
    496px 1067px #607ff6, 1288px 1749px #607ff6, 273px 984px #607ff6,
    1197px 1991px #607ff6, 242px 789px #607ff6, 903px 1035px #607ff6,
    480px 1492px #607ff6, 102px 1331px #607ff6, 738px 1343px #607ff6,
    560px 1475px #607ff6, 367px 846px #607ff6, 1420px 962px #607ff6,
    1976px 892px #607ff6, 1911px 1763px #607ff6, 1639px 1002px #607ff6,
    437px 1522px #607ff6, 1906px 1025px #607ff6, 730px 1364px #607ff6,
    1127px 521px #607ff6, 1401px 1792px #607ff6, 1954px 1066px #607ff6,
    232px 250px #607ff6, 1685px 660px #607ff6, 1011px 999px #607ff6,
    1970px 790px #607ff6, 750px 499px #607ff6, 1738px 660px #607ff6,
    1621px 1849px #607ff6, 446px 52px #607ff6, 1055px 1396px #607ff6,
    1165px 1497px #607ff6, 1740px 1425px #607ff6, 1012px 1920px #607ff6,
    1258px 1560px #607ff6, 1020px 1152px #607ff6, 362px 673px #607ff6,
    1065px 975px #607ff6, 582px 755px #607ff6, 1271px 1479px #607ff6,
    719px 548px #607ff6, 1602px 879px #607ff6, 590px 499px #607ff6,
    721px 1412px #607ff6, 1180px 113px #607ff6, 1801px 1961px #607ff6,
    589px 941px #607ff6, 883px 476px #607ff6, 214px 890px #607ff6,
    1028px 892px #607ff6, 1107px 1832px #607ff6, 944px 361px #607ff6,
    480px 1453px #607ff6, 1466px 683px #607ff6, 981px 745px #607ff6,
    1968px 828px #607ff6, 657px 1830px #607ff6, 11px 1338px #607ff6,
    179px 730px #607ff6, 1713px 197px #607ff6, 51px 955px #607ff6,
    1243px 319px #607ff6, 1175px 624px #607ff6, 446px 46px #607ff6,
    5px 1158px #607ff6, 82px 1352px #607ff6, 1877px 402px #607ff6,
    708px 1778px #607ff6, 903px 1625px #607ff6, 1824px 352px #607ff6,
    1229px 140px #607ff6, 1518px 24px #607ff6, 1017px 512px #607ff6,
    515px 699px #607ff6, 295px 265px #607ff6, 69px 1773px #607ff6,
    1640px 1163px #607ff6, 536px 342px #607ff6, 970px 1766px #607ff6,
    560px 1416px #607ff6, 577px 193px #607ff6, 469px 9px #607ff6,
    466px 276px #607ff6, 711px 853px #607ff6, 401px 685px #607ff6,
    85px 506px #607ff6, 865px 558px #607ff6, 631px 105px #607ff6,
    887px 866px #607ff6, 1704px 1001px #607ff6, 1051px 1199px #607ff6,
    275px 1909px #607ff6, 1462px 829px #607ff6, 375px 1057px #607ff6,
    1531px 1501px #607ff6, 205px 403px #607ff6, 33px 1869px #607ff6,
    967px 1176px #607ff6, 376px 863px #607ff6, 1769px 1545px #607ff6,
    535px 51px #607ff6, 1972px 1569px #607ff6, 1773px 960px #607ff6,
    487px 620px #607ff6, 1660px 687px #607ff6, 1632px 972px #607ff6,
    1362px 42px #607ff6, 479px 1655px #607ff6, 1531px 1808px #607ff6,
    1450px 1412px #607ff6, 1549px 170px #607ff6, 1904px 1305px #607ff6,
    1209px 48px #607ff6, 1933px 820px #607ff6, 1623px 595px #607ff6,
    48px 643px #607ff6, 179px 1754px #607ff6, 589px 1032px #607ff6,
    1199px 356px #607ff6, 1755px 1418px #607ff6, 780px 1174px #607ff6,
    1905px 758px #607ff6, 1567px 713px #607ff6, 1372px 705px #607ff6,
    456px 654px #607ff6, 759px 690px #607ff6, 452px 673px #607ff6,
    993px 1610px #607ff6, 1271px 188px #607ff6, 343px 1750px #607ff6,
    1943px 1735px #607ff6, 1717px 853px #607ff6, 1247px 303px #607ff6,
    1314px 1895px #607ff6, 1203px 489px #607ff6, 741px 469px #607ff6,
    4px 246px #607ff6, 1515px 115px #607ff6, 606px 218px #607ff6,
    1966px 1471px #607ff6, 177px 87px #607ff6, 1575px 588px #607ff6,
    1136px 1386px #607ff6, 70px 1868px #607ff6, 1053px 18px #607ff6,
    1124px 721px #607ff6, 1748px 1181px #607ff6, 191px 1387px #607ff6,
    1931px 840px #607ff6, 1088px 1603px #607ff6, 634px 1255px #607ff6,
    814px 1434px #607ff6, 585px 64px #607ff6, 1074px 1618px #607ff6,
    1692px 761px #607ff6, 651px 643px #607ff6, 193px 335px #607ff6,
    1103px 1447px #607ff6, 491px 1142px #607ff6, 521px 408px #607ff6,
    536px 340px #607ff6, 411px 1091px #607ff6, 1646px 193px #607ff6,
    1595px 1285px #607ff6, 870px 1349px #607ff6, 1085px 1013px #607ff6,
    204px 1864px #607ff6, 1359px 299px #607ff6, 807px 964px #607ff6,
    219px 509px #607ff6, 36px 1227px #607ff6, 702px 1873px #607ff6,
    1471px 934px #607ff6, 1763px 792px #607ff6, 973px 1957px #607ff6,
    987px 68px #607ff6, 593px 1282px #607ff6, 1900px 607px #607ff6,
    407px 1659px #607ff6, 587px 17px #607ff6, 632px 158px #607ff6;
  -webkit-animation: animStar 600s linear infinite;
  -moz-animation: animStar 600s linear infinite;
  -ms-animation: animStar 600s linear infinite;
  animation: animStar 600s linear infinite;
}
#stars4:after {
  content: " ";
  position: absolute;
  top: 2000px;
  width: 1px;
  height: 1px;
  background: transparent;
  box-shadow: 233px 1976px #607ff6, 1196px 1119px #607ff6, 646px 740px #607ff6,
    335px 645px #607ff6, 1119px 1452px #607ff6, 176px 1870px #607ff6,
    639px 1711px #607ff6, 647px 1388px #607ff6, 1516px 1108px #607ff6,
    464px 66px #607ff6, 331px 344px #607ff6, 772px 1189px #607ff6,
    1516px 1850px #607ff6, 1500px 1463px #607ff6, 1275px 876px #607ff6,
    1107px 645px #607ff6, 977px 478px #607ff6, 583px 1179px #607ff6,
    284px 395px #607ff6, 1220px 461px #607ff6, 1160px 249px #607ff6,
    196px 865px #607ff6, 670px 1915px #607ff6, 1449px 382px #607ff6,
    1191px 546px #607ff6, 1329px 605px #607ff6, 1945px 458px #607ff6,
    995px 749px #607ff6, 1495px 861px #607ff6, 708px 1731px #607ff6,
    348px 653px #607ff6, 548px 1298px #607ff6, 1606px 990px #607ff6,
    1049px 1204px #607ff6, 253px 1501px #607ff6, 1154px 166px #607ff6,
    1087px 104px #607ff6, 1034px 1161px #607ff6, 1681px 462px #607ff6,
    577px 1897px #607ff6, 193px 1901px #607ff6, 1701px 1755px #607ff6,
    864px 1297px #607ff6, 800px 1289px #607ff6, 676px 28px #607ff6,
    185px 1341px #607ff6, 379px 1151px #607ff6, 1224px 1725px #607ff6,
    280px 541px #607ff6, 473px 1196px #607ff6, 921px 1628px #607ff6,
    969px 432px #607ff6, 1475px 758px #607ff6, 1195px 993px #607ff6,
    876px 1840px #607ff6, 1274px 1689px #607ff6, 1977px 1101px #607ff6,
    837px 527px #607ff6, 1785px 1610px #607ff6, 1650px 1843px #607ff6,
    1127px 1508px #607ff6, 401px 1050px #607ff6, 51px 1105px #607ff6,
    545px 880px #607ff6, 1786px 1672px #607ff6, 318px 260px #607ff6,
    568px 254px #607ff6, 1026px 1527px #607ff6, 1242px 852px #607ff6,
    1785px 982px #607ff6, 1318px 1071px #607ff6, 398px 1061px #607ff6,
    1509px 257px #607ff6, 599px 928px #607ff6, 1195px 1800px #607ff6,
    1254px 906px #607ff6, 141px 26px #607ff6, 1384px 1502px #607ff6,
    476px 767px #607ff6, 1973px 722px #607ff6, 1339px 1031px #607ff6,
    778px 818px #607ff6, 213px 1320px #607ff6, 184px 221px #607ff6,
    983px 1911px #607ff6, 923px 1439px #607ff6, 1936px 581px #607ff6,
    1105px 625px #607ff6, 325px 729px #607ff6, 1475px 204px #607ff6,
    1483px 1564px #607ff6, 1327px 1272px #607ff6, 1187px 1944px #607ff6,
    1945px 1471px #607ff6, 116px 960px #607ff6, 1660px 1610px #607ff6,
    412px 1022px #607ff6, 1552px 1516px #607ff6, 1517px 1892px #607ff6,
    306px 829px #607ff6, 1416px 462px #607ff6, 1575px 1460px #607ff6,
    424px 1500px #607ff6, 1530px 1169px #607ff6, 1388px 1608px #607ff6,
    185px 416px #607ff6, 634px 1446px #607ff6, 767px 479px #607ff6,
    71px 426px #607ff6, 1937px 145px #607ff6, 1955px 1312px #607ff6,
    1811px 611px #607ff6, 1145px 569px #607ff6, 1460px 676px #607ff6,
    131px 1858px #607ff6, 1557px 473px #607ff6, 735px 130px #607ff6,
    112px 1531px #607ff6, 1312px 305px #607ff6, 409px 1032px #607ff6,
    149px 1964px #607ff6, 535px 1215px #607ff6, 1382px 630px #607ff6,
    1437px 1368px #607ff6, 362px 1181px #607ff6, 388px 181px #607ff6,
    274px 1287px #607ff6, 1858px 1414px #607ff6, 661px 1935px #607ff6,
    675px 1205px #607ff6, 1829px 1725px #607ff6, 1937px 1145px #607ff6,
    237px 908px #607ff6, 1059px 1185px #607ff6, 824px 1248px #607ff6,
    1167px 1730px #607ff6, 180px 1961px #607ff6, 1663px 203px #607ff6,
    374px 221px #607ff6, 724px 1883px #607ff6, 970px 1362px #607ff6,
    832px 505px #607ff6, 313px 233px #607ff6, 1909px 597px #607ff6,
    434px 201px #607ff6, 587px 995px #607ff6, 1833px 623px #607ff6,
    1464px 561px #607ff6, 231px 593px #607ff6, 1558px 1433px #607ff6,
    1986px 1767px #607ff6, 1753px 1728px #607ff6, 1153px 1623px #607ff6,
    249px 229px #607ff6, 1503px 1186px #607ff6, 1784px 137px #607ff6,
    841px 403px #607ff6, 1400px 354px #607ff6, 197px 499px #607ff6,
    1188px 681px #607ff6, 158px 391px #607ff6, 443px 1099px #607ff6,
    723px 1445px #607ff6, 1408px 1235px #607ff6, 1908px 195px #607ff6,
    271px 891px #607ff6, 469px 1693px #607ff6, 580px 11px #607ff6,
    1533px 70px #607ff6, 859px 761px #607ff6, 1510px 1844px #607ff6,
    421px 558px #607ff6, 1132px 1453px #607ff6, 757px 1987px #607ff6,
    212px 293px #607ff6, 569px 323px #607ff6, 1404px 1394px #607ff6,
    252px 1386px #607ff6, 1668px 1857px #607ff6, 123px 1684px #607ff6,
    105px 490px #607ff6, 1083px 1769px #607ff6, 1071px 1953px #607ff6,
    1271px 1159px #607ff6, 699px 1491px #607ff6, 1744px 1997px #607ff6,
    1868px 1973px #607ff6, 1438px 1449px #607ff6, 1222px 1921px #607ff6,
    1328px 1210px #607ff6, 438px 873px #607ff6, 809px 780px #607ff6,
    491px 1524px #607ff6, 447px 1830px #607ff6, 927px 1936px #607ff6,
    564px 691px #607ff6, 1784px 1747px #607ff6, 1978px 1722px #607ff6,
    1599px 1480px #607ff6, 1276px 729px #607ff6, 731px 1174px #607ff6,
    1586px 1711px #607ff6, 451px 1340px #607ff6, 1075px 1899px #607ff6,
    13px 575px #607ff6, 309px 1340px #607ff6, 981px 183px #607ff6,
    248px 1315px #607ff6, 849px 80px #607ff6, 1754px 1540px #607ff6,
    73px 1432px #607ff6, 1208px 1828px #607ff6, 65px 575px #607ff6,
    1098px 730px #607ff6, 127px 1358px #607ff6, 185px 19px #607ff6,
    1222px 1679px #607ff6, 1122px 315px #607ff6, 1906px 452px #607ff6,
    761px 284px #607ff6, 813px 492px #607ff6, 1344px 843px #607ff6,
    118px 1834px #607ff6, 1620px 359px #607ff6, 1755px 1246px #607ff6,
    299px 1076px #607ff6, 1746px 158px #607ff6, 6px 1635px #607ff6,
    143px 190px #607ff6, 101px 468px #607ff6, 137px 971px #607ff6,
    1221px 1929px #607ff6, 1752px 650px #607ff6, 1635px 1761px #607ff6,
    1522px 833px #607ff6, 908px 153px #607ff6, 1044px 350px #607ff6,
    1151px 1940px #607ff6, 822px 210px #607ff6, 1774px 310px #607ff6,
    796px 1447px #607ff6, 1069px 1903px #607ff6, 217px 565px #607ff6,
    662px 1370px #607ff6, 1876px 1570px #607ff6, 847px 46px #607ff6,
    1042px 1689px #607ff6, 1584px 1434px #607ff6, 1791px 908px #607ff6,
    973px 908px #607ff6, 793px 747px #607ff6, 122px 483px #607ff6,
    1137px 1374px #607ff6, 1757px 1791px #607ff6, 513px 225px #607ff6,
    63px 731px #607ff6, 1179px 1926px #607ff6, 346px 18px #607ff6,
    589px 175px #607ff6, 87px 302px #607ff6, 380px 1295px #607ff6,
    450px 921px #607ff6, 1667px 1973px #607ff6, 1495px 1373px #607ff6,
    1462px 1850px #607ff6, 540px 288px #607ff6, 1208px 1051px #607ff6,
    1554px 1095px #607ff6, 1009px 1516px #607ff6, 181px 572px #607ff6,
    165px 387px #607ff6, 549px 1835px #607ff6, 960px 16px #607ff6,
    1360px 403px #607ff6, 1251px 43px #607ff6, 1905px 1813px #607ff6,
    1106px 866px #607ff6, 1809px 277px #607ff6, 1828px 1720px #607ff6,
    295px 1610px #607ff6, 523px 166px #607ff6, 1069px 692px #607ff6,
    1292px 217px #607ff6, 11px 1721px #607ff6, 99px 1045px #607ff6,
    51px 1584px #607ff6, 1053px 266px #607ff6, 1287px 1235px #607ff6,
    747px 1722px #607ff6, 1542px 736px #607ff6, 1256px 18px #607ff6,
    102px 609px #607ff6, 586px 1339px #607ff6, 1843px 1697px #607ff6,
    824px 1687px #607ff6, 1124px 882px #607ff6, 395px 501px #607ff6,
    1456px 672px #607ff6, 1472px 1648px #607ff6, 1326px 1164px #607ff6,
    777px 1672px #607ff6, 81px 345px #607ff6, 91px 386px #607ff6,
    243px 411px #607ff6, 1560px 90px #607ff6, 6px 1771px #607ff6,
    1601px 616px #607ff6, 1220px 1808px #607ff6, 1160px 836px #607ff6,
    246px 1777px #607ff6, 456px 863px #607ff6, 97px 1138px #607ff6,
    1811px 942px #607ff6, 213px 414px #607ff6, 891px 392px #607ff6,
    1044px 927px #607ff6, 1856px 216px #607ff6, 957px 347px #607ff6,
    1486px 406px #607ff6, 838px 912px #607ff6, 803px 361px #607ff6,
    564px 826px #607ff6, 1597px 949px #607ff6, 1206px 289px #607ff6,
    33px 1035px #607ff6, 1762px 1377px #607ff6, 789px 1815px #607ff6,
    1594px 1342px #607ff6, 1668px 880px #607ff6, 1539px 1581px #607ff6,
    1547px 53px #607ff6, 861px 1433px #607ff6, 693px 1618px #607ff6,
    1762px 782px #607ff6, 1568px 682px #607ff6, 1126px 1762px #607ff6,
    1242px 134px #607ff6, 495px 959px #607ff6, 1606px 219px #607ff6,
    1878px 1415px #607ff6, 1652px 797px #607ff6, 782px 1903px #607ff6,
    1774px 1133px #607ff6, 1430px 408px #607ff6, 265px 394px #607ff6,
    890px 336px #607ff6, 1051px 311px #607ff6, 461px 1559px #607ff6,
    1931px 91px #607ff6, 1160px 380px #607ff6, 1442px 1058px #607ff6,
    1157px 364px #607ff6, 586px 227px #607ff6, 1365px 715px #607ff6,
    1658px 1655px #607ff6, 1923px 1664px #607ff6, 1023px 1844px #607ff6,
    1939px 1367px #607ff6, 1203px 1305px #607ff6, 359px 642px #607ff6,
    1056px 425px #607ff6, 787px 202px #607ff6, 1609px 1850px #607ff6,
    1964px 200px #607ff6, 1537px 586px #607ff6, 1589px 903px #607ff6,
    1063px 1694px #607ff6, 760px 1185px #607ff6, 597px 1396px #607ff6,
    294px 452px #607ff6, 433px 818px #607ff6, 199px 840px #607ff6,
    1332px 1937px #607ff6, 169px 1907px #607ff6, 591px 834px #607ff6,
    1716px 1032px #607ff6, 45px 1879px #607ff6, 686px 1469px #607ff6,
    1520px 475px #607ff6, 1122px 859px #607ff6, 973px 1541px #607ff6,
    269px 477px #607ff6, 1390px 716px #607ff6, 1791px 783px #607ff6,
    824px 2000px #607ff6, 1211px 1717px #607ff6, 1008px 1587px #607ff6,
    1422px 204px #607ff6, 234px 556px #607ff6, 506px 550px #607ff6,
    942px 1670px #607ff6, 397px 853px #607ff6, 599px 795px #607ff6,
    762px 1926px #607ff6, 1202px 1424px #607ff6, 135px 1316px #607ff6,
    1442px 1692px #607ff6, 977px 652px #607ff6, 564px 1648px #607ff6,
    997px 1474px #607ff6, 67px 1366px #607ff6, 1860px 1451px #607ff6,
    1105px 772px #607ff6, 1886px 1396px #607ff6, 1510px 658px #607ff6,
    976px 1544px #607ff6, 894px 543px #607ff6, 1098px 1189px #607ff6,
    690px 77px #607ff6, 770px 733px #607ff6, 557px 1403px #607ff6,
    1758px 1623px #607ff6, 1341px 812px #607ff6, 699px 967px #607ff6,
    277px 866px #607ff6, 1526px 1828px #607ff6, 8px 977px #607ff6,
    1707px 952px #607ff6, 12px 1900px #607ff6, 72px 921px #607ff6,
    496px 1067px #607ff6, 1288px 1749px #607ff6, 273px 984px #607ff6,
    1197px 1991px #607ff6, 242px 789px #607ff6, 903px 1035px #607ff6,
    480px 1492px #607ff6, 102px 1331px #607ff6, 738px 1343px #607ff6,
    560px 1475px #607ff6, 367px 846px #607ff6, 1420px 962px #607ff6,
    1976px 892px #607ff6, 1911px 1763px #607ff6, 1639px 1002px #607ff6,
    437px 1522px #607ff6, 1906px 1025px #607ff6, 730px 1364px #607ff6,
    1127px 521px #607ff6, 1401px 1792px #607ff6, 1954px 1066px #607ff6,
    232px 250px #607ff6, 1685px 660px #607ff6, 1011px 999px #607ff6,
    1970px 790px #607ff6, 750px 499px #607ff6, 1738px 660px #607ff6,
    1621px 1849px #607ff6, 446px 52px #607ff6, 1055px 1396px #607ff6,
    1165px 1497px #607ff6, 1740px 1425px #607ff6, 1012px 1920px #607ff6,
    1258px 1560px #607ff6, 1020px 1152px #607ff6, 362px 673px #607ff6,
    1065px 975px #607ff6, 582px 755px #607ff6, 1271px 1479px #607ff6,
    719px 548px #607ff6, 1602px 879px #607ff6, 590px 499px #607ff6,
    721px 1412px #607ff6, 1180px 113px #607ff6, 1801px 1961px #607ff6,
    589px 941px #607ff6, 883px 476px #607ff6, 214px 890px #607ff6,
    1028px 892px #607ff6, 1107px 1832px #607ff6, 944px 361px #607ff6,
    480px 1453px #607ff6, 1466px 683px #607ff6, 981px 745px #607ff6,
    1968px 828px #607ff6, 657px 1830px #607ff6, 11px 1338px #607ff6,
    179px 730px #607ff6, 1713px 197px #607ff6, 51px 955px #607ff6,
    1243px 319px #607ff6, 1175px 624px #607ff6, 446px 46px #607ff6,
    5px 1158px #607ff6, 82px 1352px #607ff6, 1877px 402px #607ff6,
    708px 1778px #607ff6, 903px 1625px #607ff6, 1824px 352px #607ff6,
    1229px 140px #607ff6, 1518px 24px #607ff6, 1017px 512px #607ff6,
    515px 699px #607ff6, 295px 265px #607ff6, 69px 1773px #607ff6,
    1640px 1163px #607ff6, 536px 342px #607ff6, 970px 1766px #607ff6,
    560px 1416px #607ff6, 577px 193px #607ff6, 469px 9px #607ff6,
    466px 276px #607ff6, 711px 853px #607ff6, 401px 685px #607ff6,
    85px 506px #607ff6, 865px 558px #607ff6, 631px 105px #607ff6,
    887px 866px #607ff6, 1704px 1001px #607ff6, 1051px 1199px #607ff6,
    275px 1909px #607ff6, 1462px 829px #607ff6, 375px 1057px #607ff6,
    1531px 1501px #607ff6, 205px 403px #607ff6, 33px 1869px #607ff6,
    967px 1176px #607ff6, 376px 863px #607ff6, 1769px 1545px #607ff6,
    535px 51px #607ff6, 1972px 1569px #607ff6, 1773px 960px #607ff6,
    487px 620px #607ff6, 1660px 687px #607ff6, 1632px 972px #607ff6,
    1362px 42px #607ff6, 479px 1655px #607ff6, 1531px 1808px #607ff6,
    1450px 1412px #607ff6, 1549px 170px #607ff6, 1904px 1305px #607ff6,
    1209px 48px #607ff6, 1933px 820px #607ff6, 1623px 595px #607ff6,
    48px 643px #607ff6, 179px 1754px #607ff6, 589px 1032px #607ff6,
    1199px 356px #607ff6, 1755px 1418px #607ff6, 780px 1174px #607ff6,
    1905px 758px #607ff6, 1567px 713px #607ff6, 1372px 705px #607ff6,
    456px 654px #607ff6, 759px 690px #607ff6, 452px 673px #607ff6,
    993px 1610px #607ff6, 1271px 188px #607ff6, 343px 1750px #607ff6,
    1943px 1735px #607ff6, 1717px 853px #607ff6, 1247px 303px #607ff6,
    1314px 1895px #607ff6, 1203px 489px #607ff6, 741px 469px #607ff6,
    4px 246px #607ff6, 1515px 115px #607ff6, 606px 218px #607ff6,
    1966px 1471px #607ff6, 177px 87px #607ff6, 1575px 588px #607ff6,
    1136px 1386px #607ff6, 70px 1868px #607ff6, 1053px 18px #607ff6,
    1124px 721px #607ff6, 1748px 1181px #607ff6, 191px 1387px #607ff6,
    1931px 840px #607ff6, 1088px 1603px #607ff6, 634px 1255px #607ff6,
    814px 1434px #607ff6, 585px 64px #607ff6, 1074px 1618px #607ff6,
    1692px 761px #607ff6, 651px 643px #607ff6, 193px 335px #607ff6,
    1103px 1447px #607ff6, 491px 1142px #607ff6, 521px 408px #607ff6,
    536px 340px #607ff6, 411px 1091px #607ff6, 1646px 193px #607ff6,
    1595px 1285px #607ff6, 870px 1349px #607ff6, 1085px 1013px #607ff6,
    204px 1864px #607ff6, 1359px 299px #607ff6, 807px 964px #607ff6,
    219px 509px #607ff6, 36px 1227px #607ff6, 702px 1873px #607ff6,
    1471px 934px #607ff6, 1763px 792px #607ff6, 973px 1957px #607ff6,
    987px 68px #607ff6, 593px 1282px #607ff6, 1900px 607px #607ff6,
    407px 1659px #607ff6, 587px 17px #607ff6, 632px 158px #607ff6;
}

@keyframes animStar {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-2000px);
  }
}

.winner-header {
  padding: 50px;
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
  z-index: 100;
}

.winner-header-left {
  display: flex;
  column-gap: 10px;
  position: relative;
  z-index: 100;
}

.back-btn {
  width: 57px;
  height: 51px;
  line-height: 51px;
  border: 2px solid #1de4ae;
  box-shadow: 1px 5px 0 #004867;
  border-radius: 8px;
  text-align: center;
  font-size: 26px;
  cursor: pointer;
  .fa-long-arrow-left:before {
    color: #1de4ae;
  }
}

.prize-pot {
  display: flex;
  align-items: center;
  column-gap: 15px;
  padding: 0 10px;
  height: 56px;
  background: #242d4d;
  border: 2px solid #1de4ae;
  box-shadow: 4px 4px 0px #004867;
  border-radius: 12px;
}

.prize-num {
  line-height: 23px;
  font-size: 23px;
}

.bound {
  cursor: pointer;
  font-size: 23px;
  padding-right: 20px;
  display: flex;
}

.winner-title {
  font-weight: bold;
  font-size: 30px;
}

.m-winner-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  display: none;
}

.winner-account {
  width: 56%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 100;
}

.winner-account-infos {
  display: flex;
  column-gap: 10px;
  align-items: center;
  padding-bottom: 4px;
  padding-right: 4px;
  overflow: hidden;
}

.head-menu {
  display: none;
}

.winner-count-down {
  font-size: 20px;
  font-weight: bold;
  height: 55px;
  line-height: 45px;
  width: 170px;
  text-shadow: 0 3px 0 rgba(14, 23, 79, 0.2);
  background: #242d4d;
  border: 2px solid #1de4ae;
  box-shadow: 4px 4px 0 #004867;
  border-radius: 12px;
  padding: 2px 10px;
  cursor: pointer;
  text-align: center;
}

.winner-award,
.winner-medium,
.winner-accountInfo {
  min-width: 60px;
  height: 50px;
  line-height: 50px;
  width: 54px;
  background: #242d4d;
  border: 2px solid #1de4ae;
  box-shadow: 4px 4px 0 #004867;
  opacity: 1;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
}

.winner-accountInfo img {
  border-radius: 17px;
}

.winner-accountInfo {
  padding: 0 10px;
}

.winner-accountInfo .nickName {
  margin-left: 10px;
}

.winner-tips {
  text-align: center;
  width: 687px;
  height: 45px;
  line-height: 40px;
  background: #242d4d;
  border: 2px solid #1de4ae;
  margin: 0 auto;
  border-radius: 12px;
  display: flex;
  justify-content: space-around;
  position: relative;
}

.tips-logo {
  width: 50px;
  height: 50px;
  line-height: 48px;
  background: #242d4d;
  border: 2px solid #1de4ae;
  border-radius: 50%;
  opacity: 1;
  position: absolute;
  left: -20px;
  top: -5px;
}

.winnerTipsItem {
  height: 73px;
  line-height: 73px;
  font-size: 25px;
  color: #fff;
}

.winner-content-cards {
  display: flex;
  justify-content: space-around;
  margin-top: 28px;
}

.winner-content-card {
  width: 336px;
  height: 386px;
  background: #242d4d;
  border: 4px solid #1de4ae;
  border-radius: 30px;
  position: relative;
  text-align: center;
  padding: 10px;
}

.winner-card-desc {
  margin-top: 30px;
  padding: 0 35px;
  font-size: 18px;
  font-family: Poppins, serif;
  font-weight: 400;
  line-height: 26px;
}

.winner-content-card-status {
  width: 180px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 25px;
  background: #1ccd8c;
  margin: 0 auto;
  margin-top: -15px;
  border-radius: 0 0 15px 15px;
}

.winner-card-footer {
  position: absolute;
  width: 95%;
  bottom: 0;
}

.winner-card-footer-img {
  text-align: center;
  position: relative;
}

.maskCountdown {
  position: absolute;
  width: 186px;
  height: 186px;
  background: rgba(0, 11, 83, 0.5);
  top: 5px;
  left: 50%;
  color: #fff;
  font-size: 24px;
  margin-left: -90px;
  border-radius: 50%;
  text-align: center;
  line-height: 200px;
  opacity: 0;
  border: 8px solid rgba(83, 83, 255, 0.4);
}

.maskCountdown:hover {
  cursor: pointer;
  opacity: 1;
  transform: scale(1.1);
  border-top-color: rgba(0, 0, 255, 0.4);
  border-left-color: rgba(0, 0, 255, 0.4);
  border-bottom-color: rgba(0, 0, 255, 0.4);
  border-right-color: rgba(0, 0, 255, 0.4);
  transition: transform 0.2s;
  transition: transform 0.2s, border-top-color 0.18s linear,
    border-left-color 0.18s linear 0.1s, border-bottom-color 0.18s linear 0.2s,
    border-right-color 0.18s linear 0.15s;
}

.winner-btn-now {
  background: #0f8dbc;
}

.winner-btn-later {
  background: #fdbd50;
}

.winner-profile-wrapper {
  width: 647px;
  background: #242d4d;
  border: 4px solid #1de4ae;
  border-radius: 33px;
  margin: 0 auto;
  padding: 20px 60px;
  text-align: left;
}

.profile-title {
  font-size: 20px;
  font-weight: bold;
  padding: 5px 0 10px 0;
  margin-top: 30px;
}

.profile-user-name .ant-input {
  height: 54px;
  line-height: 54px;
  font-size: 20px;
  background: #fff;
  border: 2px solid #1de4ae;
  color: #242d4d;
  border-radius: 17px;
}

.profile-address .ant-input {
  height: 54px;
  line-height: 54px;
  background: #284265;
  border-radius: 27px;
  border: none;
  color: #fff;
  font-size: 16px;
  font-family: Poppins, serif;
  font-weight: 400;
  padding: 0 20px;
}

.profile-avatar-info {
  width: 54px;
  height: 54px;
  background: #595959;
  border-radius: 50%;
  position: relative;
  border: 2px solid #fff;
}

.profile-avatar-info img {
  border-radius: 50%;
  position: absolute;
  cursor: pointer;
}

.profile-avatar-info img:hover {
  opacity: 0.3;
}

.profile-avatars {
  display: flex;
  column-gap: 20px;
  row-gap: 10px;
  flex-wrap: wrap;
}

.profile-avatar-info-select {
  border: 2px solid #0b5944;
}

.profile-avatar-select {
  width: 50px;
  height: 50px;
  background: #1de4ae;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  text-align: center;
  line-height: 56px;
  opacity: 0.8;
  font-weight: bold;
  color: #fff;
  font-size: 23px;
}

.profile-btn {
  width: 144px;
  height: 53px;
  line-height: 53px;
  font-size: 25px;
  text-align: center;
  background: #1de4ae;
  box-shadow: 1px 5px 0 #004867;
  border-radius: 15px;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
}

.my-rewards-wrapper {
  text-align: center;
  position: relative;
  margin-top: -80px;
}

.my-rewards-title {
  font-size: 28px;
  line-height: 0;
  padding-bottom: 50px;
}

.my-rewards-switch-btn {
  display: flex;
  width: 500px;
  border-radius: 15px;
  margin: 20px auto;
  border: 2px solid #1de4ae;
}

.my-rewards-btn {
  background: #192744;
  color: #fff;
  width: 250px;
  height: 53px;
  line-height: 53px;
  text-align: center;
  cursor: pointer;
  border-radius: 13px 0 0 13px;
}

.todayBtn {
  border-radius: 13px 0 0 13px;
}

.my-rewards-total-selected {
  color: #242d4d;
  background: #1de4ae;
  border-radius: 0 13px 13px 0;
}

.my-rewards-btn-selected {
  color: #242d4d;
  background: #1de4ae;
}

.romanBtn {
  border-radius: 0 13px 13px 0;
}

.my-rewards-content {
  width: 494px;
  height: 410px;
  margin: 0 auto;
  background: #242d4d;
  border: 2px solid #1de4ae;
  box-shadow: 15px 20px 20px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  padding: 50px 10px;
}

.my-rewards-content-avatar {
  text-align: center;
  margin: 0 auto;
}

.my-rewards-content-avatar img {
  width: 138px;
  border: 6px solid #fff;
  border-radius: 150px;
}

.my-rewards-content-name {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  padding: 20px 0;
}

.my-rewards-content-ares {
  width: 263px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 28px;
  background: #284265;
  border-radius: 22px;
  margin: 0 auto;
}

.win-record {
  display: flex;
  align-items: center;
  font-size: 14px;
  font-family: Poppins;
  column-gap: 10px;
  cursor: pointer;
  justify-content: center;
  margin-top: 20px;
  border-radius: 12px;
  padding: 5px;
  border: 2px solid #1de4ae;
}

.record-btns {
  display: flex;
  justify-content: center;
  column-gap: 20px;
}

.rewardsExtractBtn,
.winTableBtn {
  width: 144px;
  height: 53px;
  line-height: 53px;
  font-size: 25px;
  text-align: center;
  background: #1de4ae;
  box-shadow: 1px 5px 0 #004867;
  border-radius: 15px;
  cursor: pointer;
  margin: 0 auto;
  margin-top: 20px;
  position: relative;
  overflow: hidden;
}

.winTableBtn {
  width: 120px;
  height: 45px;
  line-height: 45px;
  font-size: 20px;
  margin-top: 0;
  font-family: "Moriis roman", serif;
}

.marquee-box {
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: white;
  font-size: 20px;
  letter-spacing: 0;
  padding: 0 20px;
}

.marquee-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.marquee-item {
  .marquee-text {
    padding: 0 20px;
    white-space: nowrap;
    display: inline-block;
    font-size: 20px;
  }
}

.modalTitle {
  font-weight: bold;
  color: #fff;
  text-align: center;
  width: 100%;
  font-size: 30px;
  padding-bottom: 10px;
}

.rewards-less-wrapper {
  font-family: "Moriis roman", serif;
  text-align: center;
  font-size: 25px;
  color: #fff;
}

.extract-max-btn {
  width: 114px;
  height: 47px;
  line-height: 47px;
  background: #0025ac;
  box-shadow: 1px 5px 0 #004867;
  border-radius: 15px;
  text-align: center;
  margin-left: 10px;
  font-size: 25px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.extract-footer-btn {
  width: 200px;
}

.less-btn {
  width: 100px;
  margin: 10px auto;
}

@media screen and (max-width: 1300px) {
  .winner-wrapper {
    padding: 0 60px 50px 60px;
  }
  .winner-header {
    padding: 50px 0;
    width: 100%;
  }
  .winner-content-card {
    width: 336px;
    height: 410px;
  }
}

@media screen and (min-width: 1300px) {
  .winner-wrapper {
    padding: 0 60px 50px 60px;
  }
  .winner-header {
    padding: 50px 0;
    width: 100%;
  }
  .winner-content-card {
    width: 336px;
    height: 410px;
  }
}

@media screen and (max-width: 750px) {
  .winner-wrapper {
    padding: 0 20px 50px 20px;
  }
  .winner-tips {
    width: 290px;
    height: 39px;
    line-height: 39px;
    margin-top: 20px;
    border-radius: 20px;
    .tips-logo {
      top: -10px;
    }
  }
  .winner-header {
    justify-content: center;
    column-gap: 6px;
  }
  .winner-tips img {
    width: 30px;
  }

  .prize-pot {
    font-size: 12px;
    height: 49px;
    width: 137px;
    img {
      width: 40px;
    }
    .prize-num {
      font-size: 14px;
    }
  }

  .m-backBtn {
    position: absolute;
    top: 66px;
  }

  .back-btn {
    height: 40px;
    width: 48px;
    line-height: 40px;
  }

  .bound {
    display: none;
  }

  .winner-title {
    position: absolute;
    top: 100px;
    right: 32px;
    font-size: 20px;
    display: none;
  }

  .m-winner-title {
    display: block;
  }

  .winner-account {
    width: initial;
  }

  .winner-account-infos {
    overflow: visible;
    .winner-award,
    .winner-medium,
    .winner-accountInfo {
      display: none;
    }
    .winner-count-down {
      display: block;
      width: 126px;
      height: 49px;
      line-height: 49px;
      font-size: 14px;
      padding: 0 2px;
      img {
        width: 30px;
      }
    }
    div:last-child {
      display: block;
    }
  }

  .head-menu {
    width: 54px;
    position: relative;
    .winner-award,
    .winner-medium,
    .winner-accountInfo {
      display: block;
      min-width: 52px;
    }
    .sub-menu {
      position: absolute;
      z-index: 100;
    }
    .sub-menu > div {
      margin-top: 5px;
    }
  }

  .my-rewards-wrapper {
    margin-top: 30px;
  }

  .menu-icon {
    width: 54px;
    height: 49px;
    background: #284265;
    border: 2px solid #1de4ae;
    box-shadow: 4px 4px 0 #004867;
    opacity: 1;
    border-radius: 12px;
    text-align: center;
    line-height: 58px;
  }

  .winner-profile-wrapper {
    width: 322px;
    margin-top: 47px;
    padding: 8px 18px 18px 18px;
    .profile-title {
      margin-left: 16px;
      font-size: 16px;
    }
    .profile-user-name .ant-input {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      border-radius: 14px;
    }
    .profile-address .ant-input {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      border-radius: 14px;
      color: #fff;
    }
    .profile-avatars {
      column-gap: 12px;
    }
    .profile-avatar-info {
      width: 47px;
      height: 47px;
      img {
        width: 43px;
        height: 43px;
      }
    }
    .profile-avatar-select {
      width: 47px;
      height: 47px;
      top: -2px;
      left: -2px;
    }
    .profile-btn {
      width: 78px;
      height: 32px;
      font-size: 14px;
      line-height: 35px;
    }
  }

  .winner-content-cards {
    display: block;
    div:first-child {
      .winner-card-footer-img {
        img {
          height: 143px;
        }
      }
    }
    .winner-content-card:not(:first-child) {
      .winner-card-footer-img {
        img {
          width: 150px;
        }
      }
    }
  }

  .maskCountdown {
    width: 139px;
    height: 138px;
    font-size: 14px;
    margin-left: -70px;
    line-height: 138px;
  }

  .winner-content-card {
    width: 296px;
    height: 296px;
    margin: 0 auto;
    margin-bottom: 20px;
  }

  .winner-content-card-status {
    width: 122px;
    height: 32px;
    line-height: 32px;
    font-size: 20px;
  }

  .winner-card-desc {
    padding: 0 15px;
    line-height: 22px;
    font-size: 18px;
  }

  .marquee-item {
    height: 32px;
    line-height: 32px;
  }
  .marquee-item .marquee-text {
    font-size: 12px;
    height: 37px;
    line-height: 36px;
  }

  .my-rewards-switch-btn {
    width: 300px;
  }

  .my-rewards-content {
    width: 340px;
  }

  .shareCardBtn {
    width: 135px;
  }
  .shareTips {
    bottom: -115;
    width: 300px;
    right: -83px;
    line-height: 26px;
  }

  .win-record {
    line-height: 20px;
    column-gap: 0;
    img {
      width: 30px;
    }
  }
}
</style>
