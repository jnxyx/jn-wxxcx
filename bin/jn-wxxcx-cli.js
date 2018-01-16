#!/usr/bin/env node

var ejs = require('ejs')
var fs = require('fs')
var mkdirp = require('mkdirp')
var path = require('path')
var program = require('commander')
var readline = require('readline')
var sortedObject = require('sorted-object')
var util = require('util')

var MODE_0666 = parseInt('0666', 8)
var MODE_0755 = parseInt('0755', 8)

/**
 * Mkdir -p.
 *
 * @param {String} path 文件夹路径
 * @param {Function} fn  回调函数
 */

function mkdir (path, fn) {
  mkdirp(path, MODE_0755, function (err) {
    if (err) throw err
    console.log('   \x1b[36mcreate\x1b[0m : ' + path)
    fn && fn()
  })
}
