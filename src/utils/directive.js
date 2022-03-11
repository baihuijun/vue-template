/*
 * @Description:自定义指令
 * @Autor: bhj
 * @Date: 2021-12-20 09:44:41
 * @LastEditors: bhj
 * @LastEditTime: 2022-03-11 14:24:10
 */
import _ from 'lodash'

function plugin(Vue) {
  if (plugin.installed) {
    return
  }
  // 左右分栏拖拽
  Vue.directive('dragControllerDiv', {
    bind(el, binding, vnode, oldVnode) {
      const { left, right, resize } = binding.value
      const self = vnode.context
      const resizeDom = self.$refs[resize]
      const boxDom = el
      let leftDom = self.$refs[left]
      let rightDom = self.$refs[right]
      leftDom = leftDom instanceof Vue ? leftDom.$el : leftDom
      rightDom = rightDom instanceof Vue ? rightDom.$el : rightDom
      // for (let i = 0; i < resize.length; i++) {
      // 鼠标按下事件
      resizeDom.onmousedown = function (e) {
        // 颜色改变提醒
        // resizeDom.style.background = '#818181'
        var startX = e.clientX
        resizeDom.left = resizeDom.offsetLeft
        // 鼠标拖动事件
        document.onmousemove = function (e) {
          _.throttle(
            (function () {
              var endX = e.clientX
              var moveLen = resizeDom.left + (endX - startX) // （endx-startx）=移动的距离。resize[i].left+移动的距离=左边区域最后的宽度
              var maxT = boxDom.clientWidth - resizeDom.offsetWidth // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
              if (moveLen < 32) moveLen = 32 // 左边区域的最小宽度为32px
              if (moveLen > maxT - 150) moveLen = maxT - 150 // 右边区域最小宽度为150px
              resizeDom.style.left = moveLen // 设置左侧区域的宽度
              leftDom.style.width = moveLen + 'px'
              rightDom.style.width = boxDom.clientWidth - moveLen - 30 + 'px'
              // }
            })(),
            1000
          )
        }
        // 鼠标松开事件
        document.onmouseup = function (evt) {
          // 颜色恢复
          resizeDom.style.background = '#d6d6d6'
          document.onmousemove = null
          document.onmouseup = null
          resizeDom.releaseCapture && resizeDom.releaseCapture() // 当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
        }
        resizeDom.setCapture && resizeDom.setCapture() // 该函数在属于当前线程的指定窗口里设置鼠标捕获
        return false
      }
    }
  })

  //监听除某元素之外点击事件
  Vue.directive('clickOutside', {
    // 初始化指令
    bind(el, binding, vnode) {
      function clickHandler(e) {
        // 这里判断点击的元素是否是本身，是本身，则返回
        if (el.contains(e.target)) {
          return false
        }
        // 判断指令中是否绑定了函数
        if (binding.expression) {
          // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
          binding.value(e)
        }
      }
      // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
      el.__vueClickOutside__ = clickHandler
      document.addEventListener('click', clickHandler)
    },
    unbind(el, binding) {
      // 解除事件监听
      document.removeEventListener('click', el.__vueClickOutside__)
      delete el.__vueClickOutside__
    }
  })
}
export default plugin
