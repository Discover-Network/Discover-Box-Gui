<template>
  <div class="withdraw-wrapper" ref="withdrawContainer">
    <a-modal
      :get-container="() => $refs.withdrawContainer"
      :visible="showWithdrawHistory"
      :footer="null"
      :maskClosable="true"
      :closable="false"
      :destroyOnClose="true"
      :width="1050"
      class="winHistoryWrapper"
    >
      <div class="my-win-table">
        <div class="modal-title">{{ lg("Extract_Records") }}</div>
        <a-table
          :columns="withdrawColumns"
          :data-source="myWithdraw"
          size="middle"
          :pagination="withdrawPagination"
          :row-key="(record) => record.apply_time"
          :scroll="{ x: 'max-content' }"
          :loading="loading"
        >
          <template v-slot:status="{ text }">
            <!--<span v-if="text === 0">unProcess</span>-->
            <span v-if="text === 1">processing</span>
            <i class="fa fa-clock-o" aria-hidden="true" v-if="text === 0"></i>
            <i
              class="fa fa-check-circle-o"
              aria-hidden="true"
              v-if="text === 2"
            ></i>
          </template>
        </a-table>
      </div>
      <div>
        <div class="win-table-btn" @click="withdrawCancel">{{ lg("ok") }}</div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { methodType, request } from "@/utils/request";
import apis from "@/utils/apis";
export default {
  props: {
    showWithdrawHistory: {
      type: Boolean,
    },
  },
  name: "WithdrawHistory",
  data() {
    return {
      withdrawColumns: [
        {
          title: "User",
          dataIndex: "nick_name",
          align: "left",
        },
        {
          title: "Extract Rewards",
          dataIndex: "bonus",
          align: "left",
        },
        {
          title: "Time",
          dataIndex: "apply_time",
          align: "left",
        },
        {
          title: "Status",
          dataIndex: "state",
          align: "left",
          scopedSlots: { customRender: "status" },
        },
      ],
      myWithdraw: [],
      withdrawPagination: {
        pageSize: 10,
        showSizeChanger: false,
        total: 0,
        onChange: (pageIndex) => {
          this.getMyWithdraw(pageIndex - 1);
        },
      },
      loading: false,
    };
  },
  mounted() {
    this.getMyWithdraw(0);
  },
  methods: {
    getMyWithdraw(page, size = 10) {
      this.loading = true;
      request(apis.myWithdraw, methodType.GET, { page: page, size: size })
        .then((result) => {
          this.withdrawPagination.total = result.data.totalNum;
          result.data.items.map((item) => {
            item.apply_time = new Date(item.apply_time * 1000).toLocaleString();
          });
          this.myWithdraw = result.data.items;
          this.loading = false;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    withdrawCancel() {
      this.$emit("update:showWithdrawHistory", false);
      this.withdrawPagination.total = 0;
      this.myWithdraw = [];
    },
  },
};
</script>

<style scoped lang="scss">
.withdraw-wrapper {
  /deep/ .ant-modal-mask {
    background-color: #242d4d;
    opacity: 0.85;
  }

  /deep/ .ant-modal-content {
    padding: inherit;
  }
  .modal-title {
    font-weight: bold;
    color: #fff;
    text-align: center;
    width: 100%;
    font-size: 30px;
    padding-bottom: 10px;
  }
  color: #fff;
  /deep/ .ant-modal {
    top: 50px;
  }
  /deep/ .ant-modal-content {
    color: #ffffff !important;
  }
  .my-win-table {
    /deep/ .ant-table-thead {
      background: #284265;
    }
    /deep/ .ant-table-thead > tr > th {
      background: #284265;
      color: #fff;
      border-right: none;
      border-bottom: none;
    }

    /deep/ .ant-table-placeholder {
      background: #242d4d;
      color: #242d4d;
      border: none;
    }

    /deep/ .ant-table {
      color: #fff;
      background: #242d4d;
      font-size: 16px;
    }
    /deep/ .ant-table-tbody {
      font-family: Poppins, serif;
      background: #242d4d;
    }
    /deep/ .ant-table-tbody > tr > td {
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      padding: 8px !important;
    }
    /deep/ .ant-table-tbody > tr:hover {
      color: #2e4765;
    }

    /deep/ .ant-pagination-item {
      border: 1px solid #1de4ae;
      margin-right: 5px;
      a {
        color: #1de4ae;
      }
    }

    /deep/ .ant-pagination-item-ellipsis {
      color: #1de4ae;
    }

    /deep/ .anticon {
      color: #1de4ae;
    }

    /deep/ .ant-pagination-item-active {
      background: #1de4ae;
      a {
        color: #242d4d;
      }
    }

    /deep/ .ant-spin-dot-item {
      background-color: #1de4ae;
    }
  }

  .win-table-btn {
    width: 120px;
    height: 45px;
    line-height: 45px;
    font-size: 20px;
    text-align: center;
    background: #1de4ae;
    box-shadow: 1px 5px 0 #004867;
    border-radius: 15px;
    cursor: pointer;
    margin: 0 auto;
    margin-top: 20px;
  }
  /deep/ .tableHide {
    display: none;
  }
  .table-god-avatar {
    display: flex;
    align-items: center;
    column-gap: 10px;
    img {
      width: 32px;
      border-radius: 50%;
    }
    .godAvatar {
      border: 2px solid #e7ebff;
      border-radius: 50%;
    }
  }
  .win-table-btn {
    width: 120px;
    height: 45px;
    line-height: 45px;
    font-size: 20px;
    text-align: center;
    background: #1de4ae;
    box-shadow: 1px 5px 0 #004867;
    border-radius: 15px;
    cursor: pointer;
    margin: 0 auto;
    margin-top: 20px;
  }
}
</style>
