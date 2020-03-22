<template>
<el-card class="testEq-item" shadow="always">
  <h4>{{device.company}}  --  {{device.em}}  --  {{device.deviceName}}  --  {{device.deviceType}}  --  {{device.deviceID}}  --  {{device.detectProperty}}测量</h4>
  <div class="testEq-item-conf">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-input class="testEq-item-conf-input" placeholder="采集次数" v-model="config.count" :disabled="isOnTest">
          <template slot="prepend">采集次数：</template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-input class="testEq-item-conf-input" placeholder="温度示值" v-model="config.temp" :disabled="isOnTest">
          <template slot="prepend">温度示值：</template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-input class="testEq-item-conf-input" placeholder="湿度示值" v-model="config.humi" :disabled="isOnTest">
          <template slot="prepend">湿度示值：</template>
        </el-input>
      </el-col>
      <el-col :span="4">
        <el-input class="testEq-item-conf-input" placeholder="中心点ID" v-model="config.centerID" :disabled="isOnTest">
          <template slot="prepend">中心点ID：</template>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-input class="testEq-item-conf-input" placeholder="传感器ID：1,2" v-model="config.IDS" :disabled="isOnTest">
          <template slot="prepend">传感器ID：</template>
        </el-input>
      </el-col>
    </el-row>
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

<style>
.testEq-item{
  margin-bottom: 1rem;
}

.testEq-item h4{
  color: #707377;
}

.testEq-item-conf{
  margin-top: 2.5rem;
}

.testEq-item-conf-input .el-input-group__prepend {
  padding: 0 0 0 5px;
}
</style>