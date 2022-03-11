/*
 * @Description: 所有组件统一注册   文件夹名称为组件名 子文件入口固定为index.vue
 * @Autor: bhj
 * @Date: 2022-03-11 14:18:32
 * @LastEditors: bhj
 * @LastEditTime: 2022-03-11 14:18:43
 */
const requireComponents = require.context('@/components', true, /^\.\/Base.*?\/index.vue$/)
function plugin(Vue) {
  if (plugin.installed) {
    return
  }
  requireComponents.keys().forEach((fileName) => {
    // 组件实例
    const reqCom = requireComponents(fileName)
    // 截取文件夹名称为组件名
    const reqComName = fileName.split('/')[1]
    // 组件挂载
    Vue.component(reqComName, reqCom.default || reqCom)
  })
}
export default plugin
