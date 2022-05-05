<template>
  <div class="loginWrapper">
    <div class="loginModal">
      <div class="title">Login Box</div>
      <a-form
        layout="vertical"
        :model="loginForm"
        @submit="handleSubmit"
        class="loginModel"
      >
        <a-form-item>
          <a-input
            v-model:value="loginForm.user"
            placeholder="Username"
            class="input"
          >
            <template #prefix>
              <UserOutlined style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            v-model:value="loginForm.password"
            type="password"
            placeholder="Password"
            class="input"
          >
            <template #prefix>
              <LockFilled style="color: rgba(0, 0, 0, 0.25)" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            class="submitBtn"
            :disabled="loginForm.user === '' || loginForm.password === ''"
          >
            Log in
          </a-button>
        </a-form-item>
        <div style="color: #fff; font-size: 20px" v-if="showTips">
          you are not an administrator
        </div>
      </a-form>
    </div>
  </div>
</template>

<script>
import { appConfigStore } from "@/store/config";
import { appStore as AppStore } from "@/store";

export default {
  name: "box_admin",
  data() {
    return {
      loginForm: {
        user: "",
        password: "",
      },
      showTips: false,
      mangerAddress: [],
      address: "",
    };
  },
  setup() {
    const configStore = appConfigStore();
    const appStore = AppStore();

    return {
      appStore,
      configStore,
    };
  },
  mounted() {
    this.getConfig();
    this.getDefaultAddress();
  },
  methods: {
    getConfig() {
      fetch(`/api/v1/app/config`, {
        method: "GET",
        mode: "cors",
      }).then(async (res) => {
        const result = await res.json();
        this.mangerAddress = result.data.manager_address.map((item) =>
          item.toLowerCase()
        );
      });
    },
    async getDefaultAddress() {
      let v = this;
      let local_address = await v.action.getAddress();
      // local_address = v.myWeb3.utils.toChecksumAddress(local_address);
      this.address = local_address;
    },
    async handleSubmit(e) {
      console.log("handleSubmit");
      e.preventDefault();
      const lowerCaseAddress = this.address.toLowerCase();

      if (this.mangerAddress.indexOf(lowerCaseAddress) === -1) {
        this.showTips = !this.showTips;
        return;
      }

      if (
        this.loginForm.user === "admin" &&
        this.loginForm.password === "TrojanAdmin"
      ) {
        sessionStorage.setItem("box_admin_token", btoa("TrojanAdmin"));
        this.$router.push("/admin/dashboard");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.loginWrapper {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../../assets/images/bg.jpg");
  background-size: cover;
}

.loginModal {
  width: 500px;
  color: #fff;
  text-align: center;
}

.title {
  font-size: 28px;
  padding-bottom: 30px;
}

.loginModel {
  background: #242d4d;
  padding: 50px;
  border-radius: 20px;
}

.submitBtn {
  height: 40px;
  width: 100px;
  border: none;
  color: #fff;
  background: #1de4ae;
  box-shadow: 1px 5px 0 #004867;
}

.submitBtn:hover {
  background: #08e3a8;
}

.input {
  height: 40px;
}
</style>
