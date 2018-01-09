//index.js
//获取应用实例
var indexCtrl = require('../../controllers/indexController.js')
const memory = require('../../memory/memory.js')

Page({
  data: {
    netStatus: '',
    netWorkType: ''
  },
  onLoad: function () {
    let self = this
    this.getDataFromBack()
  },
  linkToShop: function(e) {
    wx.navigateTo({
      url: '/pages/shop/shop',
    })
  },
  // 数据测试
  getDataFromBack: function() {
    var data = {
      name: 'jnxyx'
    }
    indexCtrl.getIndexUser(data).then((results) => {
      console.log(results)
    })
    memory.setData('totalNum', 11)
  }
})
