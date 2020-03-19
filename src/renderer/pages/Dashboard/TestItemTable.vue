<template>
  <div class="dash-test-item">
    <h4 v-html="equipmentTitle"></h4>
    <el-tabs type="border-card" class="test-item-data">
      <el-tab-pane label="湿度数据">
        <el-table
          :data="humiTestDataTable"
          :stripe="true"
          border resizable
          style="width: 100%"
          >
          <div v-for="(item, key) in humiDataTableHeader(humiTestDataTable[0])" :key="key">
            <el-table-column
              :prop="item['prop']"
              :label="item['key']"
              >
            </el-table-column>
          </div>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="温度数据">
        <el-table
          :data="tempTestDataTable"
          :stripe="true"
          border resizable
          style="width: 100%"
          >
          <div v-for="(item, key) in tempDataTableHeader(tempTestDataTable[0])" :key="key">
            <el-table-column
              :prop="item['prop']"
              :label="item['key']"
              >
            </el-table-column>
          </div>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'TestItemTable',
  components: {
  },
  props: ['equipment', 'humiTestDataTable', 'tempTestDataTable'],
  computed: {
    equipmentTitle () {
      return `
        <span>${this.equipment.company}</span>
        <span style="margin:0 10px;">__</span>
        <span>${this.equipment.em}</span>
        <span style="margin:0 10px;">__</span>
        <span>${this.equipment.deviceName}</span>
        <span style="margin:0 10px;">__</span>
        <span>${this.equipment.deviceType}</span>
        <span style="margin:0 10px;">__</span>
        <span>${this.equipment.deviceID}</span>
      `
    }
  },
  methods: {
    tempDataTableHeader (tempTestDataTable) {
      let dataTableHeader = []
      let header = ['序号', '温度均匀度', '温度波动度', '温度偏差', '温度中心点']
      let headerKey = ['count', 'evennessTemp', 'fluctuationTemp', 'deviationTemp', 'centerID']

      for (let i = 0; i < header.length; i++) {
        let item = {'key': header[i], 'prop': headerKey[i]}
        dataTableHeader.push(item)
      }

      let keys = tempTestDataTable ? Object.keys(tempTestDataTable) : []
      let ids = []
      for (let i = 0; i < keys.length; i++) {
        if (!headerKey.includes(keys[i])) {
          ids.push(keys[i])
        }
      }
      ids.sort()
      for (let i = 0; i < ids.length; i++) {
        let item = {'key': `${ids[i]}`, 'prop': ids[i]}
        dataTableHeader.push(item)
      }

      return dataTableHeader
    },
    humiDataTableHeader (humiTestDataTable) {
      let dataTableHeader = []
      let header = ['序号', '湿度均匀度', '湿度波动度', '湿度偏差', '湿度中心点']
      let headerKey = ['count', 'evennessHumi', 'fluctuationHumi', 'deviationHumi', 'centerID']

      for (let i = 0; i < header.length; i++) {
        let item = {'key': header[i], 'prop': headerKey[i]}
        dataTableHeader.push(item)
      }

      let keys = humiTestDataTable ? Object.keys(humiTestDataTable) : []
      let ids = []
      for (let i = 0; i < keys.length; i++) {
        if (!headerKey.includes(keys[i])) {
          ids.push(keys[i])
        }
      }
      ids.sort()
      for (let i = 0; i < ids.length; i++) {
        let item = {'key': `${ids[i]}`, 'prop': ids[i]}
        dataTableHeader.push(item)
      }

      return dataTableHeader
    }
  }
}
</script>

<style>

</style>