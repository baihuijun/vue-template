const webpack = require('webpack')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const path = require('path')
const { library, dllPath, configPath } = require('./dll.config.js')
const IS_PROD = process.env.NODE_ENV === 'production'

const compress = new CompressionWebpackPlugin({
  filename: (info) => {
    return `${info.path}.gz${info.query}`
  },
  algorithm: 'gzip',
  threshold: 10240,
  test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'),
  minRatio: 0.8,
  deleteOriginalAssets: false
})
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  // 生产环境sourceMap
  productionSourceMap: false,
  // filenameHashing: false,
  devServer: {
    proxy: {
      '/tyjk': {
        //这里最好有一个 /
        target: 'https://biz.ghzyj.sh.gov.cn/15min/api', // 后台接口域名
        ws: true, //如果要代理 websockets，配置这个参数
        secure: true, // 如果是https接口，需要配置这个参数
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/tyjk': ''
        }
      }
    }
  },
  css: {
    requireModuleExtension: true,
    extract: true,
    sourceMap: false,
    loaderOptions: {
      sass: {
        prependData: '@import "@/styles/common.scss";'
      }
    }
  },
  configureWebpack: (config) => {
    if (IS_PROD) {
      const pluginsDll = [
        ...Object.keys(library).map((name) => {
          return new webpack.DllReferencePlugin({
            context: '.',
            // name: "[name]_[hash]",
            manifest: require(path.join(__dirname, dllPath, `${name}-manifest.json`))
          })
        })
      ]
      const pluginsHtml = new AddAssetHtmlPlugin(
        Object.keys(library).map((name) => {
          return {
            filepath: require.resolve(path.resolve(__dirname, `${dllPath}/MyDll.${name}.js`)),
            includeSourcemap: false,
            outputPath: dllPath,
            publicPath: dllPath
          }
        })
      )
      const configJS = new AddAssetHtmlPlugin([
        {
          filepath: require.resolve(path.resolve(__dirname, `${configPath}/production_config.js`)),
          includeSourcemap: false,
          outputPath: configPath,
          publicPath: configPath
        }
      ])
      config.plugins.push(compress) // 开发环境开启影响热更新功能
      config.plugins.push(pluginsHtml)
      config.plugins.push(configJS)
      config.plugins = config.plugins.concat(pluginsDll)
    }
  }
}
