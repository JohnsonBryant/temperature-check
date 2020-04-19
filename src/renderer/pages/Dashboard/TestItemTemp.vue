<template>
  <div class="dash-test-item">
    <v-chart :autoresize="true" style="width:90%;height:100%;" :options="temp"/>
  </div>
</template>

<script>
export default {
  name: 'TestItemTemp',
  components: {
  },
  props: ['equipment', 'temp'],
  computed: {
  }
}
</script>
