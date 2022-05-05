<template>
  <div class="to-play">
    <div class="title">
      {{ lg("how_to_play") }}
    </div>
    <div class="to-play-steps">
      <div class="step-card" v-for="(item, index) in steps" :key="index">
        <div class="header">
          <div class="step-title">{{ lg(item.name) }}</div>
          <div class="step">
            <div class="step-num">{{ lg("step") }} {{ item.step }}</div>
          </div>
        </div>
        <div class="step-desc">
          {{ lg(item.desc) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayStep",
  data() {
    return {
      steps: [
        {
          name: "buy_tickets",
          step: " 1",
          desc: "buy_tickets_tips",
        },
        {
          name: "wait_for_draw",
          step: " 2",
          desc: "wait_for_draw_tips",
        },
        {
          name: "check_for_prize",
          step: " 3",
          desc: "check_for_prize_tips",
        },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.to-play {
  min-height: 500px;
  width: 100%;
  background: #1de4ae;
  padding: 0 160px;
  text-align: left;
}

.to-play-steps {
  margin-top: 55px;
  display: flex;
  justify-content: space-around;
}

.to-play .title {
  padding-top: 40px;
  font-size: 40px;
  font-weight: bold;
  text-align: center;
  color: #282d71;
}

.step-card {
  width: 345px;
  border-radius: 20px;
  padding: 30px 35px;
  color: #0e174f;
  background: #fff;
}

.step-card .step {
  position: relative;
}
.step-card .header .step-title {
  font-size: 25px;
  font-weight: bold;
  text-align: left;
  vertical-align: top;
}
.step-card .step-num {
  color: #fff;
  width: 120px;
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-radius: 0 0 15px 15px;
  background: #282d71;
  box-shadow: 4px 4px 0px rgba(11, 9, 68, 0.15);
  position: absolute;
  top: -60px;
  right: -15px;
}

.step-card .step-desc {
  font-family: Poppins, serif;
  margin-top: 20px;
  line-height: 26px;
  font-weight: 600;
}

@media screen and (max-width: 750px) {
  .to-play {
    padding: 0 20px;
  }

  .to-play-steps {
    flex-direction: column;
    align-items: center;
    row-gap: 20px;
    padding-bottom: 30px;
  }
}
</style>
