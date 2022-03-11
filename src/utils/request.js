import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
console.log(process.env)
const service = axios.create({
  timeout: 600000,
  baseURL: process.env.VUE_APP_BASE_API,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 用于存储pending的请求（处理多条相同请求）
const pendingRequest = new Map()
// 生成request的唯一key
const generateRequestKey = (config = {}) => {
  // 通过url，method，params，data生成唯一key，用于判断是否重复请求
  // params为get请求参数，data为post请求参数
  const { url, method, params, data } = config
  return [url, method].join('&')
}

// 将重复请求添加到pendingRequest中
const addPendingRequest = (config) => {
  const key = generateRequestKey(config)
  if (!pendingRequest.has(key)) {
    config.cancelToken = new axios.CancelToken((cancel) => {
      pendingRequest.set(key, cancel)
    })
  }
}

// 取消重复请求
const removePendingRequest = (config) => {
  const key = generateRequestKey(config)
  if (pendingRequest.has(key)) {
    const cancelToken = pendingRequest.get(key)
    cancelToken(key) // 取消之前发送的请求
    pendingRequest.delete(key) // 请求对象中删除requestKey
  }
}

// 请求拦截器
service.interceptors.request.use(
  function (config) {
    // 如果有token再添加Authorization字段
    config.headers.Authorization = store.state.tokenKey || ''
    // 处理重复请求
    if (config.isCancelToken) {
      removePendingRequest(config)
      addPendingRequest(config)
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
//   响应拦截器
service.interceptors.response.use(
  function (response) {
    // 移除重复请求
    if (response.config.isCancelToken) {
      removePendingRequest(response.config)
    }
    if (response.data.code === 'B1002') {
      Message({ type: 'warning', message: '抱歉!您当前无此权限' })
    }
    if (response.headers.authorization) {
      store.commit('setTokenKey', response.headers.authorization)
    }
    return response.data
  },
  function (error) {
    // 异常情况console，方便排查问题
    console.log('error', error)
    // 移除重复请求
    if (error.config.isCancelToken) {
      removePendingRequest(error.config || {})
    }
    return Promise.reject(error)
  }
)

export default service
