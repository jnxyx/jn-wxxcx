/* 工具对象
 * 为业务提供支持
 * 
 */
let baseTool = require('./base-tool.js')
let dateTool = require('./date-tool.js')

let tools = Object.assign({}, baseTool, dateTool)

module.exports = tools