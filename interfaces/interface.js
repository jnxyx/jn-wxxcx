/*
 *  请求数据操作封装
 *  get   方法执行get操作
 *  post  方法执行post操作
 *  
 *  提供 resolveRequestData 方法处理特殊请求头
 */
const memory = require('../memory/memory.js')

let inferface = {
  appConfig: require('../app-config.js'),
  get: (url, data) => {
    let options = {
      url: url,
      data: data || {},
      method: 'get'
    }
    return inferface.request(options)
  },
  post: (url, data) => {
    let options = {
      url: url,
      data: data || {},
      method: 'post'
    }
    return inferface.request(options)
  },
  request: (options) => {
    let promise = new Promise((resolve, reject) => {
      let requestArgs = {
        url: options.url,
        data: options.data,
        header: {},
        method: options.method,
        dataType: 'json',
        success: function (res) {
          let data = inferface.resolveResponseData(res.data, options)
          resolve(data)
        },
        fail: function (res) { reject('') }
      }
      requestArgs.data = inferface.resolveRequestData(requestArgs.data)
      requestArgs.header = inferface.resolveRequestHeader(requestArgs.header)
      wx.request(requestArgs)
    })
    return promise
  },
  // 请求数据 中央处理
  resolveRequestData: (data) => {
    return {
      ...data,
      "_platform": inferface.appConfig.platform,
      "_version": inferface.appConfig.version,
      "_device": inferface.appConfig.device,
      "utoken": memory.getData('userInfo') ? memory.getData('userInfo').utoken : ''
    }
  },
  // 响应数据 中央处理
  resolveResponseData: (data, options) => {
    let host = inferface.appConfig.host.kitchenHost
    console.log(' --- host: --- ', host)
    if (options.url.indexOf(host) > -1 && data.code == 202) {
      memory.setData('userInfo', {})
    }
    return data
  },
  // 请求头  中央处理
  resolveRequestHeader: (header) => {
    /*
        这里写请求头过滤代码
     */
    let rewriteHeader = {
      'content-type': 'application/x-www-form-urlencoded'
    }
    return Object.assign({}, header, rewriteHeader)
  }
}

module.exports = inferface