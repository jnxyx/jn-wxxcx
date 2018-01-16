/* 数据记忆
 * 
 * 
 */
const tools = require('../tools/tools.js')

var memory = {
  data: {},
  init: ()=>{
    memory.data = getApp() ? getApp().globalData : memory.data
  },
  getData: (key) => {
    memory.init()
    if('string' !== typeof key){
      throw new Error('参数有误，请传String类型值')
    }
    if (memory.data.hasOwnProperty(key)) {
      return tools.copy(memory.data[key])
    }
  },
  setData: (key, value) => {
    memory.init()
    if ('string' !== typeof key) {
      throw new Error('参数有误，键名请传String类型值')
    }
    memory.data[key] = tools.copy(value)
    return value
  },
  removeData: (key) => {
    memory.init()
    if ('string' !== typeof key) {
      throw new Error('参数有误，键名请传String类型值')
    }
    if (memory.data.hasOwnProperty(key)) {
      delete memory.data[key]
    }
  },
  // 检查用户身份
  checkUtoken: () => {
    let utoken = memory.getData('userInfo').utoken
    if (!utoken) {
      wx.showModal({
        title: '提示',
        content: '身份认证失败，请重新登录',
        success: function () {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      })
      return false
    }
    return true
  }
}

module.exports = memory