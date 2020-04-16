<template>
<div class="testEq-item" shadow="always">
  <h4>{{device.company}}  --  {{device.em}}  --  {{device.deviceName}}  --  {{device.deviceType}}  --  {{device.deviceID}}  --  {{device.detectProperty}}测量</h4>
  <div class="testEq-item-conf">
    <el-form :inline="true">
      <el-form-item prop="em" label="采集次数：">
        <el-input class="testEq-item-conf-input" placeholder="采集次数" v-model.number="config.count" :disabled="isOnTest"></el-input>
      </el-form-item>
      <el-form-item prop="em" label="温度示值：">
        <el-input class="testEq-item-conf-input" placeholder="温度示值" v-model="config.temp" :disabled="isOnTest"></el-input>
      </el-form-item>
      <div class="sensor-ids">
        <label for="传感器ID：">传感器ID：</label>
        <el-input v-for="(id,index) in config.IDS" :key="index"
          class="id-input" v-model.number="config.IDS[index]" :disabled="isOnTest"></el-input>
        <el-button @click="add_id(config.IDS)" class="add-id" type="success" icon="el-icon-plus" circle></el-button>
        <el-button @click="del_id(config.IDS)" class="add-id" type="danger" icon="el-icon-minus" circle></el-button>
      </div>
    </el-form>
  </div>
</div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'testConfigItem',
  props: ['device', 'config'],
  computed: {
    ...mapState(['isOnTest'])
  },
  methods: {
    add_id (ids) {
      ids.push(ids[ids.length - 1] + 1)
    },
    del_id (ids) {
      if (ids.length === 1) {
        return
      }
      ids.pop()
    }
  }
}
</script>
