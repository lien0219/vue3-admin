<template>
  <el-card>
    <div class="box">
      <img :src="userStore.avatar" alt="" class="avatar" />
      <div>
        <h3>{{ getTime() }}好呀{{ userStore.username }}</h3>
        <p>知恩运营平台</p>
      </div>
    </div>
  </el-card>
  <div class="bottom">
    <svg-icon name="welcome" width="600px" height="300px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
import { getTime } from '@/utils/time'
import useUserStore from '@/store/modules/user'

let userStore = useUserStore()
</script>

<style scoped lang="scss">
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  div {
    margin-left: 20px;
    h3 {
      font-size: 30px;
      font-weight: 900;
      margin-bottom: 20px;
    }
    p {
      font-style: italic;
      color: skyblue;
    }
  }
}
.bottom {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
</style>
