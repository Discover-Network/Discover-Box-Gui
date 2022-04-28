<template>
  <div class="win-history" ref="winHistory">
    <a-modal
      :get-container="() => $refs.winHistory"
      :visible="showWinHistory"
      :footer="null"
      :maskClosable="true"
      :width="1050"
      @cancel="winHistoryCancel"
      :destroyOnClose="true"
      class="winHistoryWrapper"
      :closable="false"
    >
      <div class="my-win-table win-table">
        <div class="modal-title">{{ lg("Win_History") }}</div>
        <a-table
          :columns="winHistoryColumns"
          :data-source="winHistoryData"
          size="middle"
          :pagination="winHistoryPagination"
          :row-key="(record) => record.id"
          :scroll="{ x: 'max-content' }"
          :loading="loading"
        />
      </div>
      <div>
        <div class="win-table-btn" @click="winHistoryCancel">
          {{ lg("ok") }}
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { hideMiddleStr } from "@/utils/format";
import { methodType, request } from "@/utils/request";
import apis from "@/utils/apis";

export default {
  name: "WinHistory",
  props: {
    showWinHistory: {
      type: Boolean,
    },
  },
  data() {
    return {
      winHistoryColumns: [
        {
          dataIndex: "id",
          className: "tableHide",
        },
        {
          title: "User",
          dataIndex: "nick_name",
          align: "left",
        },
        {
          title: "Rewards",
          dataIndex: "bonus",
          align: "center",
        },
        {
          title: "BSC",
          dataIndex: "address",
          align: "center",
        },
      ],
      winHistoryData: [],
      winHistoryPagination: {
        pageSize: 10,
        showSizeChanger: false,
        total: 0,
        onChange: (pageIndex) => {
          this.getWinHistory(pageIndex - 1);
        },
      },
      loading: false,
    };
  },
  mounted() {
    this.getWinHistory(0);
  },
  methods: {
    hideMiddleStr,
    winHistoryCancel() {
      this.winHistoryPagination.total = 0;
      this.winHistoryData = [];
      this.$emit("update:showWinHistory", false);
    },
    getWinHistory(page, size = 10) {
      this.loading = true;
      request(apis.gamesHistory, methodType.GET, { page: page, size: size })
        .then((result) => {
          this.winHistoryPagination.total = result.data.totalNum;
          result.data.items.map((item) => {
            item.address = this.hideMiddleStr(item.address, 6, 6);
          });
          this.winHistoryData = result.data.items;
          this.loading = false;
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style scoped lang="scss">
.win-history {
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
}
</style>
