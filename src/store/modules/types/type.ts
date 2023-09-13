import type { RouteRecordRaw } from 'vue-router'
import type { CategoryObj } from '@/api/product/attr/type'
//state类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
}

// 分类state类型
export interface CategoryState {
  c1Id: string | number
  c1Arr: CategoryObj[]
  c2Id: string | number
  c2Arr: CategoryObj[]
  c3Arr: CategoryObj[]
  c3Id: string | number
}
