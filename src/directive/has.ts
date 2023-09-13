import pinia from '@/store'
import useUserStore from '@/store/modules/user'

let userStore = useUserStore(pinia)

export const isHasButton = (app: any) => {
  // 全局自定义指令   按钮权限
  app.directive('has', {
    mounted(el: any, options: any) {
      //   console.log(userStore.buttons)
      if (!userStore.buttons.includes(options.value)) {
        // console.log(el)
        el.parentNode.removeChild(el)
      }
    },
  })
}
