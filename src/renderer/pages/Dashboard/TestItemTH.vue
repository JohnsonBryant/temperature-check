<template>
  <el-row class="dash-test-item">
    <el-col :span="12">
      <v-chart :autoresize="true" style="width:90%;height:100%;" :options="temp"/>
    </el-col>
    <el-col :span="12">
      <v-chart :autoresize="true" style="width:90%;height:100%;" :options="humi"/>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'TestItem',
  components: {
  },
  props: ['equipment', 'temp', 'humi'],
  computed: {
  }
}
</script>
