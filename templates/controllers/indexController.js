/* --- 数据控制层 --- 
 * 该层接收来自page的请求数据
 * 经过前置数据基本的逻辑验证、判断后
 * 请求接口层数据，数据返回成功后，作
 * 进一步的逻辑处理，将原始数据处理成
 * 前台页面所需的数据格式
 * 
 * 注：
 * 1、该层方法名对应接口层方法名
 * 2、该层方法名可不与前台页面一一对应
 * 
 * 依赖接口层模块
 */
let models = require('../models/models.js')
let tools = require('../tools/tools.js')
let indexITF = require('../interfaces/indexITF.js')

let indexController = {
  getIndexData: (data) => {
    return indexITF.getIndexData(data).then((results)=>{
      // 处理 results 数据，整理格式后输出
      if (results.code != 200) {
        results.data = {}
      }
      return Promise.resolve(results)
    }, models.failHandle)
  },
  getIndexUser: (data) => {
    return indexITF.getIndexUser(data).then((results) => {
      if (tools.isObject(results)) {
        results = Object.assign({}, results)
      }
      // 处理 results 数据，整理格式后输出
      if (results && results.code != 200 && tools.isObject(results)) {
        results.data = {
          name: 'admin'
        }
      }
      return Promise.resolve(results)
    }, models.failHandle)
  }
}

module.exports = indexController