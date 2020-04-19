<template>
  <el-container class="container">
    <el-main class="origin-data">
      <!-- <div class="tab-btns">
        <el-button-group>
          <el-button @click="dataShowIndex = 1" :type="dataShowIndex === 1 ? 'info': ''" icon="el-icon-s-data">数据走势</el-button>
          <el-button @click="dataShowIndex = 2" :type="dataShowIndex === 2 ? 'info': ''" icon="el-icon-s-grid">数据表格</el-button>
        </el-button-group>
        <h4 v-html="equipmentTitle"></h4>
      </div> -->
      <!-- <template v-if="DeviceTestData.equipment.detectProperty === '温湿度'">
        <test-item-th 
          v-show="dataShowIndex === 1"
          :equipment="DeviceTestData.equipment"
          :temp="DeviceTestData.temp"
          :humi="DeviceTestData.humi"
        />
      </template>
      <template v-else-if="DeviceTestData.equipment.detectProperty === '温度'">
        <test-item-temp
          v-show="dataShowIndex === 1"
          :equipment="DeviceTestData.equipment"
          :temp="DeviceTestData.temp"
        />
      </template> -->
      <template v-if="DeviceTestData.equipment.detectProperty === '温湿度'">
        <!-- <test-item-table-th v-show="dataShowIndex === 2" -->
        <test-item-table-th
          :equipment="deviceTestDataTable.equipment"
          :tempTestDataTable="deviceTestDataTable.tempTestDataTable"
          :humiTestDataTable="deviceTestDataTable.humiTestDataTable"
          :dataTableHeader="deviceTestDataTable.dataTableHeader"
          :ids="deviceTestDataTable.ids"
          />
      </template>
      <template v-else-if="DeviceTestData.equipment.detectProperty === '温度'">
        <!-- <test-item-table-temp v-show="dataShowIndex === 2" -->
        <test-item-table-temp
          :equipment="deviceTestDataTable.equipment"
          :tempTestDataTable="deviceTestDataTable.tempTestDataTable"
          :dataTableHeader="deviceTestDataTable.dataTableHeader"
          :ids="deviceTestDataTable.ids"
          />
      </template>
    </el-main>
    <test-data
      :equipmentTitle="equipmentTitle"
      :detectProperty="DeviceTestData.equipment.detectProperty"
      :ids="deviceTestDataTable.ids"
      :testData="deviceTestDataTable.testData"
      :updateTime="DeviceTestData.updateTime"
      :packNumber="DeviceTestData.packNumber"
      :data="DeviceTestData.data"
      />
  </el-container>
</template>

<script>
import TestItemTH from './TestItemTH'
import TestItemTemp from './TestItemTemp'
import TestItemTableTH from './TestItemTableTH'
import TestItemTableTemp from './TestItemTableTemp'
import TestData from './TestData'

export default {
  name: 'Container',
  components: {
    'test-item-th': TestItemTH,
    'test-item-temp': TestItemTemp,
    'test-item-table-th': TestItemTableTH,
    'test-item-table-temp': TestItemTableTemp,
    'test-data': TestData
  },
  data () {
    return {
      dataShowIndex: 1
    }
  },
  props: ['deviceTestDataTable', 'DeviceTestData'],
  computed: {
    equipmentTitle () {
      return `
        <span>${this.DeviceTestData.equipment.company}</span>
        <span style="margin:0 5px;">--</span>
        <span>${this.DeviceTestData.equipment.em}</span>
        <span style="margin:0 5px;">--</span>
        <span>${this.DeviceTestData.equipment.deviceName}</span>
        <span style="margin:0 5px;">--</span>
        <span>${this.DeviceTestData.equipment.deviceType}</span>
        <span style="margin:0 5px;">--</span>
        <span>${this.DeviceTestData.equipment.deviceID}</span>
      `
    }
  },
  methods: {
  }
}
</script>
