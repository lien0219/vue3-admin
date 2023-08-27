// 路由鉴权
import router from '@/router'
import setting from './setting'

// 进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false }) //去除滚动条圆形加载

// 获取token
import useUserStore from '@/store/modules/user'
import pinia from '@/store'
let userStore = useUserStore(pinia)
console.log(userStore)

// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.start()
  // 获取token判断用户登录状态
  let token = userStore.token
  // 获取用户名
  let username = userStore.username
  if (token) {
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //  有用户信息
      if (username) {
        next()
      } else {
        // 没有用户信息，发送请求获取用户信息
        try {
          // 获取用户信息
          await userStore.userInfo()
          next()
        } catch (error) {
          // token过期 && 手动更改触发退出登录，用户相关信息清除
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
  // next()
})
// 全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})
