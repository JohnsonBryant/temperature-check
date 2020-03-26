<template>
  <div class="dash-test-item">
    <h4 v-html="equipmentTitle"></h4>
    <el-row :gutter="6">
      <el-col :span="16">
        <el-tabs type="border-card" class="test-item-data">
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
      </el-col>
      <el-col :span="8">
        <el-card class="test-item-chart" shadow="always">
          <el-table
            :data="testData"
            :stripe="true"
            border resizable>
            <el-table-column
              prop="param"
              label="校准参数"
              min-width="130"
              >
            </el-table-column>
            <el-table-column
              prop="temp"
              label="温度 / ℃"
              min-width="130"
              >
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'TestItemTable',
  components: {
  },
  props: ['equipment', 'tempTestDataTable', 'testData', 'ids'],
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
      dataTableHeader.push({'key': '次数', 'prop': 'count'})
      ids.sort()
      for (let i = 0; i < ids.length; i++) {
        let item = {'key': `测点编号${ids[i]}`, 'prop': `${ids[i]}`}
        dataTableHeader.push(item)
      }
      dataTableHeader.push({'key': '单次均匀度', 'prop': 'averageTemp'})
      return dataTableHeader
    }
  }
}
</script>

<style>

</style>