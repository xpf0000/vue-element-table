<template>
  <el-switch
    v-model="val"
    :active-value="on"
    :inactive-value="off"
    @change="doSwitch"
  ></el-switch>
</template>

<script>
  export default {
    components: {},
    props: {
      value: {
        type: [String, Number, Boolean],
        default: ''
      },
      on: {
        type: [String, Number, Boolean],
        default: ''
      },
      off: {
        type: [String, Number, Boolean],
        default: ''
      },
      api: {
        type: [Promise, Function],
        default: function () {
          return null
        }
      },
      keyFlag: {
        type: String,
        default: ''
      },
      keyId: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        val: ''
      }
    },
    watch: {
      value: {
        handler(val) {
          this.val = val
        },
        immediate: true
      }
    },
    created() {},
    mounted() {},
    methods: {
      doSwitch(val) {
        console.log('doSwitch: ', val)
        if (!this.keyId || !this.keyFlag) {
          return
        }
        this.api({ value: val, key: this.keyFlag, id: this.keyId })
          .then((_) => {
            this.$message.success('操作成功')
          })
          .catch((_) => {
            this.val = val === this.on ? this.off : this.on
            this.$message.error('操作失败')
          })
      }
    }
  }
</script>
