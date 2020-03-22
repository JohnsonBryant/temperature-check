import { remote } from 'electron'
import path from 'path'
import fs from 'fs'
const Database = require('better-sqlite3')

const DB = {}

DB.SqliteDB = function (file) {
  DB.db = new Database(file)

  DB.exist = fs.existsSync(file)
  if (!DB.exist) {
    console.log('Creating db file!')
    fs.openSync(file, 'w')
  }

  this.dbPath = file
  this.initTable = initDataTable.bind(this)
  this.initTable()
}

DB.printErrorInfo = function (err) {
  console.log('Error Message:' + err.message + ' ErrorNumber:')
}

DB.SqliteDB.prototype.createTable = function (sql) {
  const stmt = DB.db.prepare(sql)
  stmt.run()
}

/// tilesData format [[level, column, row, content], [level, column, row, content]]
DB.SqliteDB.prototype.insertData = function (sql, objects, callback) {
  let err
  try {
    var stmt = DB.db.prepare(sql)
    for (var i = 0; i < objects.length; ++i) {
      stmt.run(objects[i])
    }
  } catch (e) {
    err = e
  }

  callback(err)
}

DB.SqliteDB.prototype.queryData = function (sql, callback) {
  const stmt = DB.db.prepare(sql)
  const rows = stmt.all()

  if (callback) {
    callback(rows)
  }
}

DB.SqliteDB.prototype.queryDataWithParam = function (sql, param, callback) {
  const stmt = DB.db.prepare(sql)
  const rows = stmt.all(param)
  if (callback) {
    callback(rows)
  }
}

DB.SqliteDB.prototype.executeSql = function (sql, callback) {
  const stmt = DB.db.prepare(sql)
  stmt.run()
  callback(null)
}

DB.SqliteDB.prototype.close = function () {
  DB.db.close()
}

// 初始化数据库
function initDataTable () {
  // 创建测试设备表
  const createTableEm = `create table if not exists equipment(
    id INTEGER PRIMARY KEY, company TEXT NOT NULL, em TEXT NOT NULL, deviceName TEXT NOT NULL, deviceType TEXT NOT NULL, deviceID TEXT NOT NULL, insertDate TEXT NOT NULL, detectProperty TEXT NOT NULL,
    UNIQUE(company,em,deviceName,deviceType,deviceID)
  );`

  // 创建测试记录表
  const testRecords = `create table if not exists testRecords(
    id INTEGER PRIMARY KEY, company TEXT NOT NULL, em TEXT NOT NULL, deviceName TEXT NOT NULL, deviceType TEXT NOT NULL, deviceID TEXT NOT NULL, testDate TEXT NOT NULL, cycle INTEGER NOT NULL, temp REAL NOT NULL, humi REAL NOT NULL, centerID INTEGER NOT NULL, IDS TEXT
  );`

  // 创建传感器数据表，表关联： sensorData.test_id = testRecords.id
  const sensorData = `create table if not exists sensorData(
    id INTEGER PRIMARY KEY, sensorID INTERGER NOT NULL, temp REAL NOT NULL, humi REAL NOT NULL, stime TEXT NOT NULL, test_id INTEGER NOT NULL
  );`

  // 创建测试数据表（温度、湿度（均匀度、波动度、偏差）），表关联： testData.test_id = testRecords.id
  const testData = `create table if not exists testData(
    id INTEGER PRIMARY KEY NOT NULL, evennessTemp REAL NOT NULL, fluctuationTemp REAL NOT NULL, deviationTemp REAL NOT NULL,
    evennessHumi REAL NOT NULL, fluctuationHumi REAL NOT NULL, deviationHumi REAL NOT NULL, stime TEXT NOT NULL, test_id INTEGER NOT NULL
  );`

  this.createTable(createTableEm)
  this.createTable(testRecords)
  this.createTable(sensorData)
  this.createTable(testData)
}

const dbPath = path.join(remote.app.getPath('userData'), '/data.db')
const sqliteDB = new DB.SqliteDB(dbPath)

/// export SqliteDB.
export default sqliteDB
