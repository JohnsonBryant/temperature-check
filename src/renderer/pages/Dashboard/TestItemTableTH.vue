<template>
  <div class="dash-test-item">
    <div class="head">
      <h4 v-html="equipmentTitle"></h4>
      <el-button-group>
        <el-button @click="tableShowIndex = 1" :type="tableShowIndex === 1 ? 'primary': ''" icon="el-icon-s-grid">温度数据</el-button>
        <el-button @click="tableShowIndex = 2" :type="tableShowIndex === 2 ? 'primary': ''" icon="el-icon-s-grid">湿度数据</el-button>
      </el-button-group>
    </div>
    <el-table
      v-show="tableShowIndex === 1"
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
    <el-table
      v-show="tableShowIndex === 2"
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
  </div>
</template>

<script>
export default {
  name: 'TestItemTable',
  components: {
  },
  data () {
    return {
      tableShowIndex: 1
    }
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
      dataTableHeader.push({'key': '次数', 'prop': 'count'})
      ids.sort()
      for (let i = 0; i < ids.length; i++) {
        let item = {'key': `${ids[i]}`, 'prop': `${ids[i]}`}
        dataTableHeader.push(item)
      }
      dataTableHeader.push({'key': '单次均匀度', 'prop': 'averageTemp'})
      return dataTableHeader
    },
    humiDataTableHeader (ids) {
      let dataTableHeader = []
      dataTableHeader.push({'key': '次数', 'prop': 'count'})
      ids.sort()
      for (let i = 0; i < ids.length; i++) {
        let item = {'key': `${ids[i]}`, 'prop': `${ids[i]}`}
        dataTableHeader.push(item)
      }
      dataTableHeader.push({'key': '单次均匀度', 'prop': 'averageHumi'})
      return dataTableHeader
    }
  }
}
</script>
