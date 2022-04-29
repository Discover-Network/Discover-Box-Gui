<template>
  <div class="share-wrapper" ref="shareWrapper">
    <a-modal
      title=""
      :visible="showShareEarn"
      :footer="null"
      :closable="false"
      @cancel="cancelShareModal"
      width="650"
      :get-container="() => $refs.shareWrapper"
      :centered="true"
      :maskClosable="true"
      :destroyOnClose="true"
    >
      <div class="share-wrapper">
        <div class="share-title">
          Share to Earn
          <img src="@/assets/images/coin.png" alt="" />
        </div>
        <div class="share-desc">
          The Trojan Box is Officially Launched & Recruits Embassador for
          Advertising. Since today, you can share the Trojan Box in below social
          media, and submit your shared link to us to get rewards.
        </div>
        <div class="share-app">
          Share in
          <div class="share-app-item">
            <img src="@/assets/images/share/twitter.png" alt="" />
            <div class="shared-icon" v-if="todayShare.includes(3)">
              <i class="fa fa-check" aria-hidden="true"></i>
            </div>
          </div>
          <div class="share-app-item">
            <img src="@/assets/images/share/gate.png" alt="" />
            <div class="shared-icon" v-if="todayShare.includes(1)">
              <i class="fa fa-check" aria-hidden="true"></i>
            </div>
          </div>
          <div class="share-app-item">
            <img src="@/assets/images/share/weibo.png" alt="" />
            <div class="shared-icon" v-if="todayShare.includes(2)">
              <i class="fa fa-check" aria-hidden="true"></i>
            </div>
          </div>
          <div class="share-app-item">
            <img src="@/assets/images/share/reddit.png" alt="" />
            <div class="shared-icon" v-if="todayShare.includes(4)">
              <i class="fa fa-check" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div class="link-wrapper">
          <div class="link-title">Link</div>
          <a-input placeholder="Your link here" v-model="shareLink" />

          <div class="post-title" v-if="uploadState === false">
            Or Post image
          </div>
          <div class="post-title" v-if="uploadState">Select media</div>
          <div class="post-image-wrapper">
            <a-upload
              name="file"
              :multiple="false"
              :showUploadList="false"
              :before-upload="beforeUpload"
              class="upload"
              v-if="!uploadState"
            >
              <div class="up-content">
                <!--<template v-slot:prefix>-->
                <FileImageOutlined type="file-image" />
                <!--</template>-->
                <span v-if="fileList.length < 1">Your post image</span>
                <span v-if="fileList.length > 0">{{ fileList[0].name }}</span>
              </div>
            </a-upload>
            <div class="share-app media-channel" v-if="uploadState">
              <div class="share-app-item select-media" @click="selectMedia(3)">
                <img src="@/assets/images/share/twitter.png" alt="" />
                <div
                  class="shared-icon"
                  v-if="selectMediaIndex === 3 || todayShare.includes(3)"
                >
                  <i
                    class="fa fa-check"
                    aria-hidden="true"
                    v-if="!todayShare.includes(3)"
                  ></i>
                </div>
              </div>

              <div class="share-app-item select-media" @click="selectMedia(1)">
                <img src="@/assets/images/share/gate.png" alt="" />
                <div
                  class="shared-icon"
                  v-if="selectMediaIndex === 1 || todayShare.includes(1)"
                >
                  <i
                    class="fa fa-check"
                    aria-hidden="true"
                    v-if="!todayShare.includes(1)"
                  ></i>
                </div>
              </div>
              <div class="share-app-item select-media" @click="selectMedia(2)">
                <img src="@/assets/images/share/weibo.png" alt="" />
                <div
                  class="shared-icon"
                  v-if="selectMediaIndex === 2 || todayShare.includes(2)"
                >
                  <i
                    class="fa fa-check"
                    aria-hidden="true"
                    v-if="!todayShare.includes(2)"
                  ></i>
                </div>
              </div>
              <div class="share-app-item select-media" @click="selectMedia(4)">
                <img src="@/assets/images/share/reddit.png" alt="" />
                <div
                  class="shared-icon"
                  v-if="selectMediaIndex === 4 || todayShare.includes(4)"
                >
                  <i
                    class="fa fa-check"
                    aria-hidden="true"
                    v-if="!todayShare.includes(4)"
                  ></i>
                </div>
              </div>
            </div>
            <div class="submit-share upload-btn" v-if="isUploading">
              <a-spin tip="Uploading..." />
            </div>
            <div
              class="submit-share upload-btn"
              @click="handleUpload"
              v-if="!uploadState && !isUploading"
            >
              <UploadOutlined type="upload" />
              Upload
            </div>
          </div>
        </div>
        <!--<div class="share-tips" v-if="todayShare.length > 0">-->
        <div class="share-tips">
          <!--Thank you! You have completed {{shareMedia}} sharing today and you will get ARES!-->
          Everyday you can share once for each channel and you will get ARES.
        </div>
        <div class="share-tips" v-if="checkLink">
          please check share link or select share media
        </div>
        <div class="submit-share" @click="submitShareLink">Submit</div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { MediaChannel } from "@/utils/contant";

