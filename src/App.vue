<template>
  <div id="app">
    <BaseTable
      theader=""
      querys=""
      api-list=""
      api-search=""
      api-delete=""
      show-export=""
      show-choose=""
      show-page=""
      show-sum=""
      add-and-edit=""
      single-choose=""
    ></BaseTable>
  </div>
</template>

<script>
  // import Vue from 'vue'
  import { BaseTable } from '/dist'
  // import Base from '/dist/index'
  // Vue.use(Base)
  // console.log('BBB: ', Base)
  export default {
    name: 'App',
    components: { BaseTable },
    mounted() {},
    methods: {
      show() {}
    }
  }
</script>
<style>
  #app {
    height: 100vh;
  }
</style>
