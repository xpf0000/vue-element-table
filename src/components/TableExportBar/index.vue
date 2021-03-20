<template>
  <el-form class="table-form common-export-bar" :inline="true">
    <slot name="left"></slot>
    <el-form-item>
      <el-input v-model.trim="val" placeholder="关键词筛选" clearable />
    </el-form-item>
    <el-form-item>
      <el-dropdown :hide-on-click="false">
        <el-button icon="el-icon-s-grid" plain class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in theader" :key="index">
            <template v-if="item.permission !== false">
              <el-checkbox v-model="item.show">
                {{ item.label }}
              </el-checkbox>
            </template>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown :hide-on-click="false">
        <el-button icon="el-icon-folder-opened" plain class="el-dropdown-link">
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown
            placement="bottom-start"
            :hide-on-click="true"
            @command="handleCommand"
          >
            <el-dropdown-item>
              JSON
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-dropdown-item>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="JSON-CHOOSED">选中</el-dropdown-item>
              <el-dropdown-item command="JSON-ALL">全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown
            placement="bottom-start"
            :hide-on-click="true"
            @command="handleCommand"
          >
            <el-dropdown-item>
              CSV
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-dropdown-item>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="CSV-CHOOSED">选中</el-dropdown-item>
              <el-dropdown-item command="CSV-ALL">全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown
            placement="bottom-start"
            :hide-on-click="true"
            @command="handleCommand"
          >
            <el-dropdown-item>
              Excel
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-dropdown-item>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="Excel-CHOOSED">选中</el-dropdown-item>
              <el-dropdown-item command="Excel-ALL">全部</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-dropdown-menu>
      </el-dropdown>
    </el-form-item>
    <slot name="right"></slot>
  </el-form>
</template>

<script>
  /**
   * @author 徐鹏飞
   * @desc 通用导出工具条
   */

  export default {
    components: {},
    props: {
      // 导出文件标题
      exportTitle: {
        type: String,
        default: '导出文件'
      },
      // 搜索框传值
      value: {
        type: String,
        default: ''
      },
      // 显示列表标题
      theader: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 导出选择的行数据
      exportChoose: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 点击全部导出时候调用的接口 获取最多100万条数据
      apiList: {
        type: [Function, Promise],
        default: function () {
          return null
        }
      },
      // 获取列表时, 传递的参数
      querys: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        val: ''
      }
    },
    computed: {},
    watch: {
      value: {
        handler(val) {
          this.val = val
        },
        immediate: true
      },
      val(v) {
        this.$emit('input', v)
      }
    },
    methods: {
      handleCommand(command) {
        console.log('command: ', command)
        switch (command) {
          case 'Excel-CHOOSED':
            this.excel()
            break
          case 'Excel-ALL':
            this.excel(true)
            break
          case 'CSV-CHOOSED':
            this.csv()
            break
          case 'CSV-ALL':
            this.csv(true)
            break
          case 'JSON-CHOOSED':
            this.json()
            break
          case 'JSON-ALL':
            this.json(true)
            break
        }
      },
      excel(all = false) {
        require.ensure([], () => {
          const { export_json_to_excel } = require('@/lib/excel/Export2Excel')
          let headers = this.theader.filter((item) => {
            return item.show && item.prop
          })
          const tHeader = headers.map((item) => {
            return item.label
          })
          const filterVal = headers.map((item) => {
            return item.prop
          })
          if (!all) {
            const list = this.exportChoose
            const data = this.formatJson(filterVal, list)
            export_json_to_excel(tHeader, data, this.exportTitle)
          } else {
            let query = { ...this.querys, pageNo: 1, pageSize: 1000000 }
            this.apiList(query).then((res) => {
              let list = res.data.list || res.data
              const data = this.formatJson(filterVal, list)
              export_json_to_excel(tHeader, data, this.exportTitle)
            })
          }
        })
      },
      csv(all = false) {
        require.ensure([], () => {
          const { export_json_to_csv } = require('@/lib/excel/Export2CSV')
          let headers = this.theader.filter((item) => {
            return item.show && item.prop
          })
          const tHeader = headers.map((item) => {
            return item.label
          })
          const filterVal = headers.map((item) => {
            return item.prop
          })
          if (!all) {
            const list = this.exportChoose
            let data = this.formatJson(filterVal, list)
            data.unshift(tHeader)
            export_json_to_csv(data, this.exportTitle)
          } else {
            let query = { ...this.querys, pageNo: 1, pageSize: 1000000 }
            this.apiList(query).then((res) => {
              let list = res.data.list || res.data
              let data = this.formatJson(filterVal, list)
              data.unshift(tHeader)
              export_json_to_csv(data, this.exportTitle)
            })
          }
        })
      },
      json(all = false) {
        require.ensure([], () => {
          const { export_json_to_json } = require('@/lib/excel/Export2JSON')
          let headers = this.theader.filter((item) => {
            return item.show && item.prop
          })
          const tHeader = headers.map((item) => {
            return item.label
          })
          const filterVal = headers.map((item) => {
            return item.prop
          })
          if (!all) {
            const list = this.exportChoose
            const data = this.formatJson1(list, tHeader, filterVal)
            export_json_to_json(data, this.exportTitle)
          } else {
            let query = { ...this.querys, pageNo: 1, pageSize: 1000000 }
            this.apiList(query).then((res) => {
              let list = res.data.list || res.data
              const data = this.formatJson1(list, tHeader, filterVal)
              export_json_to_json(data, this.exportTitle)
            })
          }
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map((v) => filterVal.map((j) => v[j]))
      },
      formatJson1(list, tHeader, filterVal) {
        let data = []
        for (let item of list) {
          let nitem = {}
          for (let i of Object.keys(tHeader)) {
            nitem[tHeader[i]] = item[filterVal[i]]
          }
          data.push(nitem)
        }
        return data
      }
    }
  }
</script>
<style>
  .common-export-bar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
</style>
