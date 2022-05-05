<template>
  <div class="wrapper">
    <div class="title">白名单管理</div>

    <div class="nav">
      <router-link to="/admin/dashboard">
        <a-button>Dashboard</a-button>
      </router-link>
    </div>

    <div style="padding: 10px 0; margin-top: 20px; text-align: left">
      <a-button type="primary" @click="addressModal = !addressModal"
        >添加</a-button
      >
    </div>
    <div class="tableContainer">
      <a-table
        bordered
        :data-source="whiteList"
        :columns="columns"
        :pagination="pagination"
      />
    </div>

    <a-modal
      title=""
      :visible="addressModal"
      :footer="null"
      :closable="true"
      @cancel="cancelModal"
      v-if="addressModal"
      width="800"
      :centered="true"
      :maskClosable="true"
      :destroyOnClose="true"
    >
      <div class="modalWrapper">
        <div class="modalTitle">添加白名单</div>
        <a-input @change="handleInput" />
        <a-button size="large" @click="saveWhiteListAddress">添加</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "AdminWhitelist",
  beforeRouteEnter(to, from, next) {
    const token = sessionStorage.getItem("box_admin_token");
    if ("TrojanAdmin" === atob(token)) {
      next();
    } else {
      next((vm) => {
        vm.$router.push("/admin");
      });
    }
  },
  data() {
    return {
      whiteList: [],
      columns: [
        {
          title: "地址",
          dataIndex: "address",
        },
      ],
      pagination: {
        pageSize: 20,
        showSizeChanger: false,
        total: 0,
        onChange: (pageIndex) => {
          this.getWhiteList(pageIndex - 1);
        },
      },
      addressModal: false,
      inputAddress: "",
    };
  },
  created() {},
  mounted() {
    // this.getWhiteList();
  },
  methods: {
    getWhiteList(pageIndex = 0) {
      const token = this.$store.state.trojanBox.token;
      fetch(`/api/v1/whitelist/?page=${pageIndex}&size=20`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then(async (res) => {
        const result = await res.json();
        this.pagination.total = result.data.totalNum;

        const list = [];
        result.data.items.forEach((item) => {
          list.push({ address: item });
        });
        this.whiteList = list;
      });
    },
    saveWhiteListAddress() {
      const token = this.$store.state.trojanBox.token;
      const data = {
        addresses: [this.inputAddress],
      };
      fetch("/api/v1/whitelist", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      }).then(async (res) => {
        const result = await res.json();
        console.log("result", result);
        if (res.ok) {
          this.inputAddress = "";
          this.addressModal = !this.addressModal;
        }
      });
    },
    cancelModal() {
      this.addressModal = !this.addressModal;
    },
    handleInput(e) {
      this.inputAddress = e.target.value;
    },
  },
};
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  min-height: 100vh;
  padding: 30px 50px;
  color: #fff;
  background: url("../../assets/images/bg.jpg") no-repeat;
  background-size: cover;
}

.title {
  text-align: center;
  font-size: 28px;
  padding-bottom: 20px;
}

.tableContainer {
  background: #fff;
  /*margin-top: 20px;*/
}

.modalWrapper {
  width: 380px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  .ant-input {
    height: 40px;
    line-height: 40px;
    margin-top: 20px;
  }
  button {
    width: 80px;
    margin: 0 auto;
    margin-top: 10px;
  }
}

.modalTitle {
  font-size: 26px;
  color: #fff;
}

.nav {
  text-align: left;
}
</style>
