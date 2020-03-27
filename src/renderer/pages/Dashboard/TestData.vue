<template>
  <div class="testData">
    <el-card 
      v-if="detectProperty === '温湿度'"
      class="test-item-chart" shadow="always">
      <el-table
        :data="testData"
        :stripe="true"
        border resizable>
        <el-table-column
          prop="param"
          label="校准参数"
          min-width="110"
          >
        </el-table-column>
        <el-table-column
          prop="temp"
          label="温度 / ℃"
          min-width="110"
          >
        </el-table-column>
        <el-table-column
          prop="temp"
          label="湿度度 / RH%"
          min-width="110"
          >
        </el-table-column>
      </el-table>
    </el-card>
    <el-card 
      v-else-if="detectProperty === '温度'"
      class="test-item-chart" shadow="always">
      <el-table
        :data="testData"
        :stripe="true"
        border resizable>
        <el-table-column
          prop="param"
          label="校准参数"
          min-width="110"
          >
        </el-table-column>
        <el-table-column
          prop="temp"
          label="温度 / ℃"
          min-width="110"
          >
        </el-table-column>
      </el-table>
    </el-card>    
  </div>
</template>

<script>
export default {
  name: 'TestDataTH',
  components: {
  },
  props: ['detectProperty', 'testData'],
  computed: {
  },
  methods: {
  }
}
</script>