export default {
  name: "ShareEarn",
  props: {
    showShareEarn: {
      type: Boolean,
    },
  },
  data() {
    return {
      todayShare: [],
      shareMedia: "",
      shareLink: "",
      checkLink: false,
      fileList: [],
      selectMediaIndex: 0,
      uploadState: false,
      isUploading: false,
      isSubmit: false,
    };
  },
  methods: {
    cancelShareModal() {
      this.$emit("update:showShareEarn", false);
    },
    beforeUpload(file) {
      this.fileList = [file];
      return false;
    },
    selectMedia(index) {
      if (this.todayShare.includes(index)) {
        return;
      } else {
        if (this.selectMediaIndex === index) {
          this.selectMediaIndex = 0;
        } else {
          this.selectMediaIndex = index;
        }
      }
    },
    async handleUpload() {
      if (this.fileList < 1) {
        return;
      }

      this.isUploading = true;
      const formData = new FormData();
      formData.append("file", this.fileList[0]);
      const token = this.$store.state.trojanBox.token;
      await fetch("/api/v1/file/upload", {
        method: "POST",
        mode: "cors",
        headers: {
          Authorization: "Bearer " + token,
        },
        body: formData,
      })
        .then(async (res) => {
          const result = await res.json();
          this.shareLink = result.data;
          this.uploadState = true;
          // this.fileList = [];
          this.isUploading = false;
        })
        .catch((err) => {
          this.isUploading = false;
          console.log("up load image err", err);
        });
    },
    async submitShareLink() {
      this.playBtnSound();
      this.isSubmit = true;
      await this.handleUpload();
      this.checkLink = false;

      let channelIndex = 0;
      if (this.shareLink.startsWith("https://www.reddit.com/")) {
        channelIndex = MediaChannel.Reddit;
      } else if (
        this.shareLink.includes("weibo.cn") ||
        this.shareLink.includes("weibo.com")
      ) {
        channelIndex = MediaChannel.Webio;
      } else if (
        this.shareLink.startsWith("https://twitter.com") ||
        this.shareLink.startsWith("https://www.twitter.com")
      ) {
        channelIndex = MediaChannel.Twitter;
      } else if (this.shareLink.startsWith("https://www.gate.io")) {
        channelIndex = MediaChannel.Gate;
      } else if (this.selectMediaIndex > 0) {
        channelIndex = this.selectMediaIndex;
      }

      if (channelIndex === 0) {
        this.checkLink = true;
        return;
      }

      if (this.shareLink === "" || this.bugDesc === "") {
        this.checkLink = true;
        this.isSubmit = false;
        return;
      }

      const data = {
        content: this.bugDesc,
        link: this.shareLink,
        channel: 6,
        share_type: 3,
      };
      fetch("/api/v1/share", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ",
        },
        body: JSON.stringify(data),
      }).then(async (res) => {
        if (res.ok) {
          this.shareLink = "";
          this.bugDesc = "";
          this.fileList = [];
          this.isSubmit = false;
          this.uploadState = false;
          this.showShareModal = !this.showShareModal;
        } else {
          this.isSubmit = false;
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.share-wrapper {
  color: #fff;
  text-align: center;
  width: 650px;
  /deep/ .ant-modal-mask {
    background-color: #242d4d;
    opacity: 0.85;
  }

  /deep/ .ant-modal-content {
    padding: inherit;
  }
}

.share-title {
  font-size: 35px;
  font-weight: bold;
  img {
    width: 30px;
  }
}

.share-desc {
  line-height: 23px;
  font-size: 16px;
  font-family: Poppins, serif;
}

.share-app {
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Morris Roman, serif;
  font-weight: bold;
  font-size: 20px;
  column-gap: 10px;
  margin-top: 20px;
  img {
    width: 20px;
    height: 18px;
  }
}

.media-channel {
  margin-top: 0;
}

.share-app-item {
  border-radius: 50%;
  border: 1px solid #1de4ae;
  width: 28px;
  height: 28px;
  line-height: 25px;
  position: relative;
  text-align: center;
}

.select-media {
  cursor: pointer;
}

.share-tips {
  font-size: 14px;
  font-family: Poppins;
  font-weight: 300;
  line-height: 23px;
  color: #fff;
  text-align: left;
  margin-top: 5px;
}

.shared-icon {
  position: absolute;
  top: -1px;
  left: -1px;
  width: 28px;
  height: 28px;
  line-height: 28px;
  background: #0025ac;
  opacity: 0.75;
  border-radius: 50%;
}

.link-wrapper {
  text-align: left;
  .ant-input {
    border: 2px solid #1de4ae;
    background: #fff;
    color: #242d4d;
    height: 48px;
    line-height: 48px;
    font-size: 18px;
    border-radius: 15px;
  }
  .ant-input::-webkit-input-placeholder {
    color: #fff;
  }
}

.post-image-wrapper {
  display: flex;
  align-items: center;
  column-gap: 15px;
  .upload {
    border: 2px solid #1de4ae;
    color: #fff;
    height: 48px;
    line-height: 48px;
    font-size: 18px;
    width: 100%;
    border-radius: 15px;
    cursor: pointer;
  }

  .ant-upload {
    width: 100%;
  }
  .up-content {
    color: #fff;
    height: 48px;
    line-height: 48px;
    font-size: 17px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    column-gap: 10px;
    padding: 0 10px;
  }
}

.post-title,
.link-title {
  margin-top: 10px;
  font-size: 16px;
  padding-bottom: 3px;
}

.link-title {
  margin-top: 0;
}

.submit-share {
  width: 110px;
  height: 45px;
  line-height: 45px;
  background: #1de4ae;
  box-shadow: 1px 5px 0 #004867;
  border-radius: 15px;
  font-size: 20px;
  font-weight: 400;
  color: #242d4d;
  text-align: center;
  margin: 0 auto;
  cursor: pointer;
  overflow: hidden;
  margin-top: 20px;
}

.upload-btn {
  width: 125px;
  margin-top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 10px;
  .ant-spin {
    display: flex;
    column-gap: 5px;
    color: #fff;
  }
}
</style>
