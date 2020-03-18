'use strict'
/**
 * 定义系统中通信的过程的二进制数据包解析的原型类，使用binary-paser作为基类
 *
 */
const Parser = require('binary-parser').Parser

export const DataPackParser = new Parser()
  .endianess('big')
  .uint16('magic', { assert: 0xAA55 })
  .uint8('command')
  .uint8('packetLength')
  .uint8('deviceType')
  .uint8('deviceID')
  .floatle('temp')
  .floatle('humi')
  .uint16('batt')
  .uint8('status')
  .uint16('count')
  .uint16('cycle')
  .uint8('reserv')
  .uint16('checksum')

export const DirectivePackParser = new Parser()
  .endianess('big')
  .uint16('magic', { assert: 0xAA55 })
  .uint8('command')
  .uint8('packetLength')
  .uint8('deviceType')
  .uint8('deviceID')
  .array('reserv', {
    type: 'uint8',
    length: 4
  })
  .uint16('checksum')

export const minlen = 6

export default {
  DataPackParser,
  DirectivePackParser,
  minlen
}
