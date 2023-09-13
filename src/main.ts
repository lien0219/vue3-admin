import { createApp } from 'vue'
import App from '@/App.vue'
// 引入element-plus插件和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 配置element-plus国际化
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 路由
import router from './router'
// 仓库
import pinia from './store'
// 适配
// import '@/libflexible/flexible'
// svg图标配置
import 'virtual:svg-icons-register'
// 自定义插件对象以及安装自定义插件
import gloablComponent from './components/index'
// 全局样式
import '@/styles/index.scss'
// 暗黑模式样式
import 'element-plus/theme-chalk/dark/css-vars.css'

// 获取应用实例
const app = createApp(App)
// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(gloablComponent)
app.use(router)
app.use(pinia)
// 路由鉴权
import './permisstion'

// 挂载到挂载点上
app.mount('#app')
