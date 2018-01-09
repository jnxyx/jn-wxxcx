// 回调返回值模型
let returnModel = {
  getFailData: () => {
    let failData = {
      data: {},
      code: 400,
      msg: '请求失败'
    }
    return Object.assign({}, failData)
  },
  getValiData: (msg) => {
    let valiData = {
      data: {},
      code: 0,
      msg: msg || '数据不合法'
    }
    return Object.assign({}, valiData)
  },
  failHandle: (fails) => {
    return Promise.resolve(fails || returnModel.getFailData())
  }
}

module.exports = returnModel