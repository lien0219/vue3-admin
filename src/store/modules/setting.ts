// layout组件配置仓库
import { defineStore } from 'pinia'

let useLayOutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //控制菜单折叠收起
      refsh: false, //刷新
    }
  },
})

export default useLayOutSettingStore
