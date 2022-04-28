<template>
  <div class="home">
    <BoxHeader />
    <PlayStep />
    <LeaderBoard />
    <GreekGods />
  </div>
</template>

<script>
import { medias, gods } from "@/utils/contant";
import BoxHeader from "@/pages/home/header";
import PlayStep from "@/pages/home/play_step";
import LeaderBoard from "@/pages/home/leaderboard";
import GreekGods from "@/pages/home/greek_gods";

export default {
  name: "HomePage",
  components: {
    GreekGods,
    LeaderBoard,
    BoxHeader,
    PlayStep,
  },
  data() {
    return {
      medias,
      gods,
      columns: [
        {
          dataIndex: "id",
          className: "tableHide",
        },
        {
          title: "User",
          dataIndex: "nick_name",
          align: "left",
          scopedSlots: { customRender: "nickName" },
        },
        {
          title: "Rewards",
          dataIndex: "reward",
          align: "center",
        },
        {
          title: "Address",
          dataIndex: "address",
          align: "center",
        },
      ],
      tdata: [],
      lang_type: "",
      extractShow: false,
      todayShare: [],
      shareMedia: "",
      checkLink: false,
      leaderboardData: [],
      championData: [],
      num_balance: 0,
      gameAccountBalance: 0,
      gamePermissions: false,
      modalShow: false,
      showShareModal: false,
      winTotalNum: 0,
      selectLeaderboard: "new_start",
      screenWidth: 0,
      shareLink: "",
      bugDesc: "",
      selectAddress: "",
      prize: 500000,
      miniBalance: 10000,
      totalWinAres: 0,
      nickName: "",
      message: [],
      messageInterval: null,
      fileList: [],
      selectMediaIndex: 0,
      uploadState: false,
      isUploading: false,
      isSubmit: false,
      volume: false,
    };
  },
  computed: {},
  mounted() {},
  methods: {},
};
</script>

<style scoped lang="scss">
.home {
  font-family: "LTWave", serif;
}
</style>
