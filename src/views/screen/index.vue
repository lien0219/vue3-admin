<template>
  <div class="container">
    <div class="screen" ref="screen">
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <Year class="yrar"></Year>
          <Conter class="conter"></Conter>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
// 顶部
import Top from './components/top/index.vue'
// 下左
import Tourist from './components/tourist/index.vue'
import Age from './components/age/index.vue'
import Sex from './components/sex/index.vue'
// 下中
import Map from './components/map/index.vue'
import Line from './components/line/index.vue'
// 下右
import Rank from './components/rank/index.vue'
import Year from './components/year/index.vue'
import Conter from './components/conter/index.vue'

let screen = ref()
onMounted(() => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
})

const getScale = (w = 1920, h = 1080) => {
  const ww = window.innerWidth / w
  const wh = window.innerHeight / h
  return ww < wh ? ww : wh
}

window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%,-50%)`
}
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
  .screen {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 1920px;
    height: 1080px;
    transform-origin: left top;
    .top {
      width: 100%;
      height: 40px;
    }
    .bottom {
      display: flex;
      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;
        .tourist {
          flex: 1.2;
        }
        .sex {
          flex: 1;
        }
        .age {
          flex: 1;
        }
      }
      .center {
        flex: 1.5;
        display: flex;
        flex-direction: column;
        .map {
          flex: 4;
        }
        .line {
          flex: 1.5;
        }
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin-left: 20px;
        .rank {
          flex: 1.5;
        }
        .yrar {
          flex: 1;
        }
        .conter {
          flex: 1;
        }
      }
    }
  }
}
</style>
