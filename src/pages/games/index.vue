<template>
  <div :class="['games-wrapper']">
    <div class="header">
      <div class="games-logo" @click="goBack">
        <img src="@/assets/images/logo.png" alt="" />
      </div>

      <div :class="['win-now', gamesStatus === '' ? '' : 'hide-back']">
        <div v-if="gamesStatus === ''">
          <div class="back-btn" @click="goBack">
            <i class="fa fa-long-arrow-left" aria-hidden="true"></i>
          </div>
        </div>
        <div class="win-title">{{ lg("win_now").toUpperCase() }} ！</div>
      </div>
      <div class="m-win-title">{{ lg("win_now").toUpperCase() }}！</div>
    </div>
    <div class="games-content">
      <div class="gods-content" v-if="gamesStatus === ''">
        <div class="gods">
          <!--<div  class="god-info-items"  @click="gamePlay(item, index)"-->
          <div
            :class="[
              'god-info-items',
              godInfoRotate ? 'god-info-items-rotate' : '',
            ]"
            @click="gamePlay(item, index)"
            v-for="(item, index) in gameGods"
            :key="index"
            @mousemove="playSound(item.name)"
            @mouseleave="stopSound(item.name)"
          >
            <div
              :class="[
                'godInfo',
                godInfoRotate ? 'god-info-rotate-back' : '',
                isSelectGod ? 'god-info-ani' : '',
                isSelectGod && !godInfoRotate ? 'god-info-rotate-front' : '',
              ]"
            >
              <card :data-image="item.url" :showAni="!godInfoRotate">
                <template v-slot:header>
                  <h1 style="color: #fff; font-size: 20px">
                    {{ lg(item.name) }}
                  </h1>
                </template>
                <template v-slot:content>
                  <p>{{ lg(item.desc) }}</p>
                </template>
              </card>
            </div>

            <div
              :class="[
                'godInfoBack',
                godInfoRotate
                  ? 'god-info-rotate-front'
                  : 'god-info-rotate-back',
              ]"
            >
              <span v-if="index === selectGodIndex" />
              <span v-if="index === selectGodIndex" />
              <span v-if="index === selectGodIndex" />
              <span v-if="index === selectGodIndex" />
              <div class="god-info-back-content">
                {{ cards_bonus[index] }} ARES
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="godInformation" v-if="gamesStatus === 'godInfo'">
        <span />
        <span />
        <span />
        <span />
        <div class="god-Information-title">
          <img :src="gods[godsIndex].typeImg" alt="" width="30" />
          {{ lg(gods[godsIndex].army) }}
        </div>
        <div class="god-Information-content">
          <div class="god-Information-content-avatar">
            <img :src="gods[godsIndex].url" alt="" width="200" />
          </div>
          <div>
            <div class="god-information-name">
              {{ lg(gods[godsIndex].name) }}
            </div>
            <div class="god-information-desc">
              {{ lg(gods[godsIndex].desc) }}
            </div>
            <div class="god-information-slogan">
              {{ lg(gods[godsIndex].slogan) }}
            </div>
          </div>
        </div>
        <div class="god-information-btn" @click="showGodWin">OK</div>
      </div>

      <div class="godWinCard" v-if="gamesStatus === 'godWin'">
        <div class="god-win-card-title">{{ lg(gods[godsIndex].name) }}</div>
        <div class="god-win-card-avatar">
          <img :src="gods[godsIndex].url" alt="" width="150" />
        </div>
        <div class="god-win-card-desc">
          {{ lg(gods[godsIndex].desc) }} helped you Get
        </div>
        <div class="god-win-card-ares">
          <img src="@/assets/images/coin.png" alt="" width="40" />
          {{ bonus }} DISC
        </div>
        <div class="god-win-card-btn" @click="turnCard">OK</div>
      </div>

      <div class="broadcast" v-show="broadcasts.length > 0 && broadcastShow">
        <div class="broadcastImg">
          <img src="../../assets/image/broadcast.png" alt="" width="35" />
        </div>
        <div class="marqueeBox">
          <div class="marqueeWrapper" ref="gameMarqueeWrapper">
            <div class="marqueeItem" ref="gameMarqueeItem">
              <!--<div class="marqueeText" v-for="(item, index) in broadcasts" :key="index">{{item}}</div>-->
              <div class="marqueeText">
                {{ broadcasts[showBroadcastsIndex] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <a-modal
      title=""
      :visible="showPlayed"
      :footer="null"
      :closable="false"
      v-if="showPlayed"
      :width="750"
      :centered="true"
    >
      <div class="playedWrapper">
        <div v-if="showPlayedType === 'played'">
          {{ lg("played_tips") }}
        </div>
        <div v-if="showPlayedType === 'outTime'">
          <p>{{ lg("out_play_time_p1") }}</p>
          <p>{{ lg("out_play_time_p2") }}</p>
        </div>
        <div class="god-information-btn" @click="goBack">{{ lg("ok") }}</div>
      </div>
    </a-modal>

    <audio id="apolloCN" src="/static/sound/Apollo_CN00.mp3" />
    <audio id="apolloEN" src="/static/sound/Apollo_EN00.mp3" />

    <audio id="aphroditeCN" src="/static/sound/Aphrodite_CN00.mp3" />
    <audio id="aphroditeEN" src="/static/sound/Aphrodite_EN00.mp3" />

    <audio id="aresCN" src="/static/sound/ARES_CN00.mp3" />
    <audio id="aresEN" src="/static/sound/ARES_EN00.mp3" />

    <audio id="athenaCN" src="/static/sound/Athena_CN00.mp3" />
    <audio id="athenaEN" src="/static/sound/Athena_EN00.mp3" />

    <audio id="erisCN" src="/static/sound/Eris_CN00.mp3" />
    <audio id="erisEN" src="/static/sound/Eris_EN00.mp3" />

    <audio id="heraCN" src="/static/sound/Hera_CN00.mp3" />
    <audio id="heraEN" src="/static/sound/Hera_EN00.mp3" />

    <audio id="hermesCN" src="/static/sound/Hermes_CN00.mp3" />
    <audio id="hermesEN" src="/static/sound/Hermes_EN00.mp3" />

    <audio id="thetisCN" src="/static/sound/Thetis_CN00.mp3" />
    <audio id="thetisEN" src="/static/sound/Thetis_EN00.mp3" />

    <audio id="zeusCN" src="/static/sound/Zeus_CN00.mp3" />
    <audio id="zeusEN" src="/static/sound/Zeus_EN00.mp3" />

    <audio id="coinSound" src="/static/sound/rotation-sound.mp3" />

    <div class="footer">
      Copyright © 2021. Ares Protocol All rights reserved.
    </div>
  </div>
</template>

<script>
import card from "./card";
import { gods } from "@/utils/contant";
import { appStore as AppStore } from "@/store";
import { playGameMessage } from "@/utils/sign_message";
import { methodType, request } from "@/utils/request";
import apis from "@/utils/apis";

export default {
  name: "BoxGames",
  components: {
    card,
  },
  data() {
    return {
      gods,
      gameGods: [],
      godInfoRotate: false,
      gamesStatus: "",
      showCoinSvg: false,
      selectGodIndex: 0,
      isSelectGod: false,
      godsIndex: 0,
      bonus: 0,
      timerMarquee: null,
      broadcasts: [],
      cards_bonus: [],
      broadcastInterval: null,
      broadcastShow: true,
      showBroadcastsIndex: 0,
      address: "",
      isPlay: false,
      showPlayed: false,
      showPlayedType: "played", // "outTime"
    };
  },
  setup() {
    const appStore = AppStore();
    return {
      appStore,
    };
  },
  created() {
    // this.gamePlay();
    // this.getGameInfo(2022020811);
    this.getBroadcast();
    if (!this.appStore.accessToken) {
      window.location.href = "/";
    }
  },
  mounted() {
    this.gameGods = JSON.parse(JSON.stringify(this.gods));
    this.shuffle(this.gameGods);
    this.getDefaultAddress();

    this.broadcastInterval = setInterval(() => {
      this.broadcastShow = !this.broadcastShow;
      if (this.broadcasts.length > 0 && this.broadcastShow) {
        this.showBroadcastsIndex + 1 >= this.broadcasts.length
          ? (this.showBroadcastsIndex = 0)
          : this.showBroadcastsIndex++;
      }
    }, 1000 * 3);
  },
  unmounted() {
    if (this.broadcastInterval) {
      clearInterval(this.broadcastInterval);
    }
  },
  methods: {
    async getDefaultAddress() {
      let v = this;
      const local_address = await v.action.getAddress();
      this.address = local_address;
    },
    goBack() {
      this.playBtnSound();
      this.$router.push("/win");
    },
    playBtnSound() {
      let sound = document.querySelector("#mouseSound");
      sound.play();
    },
    showGodWin() {
      this.playBtnSound();
      this.gamesStatus = "godWin";
      const selectGod = this.godsIndex;
      const winBonus = this.bonus;
      let index = 0;
      let count = 0;
      this.rang = setInterval(() => {
        index += 1;
        count += 1;
        this.godsIndex = index % 9;
        this.bonus = this.cards_bonus[this.godsIndex];

        if (count > 1 && !this.showCoinSvg) {
          this.showCoinAni();
        }
        if (count >= 53) {
          this.godsIndex = selectGod;
          this.bonus = winBonus;
          this.showCoinSvg = false;
          clearInterval(this.rang);
        }
      }, 100);
    },
    showCoinAni() {
      this.showCoinSvg = true;
      let sound = document.querySelector("#coinSound");
      sound.play();

      // setTimeout(() => {
      //   this.showCoinSvg = false;
      // }, 1000 * 7);
    },
    async gamePlay(item, index) {
      if (this.godInfoRotate) {
        return;
      }
      const cardsIndex = [];
      this.gameGods.forEach((item) => {
        cardsIndex.push(item.index + 1);
      });
      this.selectGodIndex = index;
      this.godsIndex = item.index;
      this.setSelectGod = true;
      const timestamp = parseInt(new Date().getTime() / 1000);
      let v = this;
      const address = v.myWeb3.utils.toChecksumAddress(this.address);
      request(apis.nonce, methodType.GET, { address: address }).then(
        (nonceRes) => {
          let cards = "[";
          cardsIndex.forEach((item) => {
            cards += item + " ";
          });
          cards = cards.trim() + "]";
          const PlayGameSignMsg = playGameMessage(
            address,
            nonceRes.data,
            timestamp,
            cards,
            this.selectGodIndex
          );
          v.myWeb3.eth.personal
            .sign(PlayGameSignMsg, address, "")
            .then((sign) => {
              const signBytes = v.myWeb3.utils.hexToBytes(sign);
              signBytes[64] -= 27;
              sign = v.myWeb3.utils.bytesToHex(signBytes);
              const param = {
                address: address,
                nonce: nonceRes.data,
                signed_msg: sign,
                cards: cardsIndex,
                chosen: this.selectGodIndex,
                timestamp: timestamp.toString(),
              };
              request(apis.playGame, methodType.POST, param).then((result) => {
                if (result.code === 0) {
                  this.getGameInfo(result.data.session).then((gameInfo) => {
                    this.cards_bonus = gameInfo.data.cards_bonus;
                    this.bonus = gameInfo.data.bonus;
                    this.gamesStatus = "godInfo";
                  });
                } else if (result.code === -1000) {
                  this.showPlayed = true;
                  if (result.message === "out of game time") {
                    this.showPlayedType = "outTime";
                  } else {
                    this.showPlayedType = "played";
                  }
                }
              });
            });
        }
      );
    },
    getGameInfo(session) {
      return request(apis.game + session, methodType.GET).then((result) => {
        if (result.code === 0) {
          return result;
        }
      });
    },
    turnCard() {
      this.playBtnSound();
      this.gamesStatus = "";
      this.showCoinSvg = false;
      setTimeout(() => {
        this.godInfoRotate = !this.godInfoRotate;
      }, 100);
    },
    getBroadcast() {
      request(apis.broadcasts, methodType.GET).then((result) => {
        this.broadcasts = result.data.items;
      });
    },
    runMarquee() {
      this.stopMarquee();
      this.timerMarquee = requestAnimationFrame(this.landscapeMarquee);
    },
    stopMarquee() {
      this.timerMarquee && cancelAnimationFrame(this.timerMarquee);
    },
    //横向滚动
    landscapeMarquee() {
      this.$refs.gameMarqueeItem.clientWidth +
        this.$refs.gameMarqueeWrapper.scrollLeft >=
      this.$refs.gameMarqueeItem.scrollWidth
        ? (this.$refs.gameMarqueeWrapper.scrollLeft = 0)
        : this.$refs.gameMarqueeWrapper.scrollLeft++;
      this.timerMarquee = requestAnimationFrame(this.landscapeMarquee);
    },
    shuffle(arr) {
      for (let i = 1; i < arr.length; i++) {
        const random = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[random]] = [arr[random], arr[i]];
      }
    },
    playSound(name) {
      let language = window.lang;
      if (this.isPlay || this.godInfoRotate) {
        return;
      }
      let sound = document.querySelector("#" + name + language.toUpperCase());
      sound.play();
      this.isPlay = true;
    },
    stopSound(name) {
      let language = window.lang;
      let sound = document.querySelector("#" + name + language.toUpperCase());
      sound.pause();
      sound.currentTime = 0;
      this.isPlay = false;
    },
  },
};
</script>

<style scoped lang="scss">
.games-wrapper {
  width: 100%;
  min-height: 100vh;
  color: #fff;
  position: relative;
  //padding-bottom: 460px;
  background: #11164e url("../../assets/images/bg.jpg") no-repeat;
  background-size: cover;
}

.games-content {
  position: relative;
  display: flex;
  justify-content: center;
  padding: 0 50px;
}

.header {
}

.gods-content {
  //margin-left: 100px;
}

.games-logo {
  cursor: pointer;
  position: absolute;
  left: 50px;
  top: -4px;
  width: 200px;
  height: 200px;
  img {
    width: 220px;
    margin-top: 52px;
  }
}

.gods {
  width: 638px;
  background: #0a133f;
  opacity: 1;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  column-gap: 20px;
  row-gap: 20px;
  border: 4px solid #1de4ae;
  cursor: url("../../../public/static/img/staff.ico"), default;
  @for $i from 0 through 9 {
    div:nth-child(#{$i}) .godInfoBack {
      transition-delay: $i * 0.7s;
    }

    div:nth-child(#{$i}) .godInfo {
      transition-delay: $i * 0.735s;
    }
  }
}

.win-now {
  height: 153px;
  width: 655px;
  font-size: 30px;
  font-weight: bold;
  display: flex;
  align-items: center;
  margin: 0 auto;
  column-gap: 15px;
  div:first-child {
    padding-left: 10px;
    width: 40%;
  }
}

.hide-back {
  width: 200px;
  text-align: center;
  .win-title {
    width: 200px !important;
  }
}

.m-win-title {
  text-align: center;
  margin-top: -50px;
  display: none;
}

.back-btn {
  width: 65px !important;
  height: 51px;
  line-height: 51px;
  border: 2px solid #1de4ae;
  box-shadow: 1px 5px 0 #000b53;
  border-radius: 8px;
  text-align: center;
  font-size: 26px;
  cursor: pointer;
  padding-left: inherit;
  .fa-long-arrow-left:before {
    color: #1de4ae;
  }
}

.broadcast {
  width: 360px;
  height: 50px;
  text-align: center;
  font-size: 18px;
  background: #242d4d;
  border: 2px solid #1de4ae;
  border-radius: 40px;
  position: absolute;
  display: flex;
  align-items: center;
  right: 30px;
  top: -111px;
}

.broadcastImg {
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: #242d4d;
  border: 2px solid #1de4ae;
  border-radius: 50%;
  margin-left: -20px;
  img {
    width: 33px;
    height: 35px;
  }
}

.winnerTipsItem {
  height: 83px;
  line-height: 83px;
  font-size: 25px;
  color: #fff;
  margin-top: 5px;
  overflow: hidden;
}

.godInfo {
  width: 183px;
  height: 180px;
  //border: 4px solid #FFFFFF;
  opacity: 1;
  border-radius: 20px;
  color: #0a133f;
}

.god-info-ani {
  width: 207px;
  height: 207px;
  border: 4px solid #ffffff;
  opacity: 1;
  border-radius: 20px;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform-style: preserve-3d;
  background: #fff;
  color: #0a133f;
}

.godName {
  position: absolute;
  width: 100%;
  bottom: 0;
  left: 10px;
  z-index: 100;
  color: #fff;
  font-weight: bold;
  font-size: 24px;
}

.godDesc {
  position: absolute;
  width: 100%;
  text-align: center;
  bottom: 10px;
  z-index: 100;
  font-weight: bold;
  font-size: 18px;
}

.godImgContainer {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  z-index: 2;
}

.godInfoItem {
  width: 207px;
  height: 207px;
  border-radius: 20px;
  overflow: hidden;
}

//.god-info-items {
//  width: 183px;
//  height: 180px;
//  border-radius: 20px;
//  perspective: 500px;
//  position: relative;
//  overflow: hidden;
//}

.god-info-items {
  width: 183px;
  height: 180px;
  border-radius: 10px;
}
.god-info-items-rotate {
  perspective: 500px;
  position: relative;
  overflow: hidden;
}

.god-info-rotate-back {
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  opacity: 0;
}

.god-info-rotate-front {
  transform: rotateY(0deg);
  -webkit-transform: rotateY(0deg);
}

.godInfoBack {
  top: 0;
  left: 0;
  position: absolute;
  transition: all 1s;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: #1de4ae;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
  overflow: hidden;
}

.god-info-back-content {
  background: url("../../../public/static/img/god_bcg.png");
  background-size: 100%;
  width: 80%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer {
  background: #0e174f;
  text-align: center;
  font-family: Poppins, serif;
  font-size: 13px;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.god-Information-title {
  padding: 0 20px;
  text-align: right;
}

.godInformation {
  width: 800px;
  border-radius: 20px;
  padding: 20px 30px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  background: #242d4d;
  border: 4px solid #1de4ae;
  text-align: left;
}

.godInformation span {
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  top: 0;
  left: 0;
  box-sizing: border-box;
}

.godInformation span:nth-child(1) {
  transform: rotate(0deg);
}

.godInformation span:nth-child(2) {
  transform: rotate(90deg);
  height: 796px;
}

.godInformation span:nth-child(3) {
  transform: rotate(180deg);
}

.godInformation span:nth-child(4) {
  transform: rotate(270deg);
  height: 796px;
}

.godInformation span:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 2px;
  background: #2e85f8;
  animation: animate 4s linear infinite;
}

.godInfoBack span {
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  top: 0;
  left: 0;
  box-sizing: border-box;
}

.godInfoBack span:nth-child(1) {
  transform: rotate(0deg);
}

.godInfoBack span:nth-child(2) {
  transform: rotate(90deg);
}

.godInfoBack span:nth-child(3) {
  transform: rotate(180deg);
}

.godInfoBack span:nth-child(4) {
  transform: rotate(270deg);
}

.godInfoBack span:before {
  content: "";
  position: absolute;
  width: 100%;
  height: 4px;
  background: #4097fd;
  animation: animate 4s linear infinite;
}

.god-Information-content {
  display: flex;
  align-items: center;
  column-gap: 20px;
}

.god-Information-content-avatar {
  border: 4px solid #1de4ae;
  border-radius: 20px;
}

.god-information-name {
  font-size: 40px;
}

.god-information-desc {
  width: 282px;
  height: 40px;
  line-height: 40px;
  font-size: 30px;
  padding-left: 5px;
  margin-top: 15px;
  background: linear-gradient(84deg, #1de4ae 0%, rgba(0, 37, 172, 0) 100%);
}

.god-information-btn {
  width: 144px;
  height: 53px;
  line-height: 53px;
  font-size: 25px;
  text-align: center;
  background: #1de4ae;
  box-shadow: 1px 5px 0px #004867;
  border-radius: 15px;
  margin: 0 auto;
  margin-top: 50px;
  position: relative;
  z-index: 100;
  cursor: url("../../../public/static/img/staff48.ico"), default;
}

.god-information-slogan {
  margin-top: 20px;
  font-size: 14px;
  line-height: 18px;
  font-weight: 300;
  font-family: Poppins, system-ui;
}

.godWinCard {
  width: 486px;
  color: #fff;
  border-radius: 20px;
  margin: 0 auto;
  text-align: center;
  padding: 30px;
  animation: godWinCardAni 6s;
  background: #242d4d;
  border: 4px solid #1de4ae;
}

@keyframes godWinCardAni {
  100% {
    transform: rotateY(2520deg);
    transition-timing-function: ease-out;
  }
}

.god-win-card-title {
  font-size: 40px;
  font-weight: bold;
}

.god-win-card-avatar {
  margin: 0 auto;
  margin-top: 20px;
}

.god-win-card-avatar img {
  width: 140px;
  border-radius: 50%;
  border: 8px solid #30407b;
}

.god-win-card-desc {
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
}

.god-win-card-ares {
  width: 274px;
  height: 55px;
  line-height: 55px;
  text-align: center;
  background: #284265;
  border-radius: 31px;
  font-size: 31px;
  margin: 0 auto;
  margin-top: 20px;
}

.god-win-card-btn {
  width: 144px;
  height: 53px;
  line-height: 53px;
  background: #1de4ae;
  box-shadow: 1px 5px 0px #004867;
  border-radius: 15px;
  margin: 0 auto;
  margin-top: 20px;
  font-size: 25px;
  cursor: pointer;
  position: relative;
  z-index: 200;
  cursor: url("../../../public/static/img/staff48.ico"), default;
}

@keyframes animate {
  0% {
    transform: scaleX(0);
    transform-origin: left;
  }
  50% {
    transform: scaleX(1);
    transform-origin: left;
  }
  50.1% {
    transform: scaleX(1);
    transform-origin: right;
  }

  100% {
    transform: scaleX(0);
    transform-origin: right;
  }
}

.marqueeBox {
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: white;
  font-size: 14px;
  letter-spacing: 0;
}

.marqueeWrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.marqueeItem {
  .marqueeText {
    text-align: left;
    padding: 0 10px;
    white-space: normal;
    display: inline-block;
    font-size: 16px;
  }
}

.playedWrapper {
  font-family: "Moriis roman", serif;
  text-align: center;
  font-size: 25px;
  color: #fff;
}

@media screen and (max-width: 1250px) {
  .gods {
    //transform: scale(0.9);
  }

  .broadcast {
    display: none;
  }
}

@media screen and (max-width: 750px) {
  .broadcast {
    display: flex;
    margin: 0 auto;
    right: 20px;
    width: 83%;
    height: 45px;
    top: 20px;
    align-items: center;
    .marqueeText {
      overflow: hidden;
      height: 45px;
      line-height: 46px;
      font-size: 12px;
    }
  }

  .marqueeBox {
    height: 45px;
    line-height: 45px;
  }

  .games-wrapper {
    padding-bottom: 100px;
    background-size: 100% 50%;
  }

  .win-now {
    width: 234px;
    height: 200px;
    margin-left: 36px;
    padding-top: 130px;
    font-size: 20px;
  }

  .m-win-title {
    display: block;
  }

  .win-title {
    display: none;
  }

  .hide-back {
    margin-left: 0;
    width: 376px;
  }

  .back-btn {
    position: absolute;
    left: 20px;
    height: 40px;
    top: 40px;
    line-height: 40px;
    font-size: 22px;
    padding-left: 0 !important;
    width: 50px !important;
  }

  .games-logo {
    left: calc(50% - 95px);
    top: 0;
    img {
      width: 180px;
    }
  }

  .gods {
    margin-top: 88px;
    //transform: scale(0.6);
    width: 380px;
    column-gap: 11px;
    row-gap: 12px;
    padding: 20px 10px;
  }

  .god-info-items,
  .godInfo {
    width: 110px;
    height: 108px;
  }

  .games-content {
    padding: 10px 20px;
  }

  .godInformation {
    width: 320px;
    padding: 25px 27px;
    margin-top: 90px;
  }

  .godInformation span:nth-child(1) {
    transform: rotate(0deg);
    width: 290px;
    left: 10px;
  }

  .godInformation span:nth-child(3) {
    width: 290px;
    left: 10px;
  }

  .godInfoBack {
    width: 110px;
    height: 108px;
  }

  .god-Information-content-avatar {
    border-radius: 13px;
    img {
      width: 100px;
    }
  }

  .god-Information-title {
    height: 18px;
    line-height: 18px;
    font-size: 12px;
    position: absolute;
    right: 15px;
    padding: 0;
    border-bottom-left-radius: 20px;
    border-top-left-radius: 20px;
    background: linear-gradient(84deg, #1de4ae 0%, rgba(0, 37, 172, 0) 100%);
    img {
      width: 18px;
    }
  }

  .god-Information-content {
    align-items: flex-start;
  }

  .god-information-name {
    margin-top: 23px;
    font-size: 16px;
  }

  .god-information-desc {
    font-size: 11px;
    width: 100px;
  }

  .god-information-slogan {
    padding: 0 20px;
    position: absolute;
    top: 160px;
    font-size: 14px;
    right: 0;
    left: 0;
  }

  .god-information-btn {
    margin-top: 196px;
    height: 31px;
    line-height: 34px;
    width: 81px;
    font-size: 14px;
    border-radius: 8px;
  }

  .godWinCard {
    width: 334px;
    margin-top: 88px;
  }

  .god-win-card-title {
    font-size: 20px;
  }

  .god-win-card-avatar {
    width: 106px;
    height: 106px;
    img {
      width: 84px;
    }
  }

  .god-win-card-desc {
    font-size: 16px;
  }

  .god-win-card-ares {
    height: 39px;
    width: 162px;
    line-height: 39px;
    font-size: 22px;
    img {
      width: 30px;
      margin-top: -14px;
    }
  }

  .god-win-card-btn {
    width: 81px;
    height: 30px;
    line-height: 34px;
    font-size: 14px;
    border-radius: 8px;
  }

  .godInfoBack span:before {
    height: 2px;
  }
}

.showCoinSvg {
  display: block;
}

.hideCoinSvg {
  display: none;
}
</style>
