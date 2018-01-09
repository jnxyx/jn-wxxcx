// app 配置信息
let hostConfig = {
  environment: 'dev', // 'dev', 'gray', 'online'
  // '开发接口主域'
  devHost: {
    mainHost: 'https://dev.qq.com'
  },
  // '灰度接口主域'
  grayHost: {
    mainHost: 'https://gray.qq.com'
  },
  // '线上接口主域'
  onlineHost: {
    mainHost: 'https://online.qq.com'
  }
}

let appType = 'miniApp'

const host = hostConfig[hostConfig.environment + 'Host']

module.exports = {
  name: '小程序名称',
  // 小程序版本
  appVersion: '1.0.1',
  // 项目版本
  version: '2.4.3',
  platform: 'wxapp',
  device: 'weixin',
  environment: hostConfig.environment, // 'online'
  host: host,
  appType: appType
}