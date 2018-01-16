// 基础工具
// 提供数组，对象，日期判断
// 提供对象属性长度判断
let baseTool = {
  isArray: (arg) => {
    return arg.constructor === Array
  },
  isObject: (arg) => {
    return arg.constructor === Object
  },
  isKeyEmptyObject: (arg) => {
    if (!baseTool.isObject(arg)) {
      throw new Error('参数有误，请传Object类型值')
    }
    return Object.keys(arg).length == 0
  },
  isDate: (arg) => {
    return arg.constructor === Date
  },
  copy: (object) => {
    if (!baseTool.isObject(object) && !baseTool.isArray(object)) {
      return object
    }
    return JSON.parse(JSON.stringify(object))
  },
  merge: (...args) => {
    return baseTool.copy(Object.assign.apply({}, args))
  },
  getItem: (key, value, array) => {
    if (!baseTool.isArray(array)) {
      throw new Error('参数有误，请传Array类型值')
    }
    for (let i = 0; i < array.length; i++) {
      let item = array[i]
      if (item[key] == value) {
        return baseTool.copy(item)
        break;
      }
    }
    return ''
  }
}

module.exports = baseTool