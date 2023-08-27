<template>
  <el-button
    @click="updateRefsh"
    type="primary"
    size="small"
    icon="Refresh"
    circle
  ></el-button>
  <el-button
    @click="fullScreen"
    type="primary"
    size="small"
    icon="FullScreen"
    circle
  ></el-button>
  <el-button type="primary" size="small" icon="Setting" circle></el-button>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0px 10px; border-radius: 50%"
    alt=""
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import useUserStore from '@/store/modules/user'
import useLayOutSettingStore from '@/store/modules/setting'

let $router = useRouter()
let $route = useRoute()
let layoutSettingStore = useLayOutSettingStore()

let userStore = useUserStore()
// 刷新
const updateRefsh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh
}
// 全屏
const fullScreen = () => {
  // dom对象属性，判断当前是不是全屏
  let full = document.fullscreenElement
  if (!full) {
    // 全屏
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}
// 退出登录
const logout = async () => {
  await userStore.userLogout()
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>
<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped></style>
