<template>
  <router-view></router-view>
  <div class="footer">Copyright © 2021. Ares Protocol All rights reserved.</div>
  <audio id="mouseSound" src="/static/sound/mouse-click.mp3" />
</template>

<script>
import { methodType, request } from "@/utils/request";
import apis from "@/utils/apis";
import { appConfigStore } from "@/store/config.js";
import { appStore } from "@/store";
import { loginMessage } from "@/utils/sign_message";

export default {
  name: "App",
  components: {},
  data() {
    return {};
  },
  created() {
    // init config
    this.getConfig();
    this.scanMetaMaskAccount();
  },
  mounted() {
    this.login();
  },
  methods: {
    getConfig() {
      const configStore = appConfigStore();
      request(apis.config, methodType.GET, {}).then((res) => {
        configStore.$patch((state) => {
          state.minBalance = res.data.game.min_balance;
          state.minWithdraw = res.data.game.min_withdraw;
          state.managerAddress = res.data.manager_address;
          state.whiteList = res.data.white_list;
        });
        console.log("config", configStore);
      });
    },
    async scanMetaMaskAccount() {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      let v = this;
      await v.action.scanMetaMaskAccount();
      v.checkMetamask();
    },
    checkMetamask() {
      const userAgent = window.navigator.userAgent;
      // don't check when in mobile
      if (
        /(iPhone|iPad|iPod|iOS)/i.test(userAgent) ||
        /(Android)/i.test(userAgent)
      ) {
        return;
      }
      if (
        userAgent.toLowerCase().includes("chrome") &&
        !window.ethereum.isMetaMask
      ) {
        this.$confirm({
          title: `Install Metamask`,
          message: `You should install Metamask to continu to use this application.
                        Go to install metamask?`,
          button: {
            no: "No",
            yes: "Yes",
          },
          callback: (confirm) => {
            if (confirm) {
              window.open("https://metamask.io/download.html", "_blank");
            }
          },
        });
      }
    },
    async login() {
      const store = appStore();
      if (store.accessToken) {
        return false;
      }
      const timestamp = parseInt(new Date().getTime() / 1000);
      let v = this;
      v.action.getAddress().then((address) => {
        address = v.myWeb3.utils.toChecksumAddress(address);
        request(apis.nonce, methodType.GET, { address: address }).then(
          (nonceRes) => {
            console.log("login result", nonceRes);
            console.log("login result", timestamp);
            const signMessage = loginMessage(address, nonceRes.data, timestamp);
            v.myWeb3.eth.personal
              .sign(signMessage, address, "")
              .then((sign) => {
                const signBytes = v.myWeb3.utils.hexToBytes(sign);
                signBytes[64] -= 27;
                sign = v.myWeb3.utils.bytesToHex(signBytes);
                const param = {
                  address: address,
                  nonce: nonceRes.data,
                  signed_msg: sign,
                  timestamp: timestamp.toString(),
                };
                request(apis.auth, methodType.POST, param).then((res) => {
                  console.log("login result", res);
                  store.accessToken = res.data;
                });
              });
          }
        );
      });
    },
  },
};
</script>

<style>
@import "./assets/css/normalize.scss";
#app {
  font-family: "Montserrat", "LTWave", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

@font-face {
  font-family: "LTWave";
  src: url("./assets/LTWave-Regular.ttf") format("woff2");
}

.ant-modal-content {
  background: #242d4d;
  border: 4px solid #1de4ae;
  border-radius: 33px;
  padding: 0 10%;
}

.footer {
  background: #242d4d;
  color: #fff;
  text-align: center;
  font-family: Poppins, serif;
  font-size: 13px;
  padding: 10px 0;
  width: 100%;
  margin: 0 auto;
}
</style>
