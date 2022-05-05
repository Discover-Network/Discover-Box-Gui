<template>
  <div class="greek-gods">
    <div class="greek-gods-title">
      {{ lg("greek_gods") }}
    </div>
    <div class="greek-gods-content">
      <el-carousel
        :interval="4000"
        :height="screenWidth < 500 ? '180px' : '260px'"
        arrow="always"
        :type="screenWidth < 500 ? '' : 'card'"
      >
        <el-carousel-item v-for="item in gods" :key="item.name">
          <div class="greek-god-card">
            <div class="greek-god-avatar">
              <img :src="item.url" alt="" />
            </div>
            <div class="greek-god-card-info">
              <div class="greek-god-card-name">{{ lg(item.name) }}</div>
              <div class="greek-god-card-desc">{{ lg(item.desc) }}</div>
              <div class="greek-god-card-type">
                <img :src="item.typeImg" alt="" />
                <span>{{ lg(item.army) }}</span>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import { gods } from "@/utils/contant";

export default {
  name: "GreekGods",
  data() {
    return {
      gods,
      screenWidth: document.body.clientWidth,
    };
  },
  mounted() {
    console.log("width: ", document.body.clientWidth);
  },
};
</script>

<style scoped lang="scss">
.greek-gods {
  height: 537px;
  padding-top: 50px;
  background: url("../../assets/images/footer_bg.png");
  background-size: cover;
  text-align: left;
}

.greek-gods-title {
  height: 42px;
  font-size: 40px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-top: 20px;
}

.greek-god-card {
  width: 450px !important;
  height: 265px;
  background: #ffffff;
  border: 3px solid #2e1d8f;
  border-radius: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #282d71;
  margin: 0 auto;
  padding: 0 10px;
}

.greek-god-avatar {
  border: 4px solid #fff;
  border-radius: 50%;
  height: 208px;
}

.greek-god-avatar:hover {
  transform: scale(1.1);
}

.greek-god-avatar img {
  width: 200px;
  border: 6px solid #282d71;
  border-radius: 50%;
}

.greek-god-card-name {
  height: 36px;
  font-size: 34px;
  font-weight: bold;
}

.greek-god-card-desc {
  font-size: 22px;
  height: 27px;
  margin-top: 15px;
  font-weight: bold;
}

.greek-god-card-type {
  width: 148px;
  height: 34px;
  line-height: 34px;
  font-size: 21px;
  margin-left: 15px;
  margin-top: 20px;
  display: flex;
  align-items: center;
  color: #fff;
  background: linear-gradient(84deg, #0025ac 0%, rgba(0, 37, 172, 0) 100%);
}

.greek-god-card-type > img {
  width: 35px;
  margin-left: -20px;
}

.greek-god-card-type > span {
  margin-left: 10px;
}

.greek-gods-content {
  /*display: flex;*/
  /*justify-content: space-around;*/
  margin-top: 50px;
  padding: 0 110px;

  /deep/ .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  /deep/ .el-carousel__item:nth-child(2n) {
    background-color: rgba(0, 0, 0, 0);
  }

  /deep/ .el-carousel__item:nth-child(2n + 1) {
    background-color: rgba(0, 0, 0, 0);
  }

  /deep/ .el-carousel__item .el-carousel__mask {
    background-color: #000;
    opacity: 0;
  }

  /deep/ .el-carousel__indicators {
    padding-top: 25px !important;
  }

  /deep/ .el-carousel__arrow i {
    font-size: 26px;
    color: #1de4ae;
    font-weight: bold;
  }
}

@media screen and (max-width: 750px) {
  .greek-gods-content {
    padding: 0;
    /deep/ .el-carousel__button {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    /deep/ .el-carousel__indicators--horizontal {
      bottom: -12px;
    }
  }

  .greek-gods {
    height: 420px;
  }

  .greek-god-card {
    width: 302px !important;
    height: 160px;
    column-gap: 15px;
    padding: 0 20px;
  }

  .greek-god-avatar {
    border: 4px solid #fff;
    height: 114px;
    width: 121px;
    border-radius: 14px;
    margin-left: 24px;
  }

  .greek-god-avatar img {
    width: 106px;
  }

  .greek-god-card-name {
    font-size: 22px;
    height: 16px;
  }

  .greek-god-card-type {
    font-size: 12px;
    height: 28px;
    line-height: 28px;
    margin-top: 10px;
    img {
      width: 28px;
    }
  }

  .greek-god-card-desc {
    font-size: 16px;
  }
}
</style>
