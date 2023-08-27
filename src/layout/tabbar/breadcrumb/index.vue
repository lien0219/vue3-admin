<template>
  <!-- 左边 -->
  <el-icon style="width: 30px; margin-right: 10px" @click="changeIcon">
    <component :is="LayOutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑展示匹配的路由标题-->
      <span style="margin: 0px 2px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
    <!-- <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <button @click="handler">获取匹配路由</button> -->
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
// import { ref } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'

const LayOutSettingStore = useLayOutSettingStore()

let $route = useRoute()

const changeIcon = () => {
  LayOutSettingStore.fold = !LayOutSettingStore.fold
}

// const handler = () => {
//   console.log($route)
// }
</script>

<script lang="ts">
export default {
  name: 'Breadcrumb',
}
</script>

<style scoped></style>
