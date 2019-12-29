<template>
    <el-card class="dash-test-item" shadow="always">
    <h4 v-html="equipmentTitle"></h4>
    <el-row :gutter="6">
      <el-col :span="18">
        <el-row :gutter="8">
          <el-col :span="12">
            <el-card class="test-item-chart" shadow="always">
              <v-chart :autoresize="true" style="width:90%;height:460px;" :options="temps"/>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="test-item-chart" shadow="always">
              <v-chart :autoresize="true" style="width:90%;height:460px;" :options="humis"/>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <el-card class="test-item-data" shadow="always">
          <h4>数据更新时间：{{updateTime}}, 总包数：{{packNumber}}</h4>
          <div class="test-item-testdata">
            <el-table
              :data="testData"
              style="width: 100%"
              :stripe="true"
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
              <el-table-column
                prop="humiData"
                label="湿度%RH"
                min-width="90"
                >
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
// import 'echarts/lib/chart/line'

export default {
  name: 'TestItem',
  components: {
  },
  props: ['equipment', 'updateTime', 'packNumber', 'testData', 'temps', 'humis'],
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

<style scoped>

.dash-test-item{
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 5px;
  padding-right: 5px;
}

.dash-test-item .el-card__body > h4{
  text-align: center;
  padding-bottom: 10px;
  padding-top: 10px;
  color: #707377;
}

.test-item-data .el-card__body > h4{
  text-align: left;
  padding-left: 10px;
  font-size: 14px;
}

.dash-test-item .test-item-chart{
  height: 480px;
  padding-top: 5px;
  padding-left: 5px;
}

.dash-test-item .test-item-data{
  height: 480px;
  overflow: auto;
}

.dash-test-item .test-item-col{
  text-align: center;
}

</style>