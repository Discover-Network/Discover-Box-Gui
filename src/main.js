import { createApp } from "vue";
import { createPinia } from "pinia";
import {
  BellFilled,
  CloseOutlined,
  MenuOutlined,
  FileImageOutlined,
  UploadOutlined,
  TwitterOutlined,
  UserOutlined,
  LockFilled,
} from "@ant-design/icons-vue";
import {
  Badge,
  Table,
  Modal,
  Input,
  Upload,
  Spin,
  Form,
  Button,
  Select,
} from "ant-design-vue";
import { ElCarousel, ElCarouselItem } from "element-plus";
import "element-plus/dist/index.css";

import App from "./App.vue";
import router from "@/router";
import web_lang from "./lang/lang.js";
import langMethods from "./lang/index.js";
import action from "@/action";
import Web3 from "web3";

//多语言处理
window.lang = "en";
window.web_lang = web_lang;

(async () => {
  const app = createApp(App);
  //以太坊web3
  if (window.ethereum) {
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (chainId === "0x3") {
      app.config.globalProperties.myWeb3 = await new Web3(window.ethereum);
    }
  }

  app.use(createPinia());
  app.config.globalProperties.lg = langMethods.lg;
  app.config.globalProperties.lgRefer = langMethods.lgRefer;
  app.config.globalProperties.action = action;
  app.component("BellFilled", BellFilled);
  app.component("CloseOutlined", CloseOutlined);
  app.component("MenuOutlined", MenuOutlined);
  app.component("FileImageOutlined", FileImageOutlined);
  app.component("UploadOutlined", UploadOutlined);
  app.component("TwitterOutlined", TwitterOutlined);
  app.component("UserOutlined", UserOutlined);
  app.component("LockFilled", LockFilled);
  app
    .use(Badge)
    .use(Table)
    .use(Modal)
    .use(Input)
    .use(Upload)
    .use(Spin)
    .use(Form)
    .use(Button)
    .use(Select);
  app.use(ElCarousel).use(ElCarouselItem);
  app.use(router);
  app.mount("#app");
})();
