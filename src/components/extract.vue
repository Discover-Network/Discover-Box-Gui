<template>
  <div>
    <a-modal
      title=""
      :visible="extractShow"
      :footer="null"
      :closable="false"
      v-if="extractShow"
      :width="750"
    >
      <div class="extract-wrapper">
        <div class="extract-title">
          {{ lg("extract") }}
        </div>
        <div class="extract-account">
          <div class="extract-Input-title">{{ lg("my_rewards_account") }}</div>
          <a-input v-model="extractAddress"></a-input>
        </div>
        <div>
          <div class="extract-Input-title">
            {{ lg("amount_of_withdrawn_rewards") }}
          </div>
          <div class="extract-amount">
            <a-input type="number" v-model="extractNum"></a-input>
            <div
              class="extract-max-btn"
              @click="setExtractMax"
              v-on:click="mouseClick"
            >
              {{ lg("max") }}
            </div>
          </div>
        </div>
        <div class="extract-footer">
          <div
            class="extract-max-btn extract-footer-btn"
            @click="widthDraw"
            v-on:click="mouseClick"
          >
            {{ lg("confirm") }}
          </div>
          <div
            class="extract-max-btn extract-footer-btn"
            @click="extractCancel"
            v-on:click="mouseClick"
          >
            {{ lg("cancel") }}
          </div>
        </div>
      </div>
    </a-modal>

    <div class="share-wrapper" ref="shareWrapper">
      <a-modal
        title=""
        :get-container="() => $refs.shareWrapper"
        :visible="shareCardShow"
        :footer="null"
        :closable="false"
        :maskClosable="true"
        :width="750"
        @cancel="shareCardCancel"
        v-if="shareCardShow"
      >
        <div class="share-card">
          <div
            class="share-card-cancel"
            @click="shareCardCancel"
            v-on:click="mouseClick"
          >
            <i class="fa fa-times" aria-hidden="true"></i>
          </div>
          <div>
            <div class="share-card-title">{{ lg("congratulations") }}</div>
            <div>{{ lg("you_have_earned") }}</div>
          </div>
          <div>
            <div class="ares-num">
              <img src="@/assets/image/bag.png" alt="" width="50" />
              {{ extractNum }} DISC
            </div>
          </div>
          <div class="share-card-tips">{{ lg("you_have_earned_tips") }}</div>
          <div class="share-button">
            <div class="share-card-btn" @click="shareTwitter">
              <TwitterOutlined
                type="twitter"
                style="color: #242d4d; font-size: 20px"
              />
              Twitter
            </div>
          </div>

          <div class="submit-wrapper">
            <div class="link-wrapper">
              <div>Link</div>
              <a-input placeholder="Your link here" v-model="shareLink" />
            </div>
            <div class="submit-btn" @click="submitLink">Submit</div>
          </div>

          <div class="submit-tip">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
            Please confirm whether your sharing link is submitted before
            clicking ok. If you don't submit it, it will be regarded as giving
            up sharing!
          </div>

          <div class="share-btn" @click="confirmShare" v-on:click="mouseClick">
            {{ lg("ok") }}
            <div class="share-tips">
              <span class="arrow"></span>
              <span>{{ lg("withdrawal_to_the_account") }}</span>
            </div>
          </div>
        </div>
      </a-modal>
    </div>

    <a-modal
      title=""
      :visible="rewardsLess"
      :footer="null"
      :closable="false"
      v-if="rewardsLess"
      :width="750"
      :centered="true"
    >
      <div class="rewards-Less-wrapper">
        <div class="rewards-less-content">
          {{ lg("extract_less_tip") }} {{ configStore.minWithdraw }} ARES.
        </div>
        <div
          class="lessBtn"
          @click="rewardsLess = false"
          v-on:click="mouseClick"
        >
          {{ lg("ok") }}
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { MediaChannel, ShareType } from "@/utils/contant";
import { appConfigStore } from "@/store/config";
import { withdrawMessage } from "@/utils/sign_message";
export default {
  name: "BoxExtract",
  props: {
    extractShow: {
      type: Boolean,
    },
    maxGameBalance: {
      type: Number,
    },
    totalWinAres: {
      type: Number,
    },
    nickName: {
      type: String,
    },
  },
  setup() {
    const configStore = appConfigStore();
    return {
      configStore,
    };
  },
  data() {
    return {
      shareCardShow: false,
      extractNum: 0,
      rewardsLess: false,
      shareLink: "",
      extractAddress: "",
      gameBalance: this.maxGameBalance,
    };
  },
  mounted() {
    this.getDefaultAddress();
  },
  methods: {
    mouseClick() {
      let sound = document.querySelector("#mouseSound");
      sound.play();
    },
    async getDefaultAddress() {
      let v = this;
      const local_address = await v.action.getAddress();
      this.extractAddress = local_address;
    },
    setExtractMax() {
      this.extractNum = this.maxGameBalance;
    },
    widthDraw() {
      if (this.extractNum < this.minWithdraw) {
        this.rewardsLess = !this.rewardsLess;
        return;
      }
      const timestamp = parseInt(new Date().getTime() / 1000);
      let v = this;
      v.action.getAddress().then((address) => {
        if (this.extractAddress !== address) {
          address = this.extractAddress;
        }
        address = v.myWeb3.utils.toChecksumAddress(address);
        fetch(`/api/v1/nonce?address=${address}`, {
          method: "GET",
          mode: "cors",
        }).then(async (res) => {
          const nonceRes = await res.json();
          const WithdrawBonusApplySignMsg = withdrawMessage(
            address,
            nonceRes.data,
            timestamp,
            this.extractNum
          );
          v.myWeb3.eth.personal
            .sign(WithdrawBonusApplySignMsg, address, "")
            .then((sign) => {
              const signBytes = v.myWeb3.utils.hexToBytes(sign);
              signBytes[64] -= 27;
              sign = v.myWeb3.utils.bytesToHex(signBytes);
              const param = {
                address: address,
                bonus: parseInt(this.extractNum),
                nonce: nonceRes.data,
                signed_msg: sign,
                timestamp: timestamp.toString(),
              };
              fetch("/api/v1/bonus/withdraw/apply", {
                method: "POST",
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(param),
              }).then(async (res) => {
                if (res.ok) {
                  // const result = await res.json();
                  this.shareCardShow = !this.shareCardShow;
                  this.$emit("update:extractShow", false);
                  this.$emit("freshBonus");
                } else {
                  return Promise.reject("extract error", res);
                }
              });
            });
        });
      });
    },
    extractCancel() {
      this.$emit("update:extractShow", false);
    },
    shareTwitter() {
      let nickname = this.nickName;
      if (nickname.length > 15) {
        nickname = this.hideMiddle(nickname, 5, 5);
      }
      const twUrl = "https://www.youtube.com/watch?v=TV6-AKEwyfU"; //要分享的链接
      const twTitle = `I’m ${nickname},I have earned ${this.totalWinAres} ARES in The Trojan Box. If you are my friends, we can play The Trojan Box together!`;
      window.open(
        `https://twitter.com/intent/tweet?text=${twTitle}&url=${twUrl}`,
        "_blank"
      );
    },
    shareCardCancel() {
      this.shareCardShow = !this.shareCardShow;
    },
    confirmShare() {
      this.shareCardShow = false;
    },
    submitLink() {
      const token = this.$store.state.trojanBox.token;

      const data = {
        link: this.shareLink,
        channel: MediaChannel.Twitter,
        share_type: ShareType.Withdrawn,
      };
      fetch("/api/v1/share", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      }).then(async (res) => {
        const result = await res.json();
        if (res.ok) {
          this.shareLink = "";
          this.shareCardShow = !this.shareCardShow;
        } else {
          console.log(result.message);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.extract-wrapper {
  color: #fff;
  font-family: "LTWave", serif;
  border-radius: 33px;
}

.extract-title {
  font-size: 40px;
  text-align: center;
}

.extract-amount {
  display: flex;
}

.extract-account {
  margin-bottom: 20px;
}

.extract-account .ant-input {
  height: 54px;
  border-radius: 15px;
  border: 2px solid #1de4ae;
  margin-top: 10px;
  color: #242d4d;
  font-size: 20px;
}

.extract-amount .ant-input {
  width: 80%;
  height: 53px;
  border: 2px solid #1de4ae;
  border-radius: 15px;
  color: #242d4d;
  font-size: 20px;
}

.extract-max-btn {
  width: 114px;
  height: 47px;
  line-height: 47px;
  background: #1de4ae;
  box-shadow: 1px 5px 0 #004867;
  border-radius: 15px;
  text-align: center;
  margin-left: 10px;
  font-size: 20px;
  font-weight: 400;
  color: #242d4d;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.extract-max-btn:before {
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

.extract-max-btn:hover {
  color: #fff;
}

.extract-max-btn:hover:before {
  transform: skewX(-45deg) translateX(18.5em);
  transition: all 0.5s ease-in-out;
}

.extract-input-title {
  margin-top: 20px;
  font-size: 20px;
}

.extract-footer {
  display: flex;
  margin-top: 20px;
  justify-content: space-around;
}

.extract-footer-btn {
  width: 200px;
}

.share-wrapper {
  /deep/ .ant-modal-mask {
    background-color: #242d4d;
    opacity: 0.85;
  }

  /deep/ .ant-modal-content {
    padding: inherit;
  }
}

.share-card {
  border-radius: 33px;
  text-align: center;
  color: #fff;
  position: relative;
}

.share-card-cancel {
  position: absolute;
  right: 0;
  font-size: 18px;
  cursor: pointer;
}

.share-card-title {
  font-size: 30px;
  font-weight: 400;
  text-align: center;
}

.ares-num {
  width: 303px;
  height: 62px;
  line-height: 62px;
  background: #284265;
  border-radius: 31px;
  font-weight: bold;
  font-size: 30px;
  text-align: center;
  margin: 0 auto;
  margin-top: 20px;
}

.share-card-tips {
  padding: 10px 0;
  font-family: Poppins;
  font-size: 14px;
}

.share-button {
  display: flex;
  justify-content: space-around;
}

.share-card-btn {
  width: 168px;
  height: 49px;
  line-height: 49px;
  background: #1de4ae;
  border-radius: 31px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  cursor: pointer;
  color: #242d4d;
}

.share-btn {
  width: 144px;
  height: 53px;
  line-height: 53px;
  font-size: 25px;
  text-align: center;
  background: #1de4ae;
  box-shadow: 1px 5px 0 #004867;
  border-radius: 15px;
  margin: 0 auto;
  margin-top: 20px;
  cursor: pointer;
  position: relative;
  &:hover .share-tips {
    display: block;
  }
}

.link-wrapper {
  text-align: left;
  width: 70%;
  .ant-input {
    border: 2px solid #1de4ae;
    background: #fff;
    color: #242d4d;
    height: 48px;
    line-height: 48px;
    font-size: 18px;
  }
}

.submit-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
}

.submit-btn {
  width: 110px;
  height: 45px;
  line-height: 45px;
  background: #1de4ae;
  box-shadow: 1px 5px 0 #004867;
  border-radius: 15px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
  margin-top: 18px;
}

.submit-tip {
  font-size: 14px;
  font-family: Poppins, serif;
  font-weight: 300;
  line-height: 18px;
  color: #fff;
  text-align: left;
  margin-top: 5px;
  padding: 0 60px;
}

.share-tips {
  display: none;
  position: absolute;
  bottom: -77px;
  width: 600px;
  right: -250px;
  color: #fff;
  font-family: Poppins, serif;
  font-size: 16px;
  background: #242d4d;
  border: 2px solid #1de4ae;
  border-radius: 15px;
}

.arrow {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 15px;
  border-color: transparent transparent #1de4ae transparent;
  position: absolute;
  left: 44%;
  top: -30px;
}

.rewards-Less-wrapper {
  text-align: center;
  font-size: 22px;
  color: #fff;
}

.lessBtn {
  width: 100px;
  margin: 10px auto;
  height: 47px;
  line-height: 47px;
  color: #242d4d;
  background: #1de4ae;
  box-shadow: 1px 5px 0px #004867;
  border-radius: 15px;
  text-align: center;
  font-size: 25px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.lessBtn:before {
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

.lessBtn:hover {
  color: #fff;
}

.lessBtn:hover:before {
  transform: skewX(-45deg) translateX(13.5em);
  transition: all 0.5s ease-in-out;
}
</style>
