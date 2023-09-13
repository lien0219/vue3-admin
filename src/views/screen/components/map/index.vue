<template>
  <div class="box4" ref="charts"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
// 地图数据
import chinaJSON from './china.json'

let charts = ref()
// 注册地图
echarts.registerMap('china', chinaJSON)

onMounted(() => {
  let chartsMap = echarts.init(charts.value)
  chartsMap.setOption({
    //   地图组件
    geo: {
      map: 'china',
      roam: true, //鼠标缩放
      left: 50,
      top: 50,
      right: 50,
      bottom: 50,
      label: {
        show: true,
        color: 'white',
        fontSize: 12,
      },
      itemStyle: {
        // 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#5e7db3', // 0% 处的颜色
            },
            {
              offset: 0.5,
              color: '#bb9bcc', // 50% 处的颜色
            },
            {
              offset: 1,
              color: '#acedd9', // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        opacity: 0.8,
      },
      //  地图高亮
      emphasis: {
        itemStyle: {
          color: '#fcc8ee',
        },
        label: {
          fontSize: 30,
        },
      },
    },
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    series: [
      {
        type: 'lines', //航线
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [119.306239, 26.075302], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: 'orange',
              width: 2,
            },
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [87.617733, 43.792818], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: 'green',
              width: 2,
            },
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [104.065735, 30.659462], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: 'red',
              width: 2,
            },
          },
        ],
        // 线条特效
        effect: {
          show: true,
          symbol: 'arrow',
          color: 'black',
          symbolSize: 10,
        },
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.box4 {
}
</style>
