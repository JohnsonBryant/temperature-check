<template>
  <div class="dash-test-item dash-test-item-t">
    <el-table :data="tempTestDataTable" :stripe="true" border resizable height="100%">
      <el-table-column prop="count" label="次数" align="center" fixed></el-table-column>
      <el-table-column label="实 测 温 度 值" align="center">
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
  props: ['equipment', 'tempTestDataTable', 'ids', 'dataTableHeader'],
  computed: {
  },
  methods: {
  }
}
</script>
