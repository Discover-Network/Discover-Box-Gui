<template>
  <div class="transferWrapper">
    <div class="title">提取奖励人工发放</div>
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
    <div class="boxTransferTableWrapper">
      <a-table
        bordered
        :data-source="dataSource"
        :columns="this.selectBtnIndex === 0 ? columns : completedColumns"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'operation'">
            <a-button
              type="primary"
              v-if="selectBtnIndex === 0"
              @click="dealWithTransfer(record)"
            >
              转账
            </a-button>

            <a-button
              v-if="selectBtnIndex === 2"
              type="primary"
              @click="ShowUpdateTxHashModal(record)"
              >update TxHash</a-button
            >
          </template>
        </template>
      </a-table>
    </div>

    <a-modal
      title=""
      :visible="switchNetwork"
      :footer="null"
      :closable="true"
      :maskClosable="true"
      v-if="switchNetwork"
      :width="550"
      style="text-align: center"
      @cancel="switchNetworkCancel"
    >
      <div class="txTitle">Select Network</div>
      <div>
        <a-select
          ref="select"
          :value="networkName"
          style="width: 200px"
          @change="changeNetwork"
        >
          <a-select-option value="ETH">ETH</a-select-option>
          <a-select-option value="BNB">BNB</a-select-option>
        </a-select>
      </div>
      <a-button @click="transfer" size="large" style="margin-top: 15px"
        >确定转账</a-button
      >
    </a-modal>

    <a-modal
      title=""
      :visible="ShowUpdateTxHash"
      :footer="null"
      :closable="true"
      :maskClosable="true"
      v-if="ShowUpdateTxHash"
      :width="550"
      style="text-align: center"
      @cancel="updateTxHashCancel"
    >
      <div class="txTitle">Update Transfer Hash</div>
      <a-input placeholder="请输入交易Hash" size="large" v-model="newTxHash" />
      <a-button @click="updateTxHash" size="large" style="margin-top: 15px"
        >确定</a-button
      >
    </a-modal>
  </div>
</template>

