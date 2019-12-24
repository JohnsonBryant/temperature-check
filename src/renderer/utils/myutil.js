'use strict'
// const jsonfile = require('jsonfile')
// const path = require('path')
// const fs = require('fs')
const moment = require('moment')

function nowtime () {
  return moment().format('YYYY-MM-DD HH:mm:ss')
}

function nowDate () {
  return moment().format('YYYY-MM-DD')
}

/**
 * 检查参数是否为整数值
 * @param obj 任意类型值
 * @return bool， 表示参数 obj 是否为整数
 */
function isInteger (obj) {
  return typeof obj === 'number' && obj % 1 === 0
}

/**
 * 检查参数是否为整数值
 * @param obj 任意类型值
 * @return bool， 表示参数 obj 是否为整数
 */
function isPositiveInteger (obj) {
  return typeof obj === 'number' && obj % 1 === 0 && obj > 0
}

/**
 * 检查参数是否为正数
 * @param obj 应传入数值型, 传入非数值参数一定返回false
 * @return bool， 表示参数 obj 是否为正数
 */
function isPositiveNumber (obj) {
  return typeof obj === 'number' && !isNaN(obj) && obj >= 0
}

/**
 * 检查参数是否为有效数值
 * @param obj 应传入数值型, 传入非数值参数一定返回false
 * @return bool， 表示参数 obj 是否为有效数值
 */
function isValidNumber (obj) {
  return typeof obj === 'number' && !isNaN(obj)
}

/**
 * @param {*} data 数值数组
 * @return 数组长度为0时，返回 NaN
 */
function Average (data) {
  if (!(data instanceof Array)) {
    throw new Error('invalid input, param can only be array...')
  }
  let len = data.length
  if (len === 0) {
    return NaN
  }
  let sum = 0
  for (let i = 0; i < len; i++) {
    sum += 1 * data[i]
  }
  return sum / len
}

/**
 * @param {*} data 数值数组
 * @return 数组长度为0时，返回 NaN
 */
function Max (data) {
  let arr = Array.prototype.slice.call(data)
  let len = arr.length
  if (len === 0) {
    return NaN
  }
  if (len === 1) {
    return arr[0]
  }
  return Math.max.apply(null, arr)
}

/**
 * @param {*} data 数值数组
 * @return 数组长度为0时，返回 NaN
 */
function Min (data) {
  let arr = Array.prototype.slice.call(data)
  let len = arr.length
  if (len === 0) {
    return NaN
  }
  if (len === 1) {
    return arr[0]
  }
  return Math.min.apply(null, arr)
}

export default {
  nowtime,
  nowDate,
  isInteger,
  isValidNumber,
  isPositiveNumber,
  isPositiveInteger,
  Average,
  Min,
  Max
}
