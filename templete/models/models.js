/* --- 数据模型层 ---
 * 该层并非对应页面的视图模型
 * 而是为特定业务，
 * 提供统一的数据格式
 * 
 * 包括：
 * 1、接口返回的数据；
 * 2、逻辑验证不合格的数据回调；
 * 3、一些公用的枚举；
 * .
 * .
 * .
 * 等等
 * 
 * 注明：该层仅提供支持，不依赖任何模块（建议提供对控制层的支持）
 */

let enumModel = require('./enum-model.js')
let returnModel = require('./return-model.js')

let models = Object.assign({}, enumModel, returnModel)
module.exports = models