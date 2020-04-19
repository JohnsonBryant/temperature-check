<template>
  <el-aside width="335px" class="testData">
    <h4 v-html="equipmentTitle"></h4>
    <h4><span class="left">时间：{{updateTime}}</span><span class="right">包数：{{packNumber}}</span></h4>
    <el-table v-if="detectProperty === '温湿度'" :data="testData" :stripe="true" border resizable>
      <el-table-column prop="param" label="校准参数" min-width="110" ></el-table-column>
      <el-table-column prop="temp" label="温度 / ℃" min-width="110" ></el-table-column>
      <el-table-column prop="humi" label="湿度度 / RH%" min-width="110" ></el-table-column>
    </el-table>
    <el-table v-else-if="detectProperty === '温度'" :data="testData" :stripe="true" border resizable>
      <el-table-column prop="param" label="校准参数" min-width="110" ></el-table-column>
      <el-table-column prop="temp" label="温度 / ℃" min-width="110" ></el-table-column>
    </el-table>
    <div class="sensors">
      <div class="sensor" v-for="(id,index) in ids" :key="index">
        <div class="sensor-content" :class="{'low-battery': data[id].batt[data[id].batt.length-1] <= lowBattery}">ID:{{id}} 电量:{{data[id].batt.length === 0 ? '' : data[id].batt[data[id].batt.length-1]}}%</div>
      </div>
    </div>
  </el-aside>
</template>

<script>
export default {
  name: 'TestDataTH',
  data () {
    return {
      lowBattery: 20
    }
  },
  components: {
  },
  props: ['equipmentTitle', 'detectProperty', 'testData', 'updateTime', 'packNumber', 'ids', 'data'],
  computed: {
  },
  methods: {
  }
}
</script>
