<template>
  <div :class="{ 'search-box': true, active: active }" :style="style">
    <div v-for="(item, name) in items" :key="name" class="search-item">
      <span class="label" v-text="item.label"></span>
      <el-input
        v-if="item.type === 'text'"
        v-model.trim="item.value"
        class="search-input"
        clearable
      />
      <el-input
        v-else-if="item.type === 'number'"
        v-model.number="item.value"
        type="number"
        class="search-input"
        clearable
      />
      <el-select
        v-else-if="item.type === 'select'"
        v-model="item.value"
        class="search-input"
        clearable
      >
        <el-option
          v-for="(sitem, sindex) in item.values"
          :key="sindex"
          :value="sitem.value"
          :label="sitem.label"
        ></el-option>
      </el-select>
      <template v-else-if="item.type === 'range'">
        <el-input
          v-model.number="item.value.s"
          class="search-input"
          type="number"
          clearable
        />
        <span class="split">-</span>
        <el-input
          v-model.number="item.value.e"
          class="search-input"
          type="number"
          clearable
        />
      </template>
      <el-date-picker
        v-else-if="item.type === 'date'"
        v-model="item.value.s"
        align="right"
        type="date"
        placeholder="选择日期"
        value-format="timestamp"
        :picker-options="pickerOptions"
      ></el-date-picker>
      <template v-else-if="item.type === 'dateRage'">
        <el-date-picker
          v-model="item.value.s"
          align="right"
          type="date"
          placeholder="选择日期"
          value-format="timestamp"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <span class="split">-</span>
        <el-date-picker
          v-model="item.value.e"
          align="right"
          type="date"
          placeholder="选择日期"
          value-format="timestamp"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </template>
    </div>
    <div class="search-item">
      <span class="label"></span>
      <el-button type="primary" @click="doSubmit">提交</el-button>
      <el-button type="info" plain @click="doReset">重置</el-button>
    </div>
  </div>
</template>

<script>
  import { domExactSize } from '@xpf0000/dom-points'
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      },
      api: {
        type: [Promise, Function],
        default: function () {
          return null
        }
      },
      onSearchSubmit: {
        type: Function,
        default: function () {
          return null
        }
      }
    },
    data() {
      return {
        items: {},
        height: 0,
        active: false,
        search: {},
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date())
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              }
            },
            {
              text: '一周前',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              }
            }
          ]
        }
      }
    },
    computed: {
      style() {
        return {
          height: this.height
        }
      }
    },
    watch: {
      show(value) {
        if (value) {
          let clone = this.$el.cloneNode(true)
          clone.style.height = 'auto'
          clone.style.transition = 'none'
          this.$el.parentNode.append(clone)
          let size = domExactSize(clone)
          clone.remove()
          this.height = size.height + 'px'
          setTimeout((_) => {
            this.height = 'auto'
            this.active = true
          }, 330)
        } else {
          let size = domExactSize(this.$el)
          this.height = size.height + 'px'
          setTimeout((_) => {
            this.height = '0px'
            this.active = false
          }, 33)
        }
      }
    },
    created() {
      this.api().then((res) => {
        let data = res.data
        for (let k in data) {
          this.$set(this.items, k, data[k])
        }
        this.search = JSON.parse(JSON.stringify(this.items))
      })
    },
    mounted() {},
    methods: {
      doSubmit() {
        let data = JSON.parse(JSON.stringify(this.items))
        for (let k in data) {
          delete data[k]['values']
          delete data[k]['label']
          if (data[k].type === 'date' || data[k].type === 'dateRage') {
            if (data[k].value.s && data[k].value.s > 10000000000) {
              data[k].value.s = data[k].value.s / 1000
            }
            if (data[k].value.e && data[k].value.e > 10000000000) {
              data[k].value.e = data[k].value.e / 1000
            }
            if (data[k].type === 'date' && data[k].value.s) {
              data[k].value.e = data[k].value.s + 86399
            }
          }
        }
        this.onSearchSubmit && this.onSearchSubmit(data)
      },
      doReset() {
        for (let k in this.search) {
          this.$set(this.items, k, this.search[k])
        }
        this.onSearchSubmit && this.onSearchSubmit(null)
      }
    }
  }
</script>

<style lang="scss">
  .search-box {
    display: flex;
    flex-wrap: wrap;
    height: 0;
    overflow: hidden;
    transition: height 0.3s;

    &.active {
      margin-bottom: 10px;
    }

    .search-item {
      display: flex;
      align-items: center;
      width: 20%;
      min-width: 350px;
      padding-right: 40px;
      margin-bottom: 20px;

      .label {
        flex-shrink: 0;
        width: 30%;
        padding-right: 20px;
        text-align: left;
      }

      .split {
        width: 40px;
        text-align: center;
      }

      .search-input {
        flex: 1;
      }
    }
  }
</style>
