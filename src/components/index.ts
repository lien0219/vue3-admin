// 引入项目全局组件
import SvgIcon from './SvgIcon/index.vue'
import Category from './Category/index.vue'
import Pagination from './Pagination/index.vue'

// 全部图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import type { App, Component } from 'vue'
const components: { [name: string]: Component } = {
  SvgIcon,
  Category,
  Pagination,
}
export default {
  install(app: App) {
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key])
    })
    // 注册图标全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
