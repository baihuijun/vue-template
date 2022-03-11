const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { library, dllPath } = require('./dll.config.js')

// dll文件存放的目录

module.exports = {
  entry: {
    // 需要提取的库文件
    ...library
  },
  output: {
    path: path.join(__dirname, dllPath),
    filename: 'Mydll.[name].js',
    // vendor.dll.js中暴露出的全局变量名
    // 保持与 webpack.DllPlugin 中名称一致
    library: '[name]_[hash]'
  },
  plugins: [
    // 清除之前的dll文件
    new CleanWebpackPlugin(),
    // 设置环境变量
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    // manifest.json 描述动态链接库包含了哪些内容
    new webpack.DllPlugin({
      path: path.join(__dirname, dllPath, '[name]-manifest.json'),
      // 保持与 output.library 中名称一致
      name: '[name]_[hash]',
      context: process.cwd()
      // context: '.' //必填，不然在web网页中找不到 '_dll_[name]'，会报错
    })
  ]
}
