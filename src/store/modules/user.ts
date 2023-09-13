import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'

import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'

// 数据类型

import type { UserState } from './types/type'

// 本地存储工具
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 路由
import { constantRoute } from '@/router/routes'

// 过滤异步路由
// function filterAsyncRoute(asyncRoute: any, routes: any) {
//   return asyncRoute.filter((item: any) => {
//     if (routes.includes(item.name)) {
//       if (item.children && item.children.length > 0) {
//         //硅谷333账号:product\trademark\attr\sku
//         item.children = filterAsyncRoute(item.children, routes)
//       }
//       return true
//     }
//   })
// }

let useUserStore = defineStore('User', {
  // 仓库数据存储的地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(),
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
      // 存储用户包含的按钮
      buttons: [],
    }
  },
  // 异步|逻辑
  actions: {
    // 登录
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data)
      if (result.code == 200) {
        this.token = result.data as string
        //  持久化存储
        SET_TOKEN(result.data as string)

        return 'ok'
      } else {
        return Promise.reject(new Error(result.data))
      }
    },
    // 获取用户信息
    async userInfo() {
      let result: userInfoResponseData = await reqUserInfo()
      // 存储用户信息
      if (result.code === 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        // 计算当前用户的异步路由
        // let userAsyncRoute = filterAsyncRoute(asyncRoute, result.data.routes)
        // 菜单的数据
        // this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute]

        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录
    async userLogout() {
      let result: any = await reqLogout()

      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },

  getters: {},
})

export default useUserStore
