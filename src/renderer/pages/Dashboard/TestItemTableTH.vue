<template>
  <div class="dash-test-item">
    <el-button-group class="head">
      <el-button @click="tableShowIndex = 1" :type="type1" icon="el-icon-s-grid">温度数据</el-button>
      <el-button @click="tableShowIndex = 2" :type="type2" icon="el-icon-s-grid">湿度数据</el-button>
    </el-button-group>
    <el-table v-show="tableShowIndex === 1" :data="tempTestDataTable" :stripe="true" border resizable >
      <el-table-column prop="count" label="次数" align="center" fixed></el-table-column>
      <el-table-column label="实测温度值" align="center">
        <el-table-column v-for="(item, key) in dataTableHeader" :key="key" :prop="item['prop']" :label="item['key']" align="center"></el-table-column>
      </el-table-column>
      <el-table-column label="单次" align="center">
        <el-table-column prop="average" label="均匀度" align="center"></el-table-column>
      </el-table-column>
    </el-table>
    <el-table v-show="tableShowIndex === 2" :data="humiTestDataTable" :stripe="true" border resizable >
      <el-table-column prop="count" label="次数" align="center" fixed></el-table-column>
      <el-table-column label="实测湿度值" align="center">
        <el-table-column v-for="(item, key) in dataTableHeader" :key="key" :prop="item['prop']" :label="item['key']" align="center"></el-table-column>
      </el-table-column>
      <el-table-column label="单次" align="center">
        <el-table-column prop="average" label="均匀度" align="center"></el-table-column>
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
  props: ['equipment', 'humiTestDataTable', 'tempTestDataTable', 'ids', 'dataTableHeader'],
  computed: {
    type1 () {
      return this.tableShowIndex === 1 ? 'info' : 'default'
    },
    type2 () {
      return this.tableShowIndex === 2 ? 'info' : 'default'
    }
  },
  methods: {
  }
}
</script>