<script>
import Decimal from "decimal.js";
import data_main_list from "@/data/main_list.js";
const tokenAbi = require("@/data/token_abi.json");
export default {
  name: "BoxTransfer",
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
      ShowUpdateTxHash: false,
      updateTxHashRecord: null,
      newTxHash: "",
      selectBtnIndex: 0,
      dataSource: [],
      columns: [
        {
          title: "用户",
          dataIndex: "nick_name",
          width: "30%",
        },
        {
          title: "提取奖励数量",
          dataIndex: "bonus",
        },
        {
          title: "地址",
          dataIndex: "address",
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
      completedColumns: [
        {
          title: "用户",
          dataIndex: "nick_name",
          width: "30%",
        },
        {
          title: "提取奖励数量",
          dataIndex: "bonus",
        },
        {
          title: "地址",
          dataIndex: "address",
        },
        {
          title: "交易Hash",
          dataIndex: "txhash",
          width: "40%",
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
          this.getTransfer(this.selectBtnIndex, pageIndex - 1);
        },
      },
      switchNetwork: false,
      networkName: "ETH",
      dealRecord: null,
    };
  },
  created() {},
  mounted() {
    this.getTransfer(0);
    if (
      window.ethereum.chainId === "0x3" ||
      window.ethereum.chainId === "0x1"
    ) {
      this.networkName = "ETH";
    } else if (window.ethereum.chainId === "0x38") {
      this.networkName = "BNB";
    }
  },
  methods: {
    changeStatus(index) {
      this.selectBtnIndex = index;
      this.getTransfer(index);
    },
    switchNetworkCancel() {
      this.switchNetwork = false;
      this.dealReacord = null;
    },
    getTransfer(type, pageIndex = 0) {
      this.dataSource = [];
      fetch(
        `/api/v1/withdraw/histories?type=${type}&page=${pageIndex}&size=20`,
        {
          method: "GET",
          mode: "cors",
        }
      ).then(async (res) => {
        const result = await res.json();
        const list = result.data.items;
        list.map((item) => {
          item.apply_time = new Date(item.apply_time * 1000).toLocaleString();
        });
        this.dataSource = list;
        this.pagination.total = result.data.totalNum;
      });
    },
    async changeNetwork(value) {
      if (value === "BNB") {
        await this.selectBNB();
      } else if (value === "ETH") {
        await this.selectETH();
      }
    },
    async selectBNB() {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x38" }],
        });
        this.networkName = "BNB";
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x38",
                  rpcUrl:
                    "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                  chainName: "BSC Mainnet",
                  nativeCurrency: {
                    name: "BNB",
                    symbol: "BNB",
                    decimals: 18,
                  },
                  blockExplorerUrls: "https://bscscan.com",
                },
              ],
            });
            this.networkName = "BNB";
          } catch (addError) {
            console.error(addError);
          }
        }
      }
    },
    async selectETH() {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x1" }],
        });
        this.networkName = "ETH";
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x1",
                  rpcUrl:
                    "https://main.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
                  chainName: "Ethereum Mainnet",
                  // chainId: "0x3",
                  // rpcUrl: 'https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
                  // chainName: "Ropsten Test Network",
                  nativeCurrency: {
                    name: "ETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: "https://etherscan.io",
                },
              ],
            });
            this.networkName = "ETH";
          } catch (addError) {
            console.error(addError);
          }
        }
      }
    },
    dealWithTransfer(record) {
      this.switchNetwork = true;
      this.dealRecord = record;
    },
    async transfer() {
      const record = this.dealRecord;
      let v = this;
      const local_address = await v.action.getAddress();
      let trc20_address = "";
      console.log("networkName", this.networkName);
      if (this.networkName === "ETH") {
        trc20_address = data_main_list[0].token_address;
      } else if (this.networkName === "BNB") {
        trc20_address = data_main_list[0].bnb_token_address;
      }
      const decimals = data_main_list[0].token_decimals;

      let contract = new v.myWeb3.eth.Contract(tokenAbi, trc20_address);
      let money = new Decimal(record.bonus)
        .mul(Math.pow(10, decimals))
        .toFixed();
      const data = contract.methods.transfer(record.address, money).encodeABI();

      await v.myWeb3.eth.sendTransaction(
        {
          from: local_address,
          to: trc20_address,
          value: 0,
          data: data,
        },
        (error, result) => {
          console.log(error);
          if (
            error &&
            error.message.includes("User denied transaction signature")
          ) {
            console.log("User Rejections: ", error);
          } else if (result) {
            console.log("result: ", result);
            this.switchNetwork = false;
            this.dealRecord = null;
            const data = {
              id: record.id,
              txhash: result,
            };
            const token = this.$store.state.trojanBox.token;
            fetch("/api/v1/withdraw/process", {
              method: "POST",
              mode: "cors",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
              body: JSON.stringify(data),
            }).then(async (res) => {
              const result = await res.json();
              console.log("update result: ", result);
              // remove processing from datasource
              const newDataSource = [];
              this.dataSource.map((item) => {
                if (item.id !== record.id) {
                  newDataSource.push(item);
                }
              });
              this.dataSource = newDataSource;
            });
          }
        }
      );
    },
    ShowUpdateTxHashModal(record) {
      this.ShowUpdateTxHash = !this.ShowUpdateTxHash;
      this.updateTxHashRecord = record;
    },
    updateTxHash() {
      const data = {
        id: this.updateTxHashRecord.id,
        txhash: this.newTxHash,
      };
      const token = this.$store.state.trojanBox.token;
      fetch("/api/v1/withdraw/report_tx", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(data),
      }).then(async (res) => {
        if (res.ok) {
          this.updateTxHashCancel();
          this.getTransfer(this.selectBtnIndex);
        }
      });
    },
    updateTxHashCancel() {
      this.updateTxHashRecord = null;
      this.newTxHash = "";
      this.ShowUpdateTxHash = !this.ShowUpdateTxHash;
    },
  },
};
</script>

<style scoped lang="scss">
.transferWrapper {
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

.boxTransferTableWrapper {
  background: #fff;
}

.header {
  padding: 20px 0;
  display: flex;
  justify-content: center;
}

.headerButton {
  display: flex;
  justify-content: center;
  width: 162px;
  height: 52px;
  border: 1px solid #7345f5;
  border-radius: 5px;
}

.btnItem {
  width: 80px;
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

.nav {
  padding: 10px 0;
  text-align: left;
}

.txTitle {
  font-size: 24px;
  color: #fff;
  font-weight: 500;
  padding-bottom: 20px;
}
</style>
