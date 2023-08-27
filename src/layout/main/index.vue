<template>
  <!-- 路由出口 -->
  <router-view v-slot="{ Component }">
    <!-- 动画 -->
    <transition name="fade">
      <!-- 显示路由组件 -->
      <component :is="Component" v-if="flag"></component>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from 'vue'
import useLayOutSettingStore from '@/store/modules/setting'
let layOutSettingStore = useLayOutSettingStore()

let flag = ref(true)
// 监听仓库数据变化
watch(
  () => layOutSettingStore.refsh,
  () => {
    // 刷新按钮，路由组件销毁
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  },
)
</script>
<script lang="ts">
export default {
  name: 'Main',
}
</script>
<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.5s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
