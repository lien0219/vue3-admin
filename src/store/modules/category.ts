// 商品分类全局组件仓库
import { defineStore } from 'pinia'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr'
import type { CategoryResponseData } from '@/api/product/attr/type'
import type { CategoryState } from './types/type'

let useCategoryStore = defineStore('Category', {
  state: (): CategoryState => {
    return {
      // 一级分类数据
      c1Arr: [],
      // 存储一级分类id
      c1Id: '',
      //   二级分类数据
      c2Id: '',
      //  二级分类id
      c2Arr: [],
      //   三级分类数据
      c3Arr: [],
      //   三级分类id
      c3Id: '',
    }
  },
  actions: {
    // 获取一级分类
    async getC1() {
      let result: CategoryResponseData = await reqC1()
      if (result.code == 200) {
        this.c1Arr = result.data
      }
    },
    // 二级分类
    async getC2() {
      let result: CategoryResponseData = await reqC2(this.c1Id)
      if (result.code == 200) {
        this.c2Arr = result.data
      }
    },
    // 三级分类
    async getC3() {
      let result: CategoryResponseData = await reqC3(this.c2Id)
      //   console.log(result)
      if (result.code == 200) {
        this.c3Arr = result.data
      }
    },
  },
  getters: {},
})

export default useCategoryStore
