<template>
  <div class="box2">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

let charts = ref()

onMounted(() => {
  let myCharts = echarts.init(charts.value)

  let option = {
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: 10,
      right: 30,
      orient: 'vertical', //竖着的列
      textStyle: {
        color: 'white',
        fontSize: 12,
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
        },
        // emphasis: {
        //   label: {
        //     show: true,
        //     fontSize: 40,
        //     fontWeight: 'bold',
        //   },
        // },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '军事' },
          { value: 735, name: '新闻' },
          { value: 580, name: '直播' },
          { value: 484, name: '娱乐' },
          { value: 300, name: '财经' },
        ],
      },
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  }
  myCharts.setOption(option)
})
</script>

<style scoped lang="scss">
.box2 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  .title {
    margin-left: 20px;
    p {
      color: white;
      font-size: 20px;
    }
    img {
    }
  }
  .charts {
    height: 260px;
  }
}
</style>
