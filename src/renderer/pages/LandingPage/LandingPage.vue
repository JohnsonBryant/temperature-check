<template>
  <div class="landing-page main-page">
    <div class="main-page-title top-bar">
      <div class="top-bar-item">仪器管理页</div>
      <div class="top-bar-item top-bar-controls">
        <!-- 新增测试仪器按钮 -->
        <div class="top-bar-control-item">
          <el-button @click="routerToAdd" size="medium">新增仪器</el-button>
        </div>
        <div class="top-bar-control-item">
          <el-badge :value="selectedEquipments.length">
            <el-button @click="drawerSelectEq = true" size="medium">已选择仪器</el-button>
          </el-badge>
        </div>
        <div class="top-bar-control-item">
          <!-- 搜索委托单位（测试仪器）搜索框 -->
          <el-input 
            @input="getEquipmentByCompany"
            v-model="searchText"
            placeholder="请输入委托单位"
            class="searchEqBox"
          ></el-input>
        </div>
      </div>
    </div>
    <div class="main-page-container" >
      <!-- 已添加测试仪器信息展示表格，表格分页，表格可根据委托单位进行自定义检索表内已有信息 -->
      <div>
        <el-table
          :data="equipments"
          border resizable stripe
          >
          <el-table-column
            prop="company"
            label="委托单位"
            min-width="160"
          ></el-table-column>
          <el-table-column
            prop="deviceName"
            label="仪器名称"
            min-width="150"
          ></el-table-column>
          <el-table-column
            prop="deviceType"
            label="仪器型号"
            min-width="90"
          ></el-table-column>
          <el-table-column
            prop="deviceID"
            label="仪器编号"
            min-width="90"
            sortable
          ></el-table-column>
          <el-table-column
            prop="em"
            label="仪器厂家"
            min-width="160"
          ></el-table-column>
          <el-table-column
            prop="detectProperty"
            label="测量类型"
            min-width="100"
          ></el-table-column>
          <el-table-column
            prop="insertDate"
            label="日期"
            min-width="130"
            column-key="date"
            sortable
          ></el-table-column>
          <el-table-column label="操作" min-width="200">
            <template slot-scope="scope">
              <el-button
                @click="handleAddToTest(scope.$index, scope.row)"
                :disabled="isOnTest"
                size="mini"
              >选择</el-button>
              <el-button
                @click="handleDuplicate(scope.$index, scope.row)"
                :disabled="isOnTest"
                size="mini"
              >复制</el-button>
              <el-button
                @click="handleDelete(scope.$index, scope.row)"
                :disabled="isOnTest"
                size="mini"
                type="danger"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div>
        <el-pagination
          class="pagination"
          background
          layout="prev, pager, next"
          :current-page.sync="page.currentPageNum"
          :page-size="page.size"
          :total="page.total"
          @current-change="equipmentsCurrentChange">
        </el-pagination>
      </div>
    </div>
    <!-- 已选择测试仪器展示区域 -->
    <el-drawer
      :visible.sync="drawerSelectEq"
      :direction="directionSelectEq"
      :modal="false"
      :show-close="false"
      :withHeader="false"
      size="50"
      >
      <div class="selectEp-container">
        <!-- <el-divider content-position="center">已选择仪器仪器</el-divider> -->
        <el-table
          border resizable
          :data="selectedEquipments"
          style="width: 100%; margin-top: 0px;">
          <el-table-column
            prop="company"
            label="委托单位"
            min-width="160"
          >
          </el-table-column>
          <el-table-column
            prop="deviceName"
            label="仪器名称"
            min-width="150">
          </el-table-column>
          <el-table-column
            prop="deviceType"
            label="仪器型号"
            min-width="90">
          </el-table-column>
          <el-table-column
            prop="deviceID"
            label="仪器编号"
            min-width="90">
          </el-table-column>
          <el-table-column
            prop="em"
            label="仪器厂家"
            min-width="160">
          </el-table-column>
          <el-table-column
            prop="detectProperty"
            label="测量类型"
            min-width="100"
          ></el-table-column>          
          <el-table-column
            prop="insertDate"
            label="日期"
            min-width="130"
          >
          </el-table-column>
          <el-table-column label="操作"
            min-width="200"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="deleteSelectedEquipment(scope.$index, scope.row)"
                :disabled="isOnTest">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="selectEp-footer">
        <el-button class="selectEp-footer-btn left" type="info" round
          @click="clearSelected"
          :disabled="isOnTest">清空选择</el-button>
        <el-button class="selectEp-footer-btn right" type="success" round
          @click="startTest"
          :disabled="isOnTest">进入测试</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {debounce} from '../../utils/myutil.js'

