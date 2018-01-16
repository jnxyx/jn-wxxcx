// 日期工具
// 提供日期格式化操作
// 提供过期验证
let baseTool = require('./base-tool.js')

let dateTool = {
  // 格式化日期
  formatTime: (date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    let formatNumber = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  },
  // 过期验证
  isExpire: (timeStamp, startDate, endDate) => {
    if (!endDate) {
      endDate = new Date()
    }
    if (baseTool.isDate(startDate) && baseTool.isDate(endDate)) {
      return endDate - startDate < +timeStamp
    } else {
      throw new Error('参数有误，请传Date类型值')
    }
  }
}

module.exports = dateTool