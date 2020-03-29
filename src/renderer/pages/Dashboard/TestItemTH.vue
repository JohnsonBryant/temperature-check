<template>
  <div class="dash-test-item">
    <div class="head">
      <h4 v-html="equipmentTitle"></h4>
    </div>
    <el-row :gutter="6">
      <el-col :span="12">
        <v-chart :autoresize="true" style="width:90%;height:460px;" :options="temp"/>
      </el-col>
      <el-col :span="12">
        <v-chart :autoresize="true" style="width:90%;height:460px;" :options="humi"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'TestItem',
  components: {
  },
  props: ['equipment', 'temp', 'humi'],
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
