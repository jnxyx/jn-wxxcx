/*  --- 接口层 ---
 *  封装模块数据交互操作
 *  单个模块，基于模块本身
 *  可对应处理多个数据交互操作
 *  各操作提供单独的url
 * 
 *  例如：index模块
 *  提供有：
 *  获取 index 数据的 getIndexData 方法
 *  获取 user  数据的 getIndexUser 方法
 *  .
 *  .
 *  .
 *  等等
 * 
 *  依赖 interface.js
 */

let itf = require('./interface.js')
let host = require('../app-config.js').host.mainHost

let indexITF = {
  getIndexData: (data) => {
    let url = `${host}/index`
    return itf.post(url, data)
  },
  getIndexUser: (data) => {
    let url = `${host}/indexUser`
    return itf.post(url, data)
  }
}

module.exports = indexITF