export default {
  name: 'landing-page',
  data () {
    return {
      drawerSelectEq: false, // 控制已选中测试仪器的下拉抽屉的显示
      directionSelectEq: 'ttb',
      searchText: '', // 测试仪器检索搜索框输入内容
      page: {
        total: 0,
        currentPageNum: 1,
        size: 7
      },
      equipments: [] // 后端获取的测试仪器数据， 用于用户操作， 选择、复制、删除
    }
  },
  beforeMount () {
    this.getEquipments()
  },
  computed: {
    ...mapState(['isOnTest', 'selectedEquipments'])
  },
  methods: {
    ...mapActions([
      'setDuplicatedEquipmentTask',
      'addToSelectedEquipmentsTask',
      'dropFromSelectedEquipmentsTask',
      'clearAllSelectedEquipmentsTask'
    ]),
    getEquipments () {
      // 获取最近添加的测试仪器信息
      let that = this
      new Promise(function (resolve, reject) {
        let sql
        if (that.searchText === '') {
          sql = `select count(*) as total from equipment`
        } else {
          sql = `select count(*) as total from equipment where company like "%${that.searchText}%"`
        }
        that.$sqliteDB.queryData(sql, (rows) => {
          resolve(rows)
        })
      })
        .then(function (rows) {
          that.page.total = rows[0].total
          let sql = ''
          if (that.searchText === '') {
            sql = `select id, company, em, deviceName, deviceType, deviceID, detectProperty, insertDate from equipment order by insertDate desc limit ${that.page.size} offset ${that.page.size * (that.page.currentPageNum - 1)};`
          } else {
            sql = `select id, company, em, deviceName, deviceType, deviceID, detectProperty, insertDate from equipment where company like "%${that.searchText}%" order by insertDate desc limit ${that.page.size} offset ${that.page.size * (that.page.currentPageNum - 1)};`
          }
          that.$sqliteDB.queryData(sql, (rows) => {
            that.equipments.splice(0, that.equipments.length, ...rows)
          })
        })
    },
    getEquipmentByCompany: debounce(function (company) {
      this.page.currentPageNum = 1
      this.getEquipments()
    }, 500),
    equipmentsCurrentChange (current) {
      this.getEquipments()
    },
    handleDelete (index, row) { // 从数据库中删除测试仪器
      this.$confirm(`<strong>此操作将永久删除该测试仪器,是否继续?</strong>`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        let equipmentId = row.id
        let sql = `delete from equipment where id=${equipmentId}`
        this.$sqliteDB.executeSql(sql, (err) => {
          let message = '删除成功！'
          let messageType = 'success'
          if (err !== null) {
            message = `删除失败！`
            message = 'warning'
          }
          this.addMessage(message, messageType)
          this.equipments.splice(index, 1) // 从 data.equipments 中删除对应的仪器
        })
      }).catch(() => {
        this.addMessage('已取消删除')
      })
    },
    handleDuplicate (index, row) { // 以当前仪器信息为模板，新增仪器
      this.addMessage(`使用 "${row.company}-${row.em}-${row.deviceName}-${row.deviceType}-${row.deviceID}" 为模板，新增设备！请修改当前信息后，提交！`)
      this.setDuplicatedEquipmentTask(row)
      this.$router.push({path: '/addEquipment'})
    },
    handleAddToTest (index, row) { // 添加到选择测试仪器
      this.addToSelectedEquipmentsTask(row)
    },
    deleteSelectedEquipment (index, row) { // 从当前选择测试仪器中删除某个仪器
      this.dropFromSelectedEquipmentsTask(row)
    },
    clearSelected () {
      if (this.selectedEquipments.length === 0) { // 检查已选择测试设备是否为0
        return
      }
      this.$confirm(`<strong>是否清空已选择仪器?</strong>`, '提示', { // 清空已选择测试仪器
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      }).then(() => {
        this.clearAllSelectedEquipmentsTask()
        this.addMessage('已成功清空已选择仪器!', 'success')
      }).catch(() => {
        this.addMessage('已取消操作！')
      })
    },
    startTest () {
      if (this.selectedEquipments.length === 0) { // 检查已选择测试设备是否为0
        this.addMessage('当前未选择测试仪器，请选择测试仪器后再尝试进入测试！', 'warning')
        return
      }
      this.addMessage('进入测试管理页，请配置测试信息，开始测试！')
      this.$router.push({path: '/testConfig'}) // 路由到测试管理页，将已选择设备信息转移到设备管理页
    },
    routerToAdd () {
      this.$router.push({path: '/addEquipment'})
    },
    addMessage (message, messageType) {
      this.$message({
        message: message,
        type: messageType === undefined ? messageType : 'info'
      })
    }
  }
}
</script>

<style>
.landing-page{
}

.landing-page .main-page-container{
  padding-left: 0;
  padding-right: 0;
  display: flex;
  flex-direction: column;
}

.landing-page .main-page-container > div:first-child{
  flex-grow: 1;
}

.landing-page .main-page-container > div:last-child{
  min-height: 8rem;
}

.landing-page .searchEqBox{
  width: 45rem;
}

.selectEp-footer{
  padding: 0.5rem 0;
  text-align: center;
}

.selectEp-footer-btn.left{
  margin-right: 2rem;
}

.selectEp-footer-btn.right{
  margin-left: 2rem;
}

.selectEp-container{
  height: 40rem;
  overflow-y: auto;
}

.landing-page .pagination{
  text-align: center;
  margin-top: 0.5rem;
}
</style>