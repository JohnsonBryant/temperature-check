<template>
<el-card class="testEq-item" shadow="always">
  <h4>{{device.company}}  --  {{device.em}}  --  {{device.deviceName}}  --  {{device.deviceType}}  --  {{device.deviceID}}  --  {{device.detectProperty}}测量</h4>
  <div class="testEq-item-conf">
      <el-form :inline="true">
      <el-form-item prop="em" label="采集次数：">
        <el-input class="testEq-item-conf-input" placeholder="采集次数" v-model="config.count" :disabled="isOnTest">
        </el-input>
      </el-form-item>
      <el-form-item prop="em" label="温度示值：">
        <el-input class="testEq-item-conf-input" placeholder="温度示值" v-model="config.temp" :disabled="isOnTest">
        </el-input>
      </el-form-item>
      <el-form-item prop="em" label="传感器ID：">
        <el-input class="testEq-item-conf-input" placeholder="传感器ID：1,2" v-model="config.IDS" :disabled="isOnTest">
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</el-card>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'testConfigItem',
  props: ['device', 'config'],
  computed: {
    ...mapState(['isOnTest'])
  }
}
</script>
