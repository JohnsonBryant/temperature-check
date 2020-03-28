<template>
  <el-row :gutter="6">
    <el-col :span="16" class="origin-data">
      <el-button-group class="tab-btns">
        <el-button @click="dataShowIndex = 1" :type="dataShowIndex === 1 ? 'primary': ''" icon="el-icon-s-data">数据走势</el-button>
        <el-button @click="dataShowIndex = 2" :type="dataShowIndex === 2 ? 'primary': ''" icon="el-icon-s-grid">数据表格</el-button>
      </el-button-group>
      <template v-if="DeviceTestData.equipment.detectProperty === '温湿度'">
        <test-item-th 
          v-show="dataShowIndex === 1"
          :equipment="DeviceTestData.equipment"
          :test-data="DeviceTestData.testData"
          :temps="DeviceTestData.temps"
          :humis="DeviceTestData.humis"
        />
      </template>
      <template v-else-if="DeviceTestData.equipment.detectProperty === '温度'">
        <test-item-temp
          v-show="dataShowIndex === 1"
          :equipment="DeviceTestData.equipment"
          :test-data="DeviceTestData.testData"
          :temps="DeviceTestData.temps"
        />
      </template>
      <template v-if="DeviceTestData.equipment.detectProperty === '温湿度'">
        <test-item-table-th v-show="dataShowIndex === 2"
          :equipment="deviceTestDataTable.equipment"
          :tempTestDataTable="deviceTestDataTable.tempTestDataTable"
          :humiTestDataTable="deviceTestDataTable.humiTestDataTable"
          :ids="deviceTestDataTable.ids"
          />
      </template>
      <template v-else-if="DeviceTestData.equipment.detectProperty === '温度'">
        <test-item-table-temp v-show="dataShowIndex === 2"
          :equipment="deviceTestDataTable.equipment"
          :tempTestDataTable="deviceTestDataTable.tempTestDataTable"
          :ids="deviceTestDataTable.ids"
          />
      </template>
    </el-col>
    <el-col :span="8">
      <test-data
        :detectProperty="DeviceTestData.equipment.detectProperty"
        :testData="deviceTestDataTable.testData"
        :updateTime="DeviceTestData.updateTime"
        :packNumber="DeviceTestData.packNumber"
        :ids="deviceTestDataTable.ids"
        :data="DeviceTestData.data"
        />
    </el-col>
  </el-row>  
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
  },
  methods: {
  }
}
</script>
