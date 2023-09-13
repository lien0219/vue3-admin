<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">
        可预约总量
        <span>89374</span>
        人
      </p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
import 'echarts-liquidfill' //水球图拓展插件

let people = ref('215908人')
let charts = ref()

onMounted(() => {
  let myCharts = echarts.init(charts.value)
  myCharts.setOption({
    title: {
      text: '水球图',
    },
    xAxis: {},
    yAxis: {},
    series: {
      type: 'liquidFill',
      data: [0.6, 0.4, 0.2],
      radius: '90%',
      animationDuration: 3,
      animationDurationUpdate: 0,
      outline: {
        show: true,
        borderDistance: 8,
        itemStyle: {
          color: 'yellowgreen',
          borderColor: '#294d99',
          borderWidth: 8,
          shadowBlur: 20,
          shadowColor: 'rgba(0,0,0,0.25)',
        },
      },
    },
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  })
})
</script>

<style scoped lang="scss">
.box {
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .top {
    margin-left: 20px;
    .title {
      color: white;
      font-size: 20px;
    }
    .bg {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
    .right {
      float: right;
      color: white;
      font-size: 20px;
      span {
        color: yellowgreen;
      }
    }
  }
  .number {
    margin-top: 30px;
    padding: 15px;
    display: flex;
    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
    }
  }
  .charts {
    width: 100%;
    height: 240px;
  }
}
</style>
