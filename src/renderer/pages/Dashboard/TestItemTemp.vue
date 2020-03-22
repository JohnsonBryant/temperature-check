<template>
  <div class="dash-test-item">
    <h4 v-html="equipmentTitle"></h4>
    <el-row :gutter="6">
      <el-col :span="17">
        <el-row>
          <el-col>
            <el-card class="test-item-chart" shadow="always">
              <v-chart :autoresize="true" style="width:90%;height:460px;" :options="temps"/>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="7">
        <el-card class="test-item-data" shadow="always">
          <h4>数据更新时间：{{updateTime}}</h4>
          <h4>总包数：{{packNumber}}</h4>
          <div class="test-item-testdata">
            <el-table
              :data="testData"
              :stripe="true"
              border resizable
              style="width: 100%"
              >
              <el-table-column
                prop="name"
                label="计算值/ID"
                min-width="120"
                >
              </el-table-column>
              <el-table-column
                prop="tempData"
                label="温度℃"
                min-width="90"
                >
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'TestItem',
  components: {
  },
  props: ['equipment', 'updateTime', 'packNumber', 'testData', 'temps'],
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
  }
}
</script>

<style>

</style>