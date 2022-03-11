module.exports = {
  library: {
    vue: ['vue', 'vue-router', 'vuex'],
    other: ['axios', 'qs', 'lodash', 'dayjs']
  },
  dllPath: './static/vendor', //dll存放目录
  configPath: './static/config' //生产环境配置文件存放目录
}
