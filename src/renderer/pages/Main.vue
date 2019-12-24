<template>
  <div class="main-wraper">
    <h3>serialport , sqlite3 </h3>
    <li>dirname: {{dirname}}</li>
    <li>processCwd: {{processCwd}}</li>
    <li>appGetName: {{appGetName}}</li>
    <li>getAppPath: {{getAppPath}}</li>
  </div>
</template>

<script>

export default {
  name: 'MainPage',
  data () {
    return {
      dirname: __dirname,
      processCwd: process.cwd(),
      appGetName: this.$electron.remote.app.getName(),
      getAppPath: this.$electron.remote.app.getAppPath()
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style>
/* css */
.main-wraper{
  width: 100%;
  padding: 1rem;
  color: #efefef;
  background-color: cadetblue;
}
</style>
