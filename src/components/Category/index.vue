<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          size="default"
          style="width: 180px"
          v-model="categoryStore.c1Id"
          @change="handler"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="c1 in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          size="default"
          style="width: 180px"
          v-model="categoryStore.c2Id"
          @change="handler1"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="c2 in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          size="default"
          style="width: 180px"
          v-model="categoryStore.c3Id"
          :disabled="scene == 0 ? false : true"
        >
          <el-option
            v-for="c3 in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useCategoryStore from '@/store/modules/category'

let categoryStore = useCategoryStore()

// 挂载完毕通知仓库发送请求
onMounted(() => {
  getC1()
})

const getC1 = () => {
  // 挂载完毕通知仓库发送请求
  categoryStore.getC1()
}

const handler = () => {
  categoryStore.c2Id = ''
  categoryStore.c3Arr = []
  categoryStore.c3Id = ''
  categoryStore.getC2()
}
const handler1 = () => {
  categoryStore.c3Id = ''
  categoryStore.getC3()
}
// 接收scene
defineProps(['scene'])
</script>

<style scoped></style>
