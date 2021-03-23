<template>
  <div>
    <SearchBox
      v-if="apiSearch"
      :api="apiSearch"
      :show="searchShow"
      :on-search-submit="onSearchSubmit"
    ></SearchBox>
    <el-row>
      <el-col :span="8" class="common-list-tool-left">
        <slot name="tool" :data="selectRows"></slot>
        <el-button
          v-if="addAndEdit"
          icon="el-icon-plus"
          type="primary"
          @click="handleEdit(null)"
        >
          添加
        </el-button>
        <el-button
          v-if="showChoose && apiDelete"
          :disabled="selectRows.length === 0"
          icon="el-icon-delete"
          type="danger"
          @click="handleDelete"
        >
          批量删除
        </el-button>
      </el-col>
      <el-col :span="16">
        <CommonExportBar
          v-if="showExport"
          v-model="keyword"
          :export-choose="selectRows"
          :api-list="apiList"
          :theader="theader"
          :querys="querys"
        >
          <el-form-item v-if="apiSearch" slot="right">
            <el-button
              icon="el-icon-search"
              plain
              @click="searchShow = !searchShow"
            ></el-button>
          </el-form-item>
        </CommonExportBar>
      </el-col>
    </el-row>
    <el-table
      v-loading="listLoading"
      default-expand-all
      row-key="id"
      :data="showList"
      :element-loading-text="elementLoadingText"
      :highlight-current-row="singleChoose"
      :show-summary="showSum"
      @selection-change="setSelectRows"
      @current-change="setSingleRow"
    >
      <el-table-column
        v-if="showChoose"
        show-overflow-tooltip
        type="selection"
      ></el-table-column>
      <template v-for="(item, index) in theader">
        <el-table-column
          v-if="item.show && item.permission !== false"
          :key="index"
          show-overflow-tooltip
          :prop="item.prop"
          :label="item.label"
          :width="item.width || 'auto'"
          :align="item.align || 'left'"
          :formatter="item.formatter"
          :fixed="item.label === '操作' ? 'right' : false"
        >
          <template v-if="!item.prop" v-slot="scope">
            <slot :name="item.label" :data="scope.row"></slot>
            <template v-if="item.label === '操作'">
              <el-button
                v-if="
                  addAndEdit &&
                  (typeof item.edit === 'function'
                    ? item.edit(scope.row) !== false
                    : item.edit !== false)
                "
                type="text"
                @click="handleEdit(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                v-if="
                  apiDelete &&
                  (typeof item.del === 'function'
                    ? item.del(scope.row) !== false
                    : item.del !== false)
                "
                type="text"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
            <template v-else-if="item.type === 'switch'">
              <SwitchVal
                :key-id="scope.row.id"
                :key-flag="item.flag"
                :on="item.on"
                :off="item.off"
                :value="item.value(scope.row)"
                :api="item.api"
              ></SwitchVal>
            </template>
            <template v-else-if="item.type === 'index'">
              {{
                scope.$index + 1 + (queryForm.pageNo - 1) * queryForm.pageSize
              }}
            </template>
          </template>
          <template
            v-else-if="item.prop && item.type === 'image'"
            v-slot="scope"
          >
            <el-image
              class="common-list-img"
              :preview-src-list="[scope.row[item.prop]]"
              :src="scope.row[item.prop]"
            ></el-image>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <el-pagination
      v-if="showPage"
      class="common-list-pagin"
      background
      :current-page="queryForm.pageNo"
      :page-size="queryForm.pageSize"
      :layout="layout"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
  /**
   * @author 徐鹏飞
   * @desc 通用列表
   */
  import CommonExportBar from '../TableExportBar'
  import SearchBox from '../TableSearchBox'
  import SwitchVal from '../SwitchVal'
  export default {
    components: { SearchBox, CommonExportBar, SwitchVal },
    props: {
      // 显示导出
      showExport: {
        type: Boolean,
        default: true
      },
      // 显示选择框
      showChoose: {
        type: Boolean,
        default: true
      },
      // 允许单选
      singleChoose: {
        type: Boolean,
        default: false
      },
      // 显示合计
      showSum: {
        type: Boolean,
        default: false
      },
      // 显示分页
      showPage: {
        type: Boolean,
        default: true
      },
      // 搜索接口
      apiSearch: {
        type: [Promise, Function],
        default: function () {
          return null
        }
      },
      // 删除接口
      apiDelete: {
        type: [Promise, Function],
        default: function () {
          return null
        }
      },
      // 获取数据接口
      apiList: {
        type: [Promise, Function],
        default: function () {
          return null
        }
      },
      // 添加编辑回调
      addAndEdit: {
        type: [Function],
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
      },
      // 表头数据
      theader: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    data() {
      return {
        list: [],
        listLoading: true,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: 0,
        selectRows: [],
        elementLoadingText: '正在加载...',
        queryForm: {
          pageNo: 1,
          pageSize: 10
        },
        keyword: '',
        searchShow: false
      }
    },
    computed: {
      /**
       * table显示的数据 有搜索词时 会根据搜索词过滤数据
       * @returns {null|*}
       */
      showList() {
        if (this.keyword.trim().length === 0) {
          return this.list
        } else {
          return this.list.filter((item) => {
            for (let k in item) {
              let s = item[k]
              if (typeof s === 'object') {
                s = JSON.stringify(s)
              }
              if (`${s}`.indexOf(this.keyword) >= 0) {
                return item
              }
            }
          })
        }
      }
    },
    watch: {
      querys: {
        handler(val) {
          for (let k in val) {
            this.$set(this.queryForm, k, val[k])
          }
          this.queryData()
        },
        deep: true,
        immediate: true
      }
    },
    created() {},
    methods: {
      onSearchSubmit(data) {
        if (data) {
          data = { ...data, ...this.queryForm }
        }
        this.fetchData(data)
      },
      setSelectRows(val) {
        this.selectRows = val
      },
      setSingleRow(val) {
        this.selectRows = [val]
      },
      handleEdit(row) {
        this.addAndEdit && this.addAndEdit(row)
      },
      handleDelete(row) {
        let ids = row.id
        if (!ids && this.selectRows.length > 0) {
          ids = this.selectRows.map((item) => item.id).join()
        }
        this.$confirm('你确定要删除当前项吗', null).then((_) => {
          this.apiDelete(ids)
            .then((_) => {
              this.$message.success('删除成功')
              this.fetchData()
            })
            .catch((_) => {
              this.$message.error('删除失败')
            })
        })
      },
      handleSizeChange(val) {
        this.queryForm.pageSize = val
        this.fetchData()
      },
      handleCurrentChange(val) {
        this.queryForm.pageNo = val
        this.fetchData()
      },
      queryData() {
        this.queryForm.pageNo = 1
        this.fetchData()
      },
      fetchData(form = null) {
        this.listLoading = true
        this.apiList(form || this.queryForm).then((res) => {
          console.log('res: ', res)
          let data = res.data
          this.list = data.list
          this.total = data.totalCount
          this.$emit('fetchData', data)
          setTimeout(() => {
            this.listLoading = false
          }, 300)
        })
      }
    }
  }
</script>
<style>
  .common-list-tool-left {
    min-height: 32px;
  }
  .common-list-pagin {
    text-align: center;
    margin-top: 20px;
  }
  .common-list-img {
    width: 60px;
    height: 60px;
  }
</style>
