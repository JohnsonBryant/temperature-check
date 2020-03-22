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
          <el-table-column
            v-for="(item, key) in humiDataTableHeader(ids)" :key="key"
            :prop="item['prop']"
            :label="item['key']"
            >
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="温度数据">
        <el-table
          :data="tempTestDataTable"
          :stripe="true"
          border resizable
          style="width: 100%"
          >
          <el-table-column
            v-for="(item, key) in tempDataTableHeader(ids)" :key="key"
            :prop="item['prop']"
            :label="item['key']"
            >
          </el-table-column>
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
  props: ['equipment', 'humiTestDataTable', 'tempTestDataTable', 'ids'],
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
    tempDataTableHeader (ids) {
      let dataTableHeader = []
      let header = ['次数', '仪器示值', '中心点(0)0']
      let headerKey = ['count', 'basevalue', 'centerID']
      for (let i = 0; i < header.length; i++) {
        let item = {'key': header[i], 'prop': headerKey[i]}
        dataTableHeader.push(item)
      }
      ids.sort()
      for (let i = 0; i < ids.length; i++) {
        let item = {'key': `测点编号${ids[i]}`, 'prop': `${ids[i]}`}
        dataTableHeader.push(item)
      }

      dataTableHeader.push(...[
        {'key': '最大值', 'prop': 'max'},
        {'key': '最小值', 'prop': 'min'},
        {'key': '差值', 'prop': 'deviation'}
      ])

      return dataTableHeader
    },
    humiDataTableHeader (ids) {
      let dataTableHeader = []
      let header = ['次数', '仪器示值', '中心点(0)0']
      let headerKey = ['count', 'basevalue', 'centerID']
      for (let i = 0; i < header.length; i++) {
        let item = {'key': header[i], 'prop': headerKey[i]}
        dataTableHeader.push(item)
      }

      ids.sort()
      for (let i = 0; i < ids.length; i++) {
        let item = {'key': `测点编号${ids[i]}`, 'prop': `${ids[i]}`}
        dataTableHeader.push(item)
      }

      dataTableHeader.push(...[
        {'key': '最大值', 'prop': 'max'},
        {'key': '最小值', 'prop': 'min'},
        {'key': '差值', 'prop': 'deviation'}
      ])
      return dataTableHeader
    }
  }
}
</script>

<style>

</style>