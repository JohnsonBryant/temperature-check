<template>
  <div class="dash-test-item">
    <h4 v-html="equipmentTitle"></h4>
    <el-table
      :data="humiTestDataTable"
      :stripe="true"
      border resizable
      style="width: 100%"
      >
      <div v-for="(item, key) in humiTestDataTable[0]" :key="key">
        <el-table-column
          :prop="key"
          :label="key"
          >
        </el-table-column>
      </div>
    </el-table>
    <el-table
      :data="tempTestDataTable"
      :stripe="true"
      border resizable
      style="width: 100%"
      >
      <div v-for="(item, key) in tempTestDataTable[0]" :key="key">
        <el-table-column
          :prop="key"
          :label="key"
          >
        </el-table-column>
      </div>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'TestItemTable',
  components: {
  },
  props: ['equipment', 'humiTestDataTable', 'tempTestDataTable'],
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

.dash-test-item{
  padding-top: 1rem;
  /* padding-bottom: 1rem; */
}

.dash-test-item > h4{
  text-align: center;
  padding-bottom: 1rem;
  font-size: 1.4rem;
  color: #707377;
}

.dash-test-item .test-item-data{
  height: 47rem;
  overflow: auto;
}

.dash-test-item .test-item-col{
  text-align: center;
}

</style>