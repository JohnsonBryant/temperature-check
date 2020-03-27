<template>
  <div class="dash-test-item">
    <h4 v-html="equipmentTitle"></h4>
    <el-row :gutter="6">
      <el-col :span="12">
        <v-chart :autoresize="true" style="width:90%;height:460px;" :options="temps"/>
      </el-col>
      <el-col :span="12">
        <v-chart :autoresize="true" style="width:90%;height:460px;" :options="humis"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
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
