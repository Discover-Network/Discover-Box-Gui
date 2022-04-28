<template>
  <div class="my-win-history" ref="myWinHistory">
    <a-modal
      :get-container="() => $refs.myWinHistory"
      :visible="showMyWinHistory"
      :footer="null"
      :maskClosable="true"
      :closable="false"
      :destroyOnClose="true"
      :width="1050"
      class="winHistoryWrapper"
    >
      <div class="my-win-table">
        <div class="modal-title">{{ lg("Latest_Records") }}</div>
        <a-table
          :columns="MyWinColumns"
          :data-source="myWinHistoryData"
          size="middle"
          :pagination="myWinHistoryPagination"
          :row-key="(record) => record.create_time + record.address"
          :scroll="{ x: 'max-content' }"
          :loading="loading"
        >
          <template v-slot:GodAvatar="{ text }">
            <div class="table-god-avatar">
              <div class="godAvatar">
                <img :src="gods[text].url" alt="" />
              </div>
              <span>{{ lg(gods[text].name) }}</span>
            </div>
          </template>
        </a-table>
      </div>
      <div>
        <div class="win-table-btn" @click="myWinHistoryCancel">
          {{ lg("ok") }}
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { gods } from "@/utils/contant";
import { methodType, request } from "@/utils/request";
import apis from "@/utils/apis";

export default {
  props: {
    showMyWinHistory: {
      type: Boolean,
    },
  },
  name: "MyWinHistory",
  data() {
    return {
      gods,
      MyWinColumns: [
        {
          title: "Time",
          dataIndex: "create_time",
          align: "left",
        },
        {
          title: "Rewards",
          dataIndex: "bonus",
          align: "left",
        },
        {
          title: "God",
          dataIndex: "chosen_index",
          align: "left",
          scopedSlots: { customRender: "GodAvatar" },
        },
      ],
      myWinHistoryData: [],
      myWinHistoryPagination: {
        pageSize: 10,
        showSizeChanger: false,
        total: 0,
        onChange: (pageIndex) => {
          this.getMyWinHistory(pageIndex - 1);
        },
      },
      loading: false,
    };
  },
  mounted() {
    this.getMyWinHistory(0);
  },
  methods: {
    myWinHistoryCancel() {
      this.$emit("update:showMyWinHistory", false);
      this.myWinHistoryPagination.total = 0;
      this.myWinHistoryData = [];
    },
    getMyWinHistory(page, size = 10) {
      this.loading = true;
      request(apis.myGamesHistory, methodType.GET, { page: page, size: size })
        .then((result) => {
          this.myWinHistoryPagination.total = result.data.totalNum;
          result.data.items.map((item) => {
            item.create_time = new Date(item.play_time * 1000).toLocaleString();
            item.chosen_index = item.cards[item.chosen_index] - 1;
          });
          this.myWinHistoryData = result.data.items;
          this.loading = false;
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>

<style scoped lang="scss">
.my-win-history {
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
