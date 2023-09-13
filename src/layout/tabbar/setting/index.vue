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
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          v-model="color"
          show-alpha
          :predefine="predefineColors"
          size="small"
          @change="setColor"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="dark"
          size="large"
          inline-prompt
          active-icon="MoonNight"
          inactive-icon="Sunny"
          @change="changeDark"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button type="primary" size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
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
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useUserStore from '@/store/modules/user'
import useLayOutSettingStore from '@/store/modules/setting'

let $router = useRouter()
let $route = useRoute()
let layoutSettingStore = useLayOutSettingStore()

let userStore = useUserStore()

// 收集开关数据
let dark = ref<boolean>(false)
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

// 颜色
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
// 暗黑模式切换
const changeDark = () => {
  let html = document.documentElement
  dark.value ? (html.className = 'dark') : (html.className = '')
}
// 主体颜色切换
const setColor = () => {
  const html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>
<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style scoped></style>
