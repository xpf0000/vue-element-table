<template>
  <div id="app">
    <BaseTable
      :theader="theader"
      :querys="query"
      :api-list="apiList"
      :api-search="apiSearch"
      :api-delete="null"
      :show-export="true"
      :show-choose="true"
      :show-page="true"
      :show-sum="true"
      :single-choose="true"
      :add-and-edit="edit"
    ></BaseTable>
  </div>
</template>

<script>
  import { BaseTable as BaseTable } from './index'
  export default {
    name: 'App',
    components: { BaseTable },
    data() {
      return {
        query: {},
        theader: [
          {
            label: '序号',
            type: 'index',
            prop: null,
            show: true,
            align: 'center',
            width: '80px' // 固定宽度
          },
          {
            label: 'ID',
            prop: 'id',
            show: true,
            align: 'center',
            width: '80px' // 固定宽度
          },
          {
            label: '左对齐',
            prop: 'name',
            show: true,
            align: 'left' // 左对齐
          },
          {
            label: '居中对齐',
            prop: 'name',
            show: true,
            align: 'center' // 居中对齐
          },
          {
            label: '右对齐',
            prop: 'name',
            show: true,
            align: 'right' // 右对齐
          },
          {
            label: '开关切换',
            type: 'switch', // 开关切换
            on: 1, // 开的时候的值
            off: 0, // 关的时候的值
            api: function () {}, // 切换时调用的接口
            flag: 'status', // 数据库里的字段
            value: function (row) {
              // 当前值
              return row.status
            },
            show: true,
            align: 'center'
          },
          {
            label: '图片',
            type: 'image', // 图片类型
            prop: 'img',
            show: true,
            align: 'center'
          },
          {
            label: '格式化数据',
            prop: 'platform',
            formatter: function (row) {
              // 格式化显示数据
              return row.platform === 0 ? 'PC' : '移动端'
            },
            show: true,
            align: 'center'
          },
          {
            label: '创建时间',
            prop: 'create_time',
            show: true,
            align: 'center'
          },
          {
            label: '操作',
            prop: null,
            show: true,
            // 是否显示编辑按钮
            edit: function (row) {
              return row.id % 2 === 0
            },
            // 是否显示删除按钮
            del: function (row) {
              return row.id % 3 === 0
            },
            align: 'center'
          }
        ],
        apiList: function (query) {
          return new Promise((resolve) => {
            let data = {
              totalCount: 50,
              list: []
            }
            for (let i = 1; i < 13; i += 1) {
              data.list.push({
                id: i,
                name: 'AAA',
                status: 0,
                img: '',
                platform: 0,
                create_time: '2021-03-05'
              })
            }
            resolve({ code: 0, data: data })
          })
        },
        apiSearch: function (query) {
          return new Promise((resolve) => {
            resolve({
              code: 0,
              data: {
                'o-type': {
                  label: '\u8ba2\u5355\u7c7b\u578b',
                  type: 'select',
                  operate: '=',
                  values: [
                    { label: '\u5168\u90e8', value: '' },
                    {
                      label: '\u8d2d\u4e70\u5e94\u7528\u5957\u9910',
                      value: '1'
                    },
                    {
                      label: '\u5e94\u7528\u5957\u9910\u7eed\u8d39',
                      value: '2'
                    },
                    {
                      label: '\u5e94\u7528\u5957\u9910\u5347\u7ea7',
                      value: '3'
                    },
                    {
                      label: '\u4ee3\u7406\u5546\u5145\u503c\u8ba2\u5355',
                      value: '4'
                    }
                  ],
                  value: ''
                },
                'u-username': {
                  label: '\u7528\u6237\u540d',
                  type: 'text',
                  operate: 'like',
                  value: ''
                },
                'o-orderno': {
                  label: '\u8ba2\u5355\u53f7',
                  type: 'text',
                  operate: 'like',
                  value: ''
                },
                'w-name': {
                  label: '\u5e94\u7528\u540d\u79f0',
                  type: 'text',
                  operate: 'like',
                  value: ''
                },
                'm-meal_name': {
                  label: '\u5957\u9910\u540d\u79f0',
                  type: 'text',
                  operate: 'like',
                  value: ''
                }
              }
            })
          })
        }
      }
    },
    mounted() {
      this.$set(this.query, 'a', 1)
      this.$set(this.query, 'b', 2)
      this.$set(this.query, 'c', 3)
    },
    methods: {
      show() {},
      edit() {}
    }
  }
</script>
<style>
  #app {
    height: 100vh;
  }
</style>
