<template>
  <div class="wrapper">
    <div class="title">分享任务系统</div>
    <div class="address">
      {{ hideMiddle(address, 5, 5) }}
    </div>
    <div class="header">
      <div class="headerButton">
        <div
          :class="['btnItem', selectBtnIndex === 0 ? 'selectBtn' : '']"
          @click="changeStatus(0)"
        >
          未完成
        </div>
        <div
          :class="['btnItem', selectBtnIndex === 2 ? 'selectBtn' : '']"
          @click="changeStatus(2)"
        >
          已完成
        </div>
      </div>
    </div>
    <div class="nav">
      <router-link to="/admin/dashboard">
        <a-button>Dashboard</a-button>
      </router-link>
    </div>

    <div class="searchBtn">
      <a-input-search
        placeholder="input search address"
        enter-button="Search"
        size="large"
        @search="onSearch"
      />

      <a-input-search
        placeholder="input search reviewer address"
        enter-button="Search reviewer"
        size="large"
        @search="searchReview"
      />
    </div>

    <div class="tableContainer">
      <a-table
        v-if="selectBtnIndex === 0"
        bordered
        :data-source="dataSource"
        :columns="columns"
      >
        <template #bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a href="javascript:" @click="confirm(text, record)">处理</a>
          </template>

          <template v-if="column.dataIndex === 'link'">
            <span v-if="isNotIpfs(record.link)">{{ text }}</span>
            <img
              v-else
              :src="text"
              alt=""
              height="200"
              @click="showLargeImg(text)"
              style="cursor: pointer"
            />
          </template>

          <template v-if="column.dataIndex === 'share_type'">
            <span v-if="text === 1">提现分享</span>
            <span v-if="text === 2">首页分享</span>
            <span v-if="text === 3">Bug 反馈</span>
          </template>
        </template>
      </a-table>
      <a-table
        v-if="selectBtnIndex === 2"
        bordered
        :data-source="completeData"
        :columns="completeColumns"
        :pagination="completePagination"
        :scroll="{ x: 'max-content' }"
      >
        <template #bodyCell="{ column, text }">
          <template v-if="column.dataIndex === 'share_type'">
            <span v-if="text === 1">提现分享</span>
            <span v-if="text === 2">首页分享</span>
            <span v-if="text === 3">Bug 反馈</span>
          </template>
        </template>
      </a-table>
    </div>

    <div class="handle-modal" ref="handleContainer">
      <a-modal
        title=""
        :visible="handleModal"
        :footer="null"
        :closable="false"
        :get-container="() => $refs.handleContainer"
        @cancel="handleModal = !handleModal"
        v-if="handleModal"
        width="700"
        :centered="true"
        :maskClosable="true"
        :destroyOnClose="true"
      >
        <div class="handleWrapper">
          <div class="reward">
            <span class="handleTitle">奖励</span>
            <a-input v-model="bonus"></a-input>
            <span>ARES</span>
          </div>
          <div>
            <span class="handleTitle">回复</span>
            <a-textarea
              class="select"
              style="width: 340px"
              v-model="reply"
            ></a-textarea>
          </div>
          <div>
            <span class="handleTitle">签名</span>
            <a-input
              class="select"
              :value="address"
              style="width: 340px"
              :disabled="true"
            ></a-input>
          </div>
          <div class="confirm">
            <a-button size="large" @click="submit">确定</a-button>
          </div>
        </div>
      </a-modal>
    </div>

    <div class="image-modal"></div>
    <a-modal
      title=""
      :visible="imageModal"
      :footer="null"
      :closable="true"
      @cancel="cancelImageModal"
      v-if="imageModal"
      width="800"
      :centered="true"
      :maskClosable="true"
      :destroyOnClose="true"
    >
      <div style="width: 800px; text-align: center">
        <img :src="selectImgLink" alt="" width="730" />
      </div>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "shareManager",
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
      selectBtnIndex: 0,
      searchValue: "",
      searchReviewer: "",
      handleModal: false,
      imageModal: false,
      selectImgLink: "",
      auditor: "",
      bonus: 0,
      reply: "",
      selectId: 0,
      address: "",
      dataSource: [],
      columns: [
        {
          title: "昵称",
          dataIndex: "nick_name",
          width: "20%",
        },
        {
          title: "地址",
          dataIndex: "address",
          width: "20%",
        },
        {
          title: "分享连接",
          dataIndex: "link",
          scopedSlots: { customRender: "linkType" },
        },
        {
          title: "描述",
          dataIndex: "content",
        },
        {
          title: "分享类型",
          dataIndex: "share_type",
          scopedSlots: { customRender: "shareType" },
        },
        {
          title: "请求时间",
          dataIndex: "apply_time",
        },
        {
          title: "operation",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      pagination: {
        pageSize: 20,
        showSizeChanger: false,
        total: 0,
        onChange: (pageIndex) => {
          this.getWinHistory(pageIndex - 1);
        },
      },
      completeData: [],
      completeColumns: [
        {
          title: "昵称",
          dataIndex: "nick_name",
          width: "10%",
        },
        {
          title: "地址",
          dataIndex: "address",
          width: "10%",
        },
        {
          title: "分享连接",
          dataIndex: "link",
          width: "10%",
        },
        {
          title: "分享类型",
          dataIndex: "share_type",
          scopedSlots: { customRender: "shareType" },
        },
        {
          title: "奖励",
          dataIndex: "bonus",
        },
        {
          title: "审核人",
          dataIndex: "auditor_address",
        },
        {
          title: "请求时间",
          dataIndex: "apply_time",
        },
      ],
      completePagination: {
        pageSize: 20,
        showSizeChanger: false,
        total: 0,
        onChange: (pageIndex) => {
          this.getWithdrawHistory(pageIndex - 1);
        },
      },
    };
  },
  created() {},
  mounted() {
    this.getShare();
    this.getDefaultAddress();
  },
  methods: {
    async getDefaultAddress() {
      let v = this;
      const local_address = await v.action.getAddress();
      this.address = local_address;
    },
    changeStatus(index) {
      this.selectBtnIndex = index;
      this.getShare();
    },
    hideMiddle(str, frontLen, endLen) {
      let newStr = "";
      for (let i = 0; i < 2; i++) {
        newStr += "*";
      }
      return (
        str.substring(0, frontLen) + newStr + str.substring(str.length - endLen)
      );
    },
    getShare(pageIndex = 0) {
      console.log("getShare");
      fetch(
        `/api/v1/share?address=${this.searchValue}&auditor_address=${this.searchReviewer}&state=${this.selectBtnIndex}&page=${pageIndex}&size=20`,
        {
          method: "GET",
          mode: "cors",
        }
      ).then(async (res) => {
        const result = await res.json();
        result.data.items.map((item) => {
          item.apply_time = new Date(item.apply_time * 1000).toLocaleString();
        });

        if (this.selectBtnIndex === 0) {
          this.pagination.total = result.data.totalNum;
          this.dataSource = result.data.items;
        } else if (this.selectBtnIndex === 2) {
          this.completePagination.total = result.data.totalNum;
          this.completeData = result.data.items;
        }
      });
    },
    onSearch(value) {
      console.log(value);
      this.searchValue = value;
      this.getShare();
    },
    searchReview(value) {
      this.searchReviewer = value;
      this.getShare();
    },
    confirm(text, record) {
      console.log(text, record);
      this.selectId = record.id;
      this.handleModal = !this.handleModal;
    },
    handleSelectChange(value) {
      this.auditor = value;
    },
    submit() {
      const token = this.$store.state.trojanBox.token;
      const data = {
        auditor: this.auditor,
        bonus: parseInt(this.bonus),
        id: this.selectId,
        reply: this.reply,
      };
      fetch("/api/v1/share/process", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      }).then(async (res) => {
        if (res.ok) {
          console.log("res ok");
          const result = await res.json();
          console.log(result);
          const newDataSource = [];
          this.dataSource.map((item) => {
            if (item.id !== this.selectId) {
              newDataSource.push(item);
            }
          });
          this.dataSource = newDataSource;
          this.auditor = "";
          this.bonus = 0;
          this.id = 0;
          this.handleModal = !this.handleModal;
        }
      });
    },
    isNotIpfs(text) {
      return !text.toString().startsWith("https://ipfs.io");
    },
    showLargeImg(link) {
      this.selectImgLink = link;
      this.imageModal = !this.imageModal;
    },
    cancelImageModal() {
      this.selectImgLink = "";
      this.imageModal = !this.imageModal;
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

.header {
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

.handle-modal {
  /deep/ .ant-modal-content {
    padding: inherit;
  }
}

.headerButton {
  display: flex;
  justify-content: center;
  height: 52px;
  border: 1px solid #7345f5;
  border-radius: 5px;
}

.btnItem {
  width: 120px;
  height: 50px;
  line-height: 50px;
  background: #fff;
  color: #101010;
  text-align: center;
  cursor: pointer;
}

.selectBtn {
  background: #7345f5;
  color: #fff;
}

.tableContainer {
  background: #fff;
  margin-top: 20px;
}

.searchBtn {
  width: 800px;
  display: flex;
  column-gap: 20px;
  margin: 0 auto;
}

.handleWrapper {
  width: 450px;
  color: #fff;
}

.reward {
  display: flex;
  align-items: center;
  column-gap: 10px;
}

.handleTitle {
  width: 70px;
  font-size: 20px;
}

.confirm {
  margin-top: 30px;
  text-align: center;
  button {
    color: #8c1aee;
  }
}

.select {
  margin-top: 20px;
  margin-left: 20px;
}

.address {
  width: 153px;
  height: 40px;
  line-height: 40px;
  border: 2px solid #607ff6;
  border-radius: 10px;
  position: absolute;
  top: 40px;
  right: 170px;
  text-align: center;
}

.nav {
  text-align: left;
}
</style>
