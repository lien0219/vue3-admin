import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'

let router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoute,
  //滚动
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})

export default router
