<!--
 * @Description: 基于element-ui组件库table封装
 * @Autor: bhj
 * @Date: 2022-03-11 14:28:44
 * @LastEditors: bhj
 * @LastEditTime: 2022-03-11 14:30:50
-->
<template>
  <div class="eTable">
    <div class="tableComp" :style="compStyle">
      <el-table
        v-loading="loading"
        element-loading-text="数据加载中"
        :data="tableData"
        :border="border"
        :stripe="stripe"
        :height="height"
        @row-dblclick="rowDblclick"
        @sort-change="sortChange"
        @selection-change="selectionChange"
        :default-sort="{ prop: 'date', order: 'descending' }"
        :row-key="rowKey"
        ref="eTable"
      >
        <template v-for="item in columnData">
          <el-table-column type="selection" :width="item.width" v-if="item.prop == 'selection' && item.isShow()" :key="item.prop" :reserve-selection="true"></el-table-column>
          <el-table-column v-else-if="item.prop == 'index'" type="index" label="序号" :width="item.width || 100" align="center" :index="getListIndex" :key="item.prop"> </el-table-column>
          <template v-else-if="item.prop == 'options'">
            <template v-if="optionsList.length">
              <el-table-column :label="item.label" :width="item.width" :fixed="item.fixed" :align="item.align" :key="item.prop">
                <template slot-scope="scope">
                  <template v-for="btn in optionsList">
                    <template v-if="btn.imgName">
                      <!-- 图片按钮 -->
                      <BaseBtn
                        class="imgBtn"
                        :key="btn.label"
                        v-if="btn.isShow ? btn.isShow(scope.row) : true"
                        :disabled="btn.isDisabled ? btn.isDisabled(scope.row) : false"
                        :imgName="btn.imgName(scope.row)"
                        :btnName="btn.label"
                        @click="btn.event(scope.row)"
                      ></BaseBtn>
                    </template>
                    <template v-else>
                      <!-- 气泡按钮 -->
                      <template v-if="btn.popover">
                        <el-popover
                          :key="btn.label"
                          :placement="btn.popover.placement || 'top'"
                          :width="btn.popover.width || 200"
                          :trigger="btn.popover.trigger || 'click'"
                          :append-to-body="false"
                          :popper-options="{
                            boundariesElement: 'body',
                            gpuAcceleration: true,
                            positionFixed: true,
                            preventOverflow: true
                          }"
                        >
                          <slot :name="btn.code" :data="scope.row"></slot>
                          <el-button
                            :key="btn.label"
                            :type="btn.type"
                            v-if="btn.isShow ? btn.isShow(scope.row) : true"
                            :disabled="btn.isDisabled ? btn.isDisabled(scope.row) : false"
                            slot="reference"
                            class="imgBtn"
                          >
                            {{ btn.label }}</el-button
                          >
                        </el-popover>
                      </template>
                      <!-- 普通按钮 -->
                      <template v-else>
                        <el-button
                          class="imgBtn"
                          :key="btn.label"
                          :type="btn.type"
                          v-if="btn.isShow ? btn.isShow(scope.row) : true"
                          :disabled="btn.isDisabled ? btn.isDisabled(scope.row) : false"
                          @click="btn.event(scope.row)"
                        >
                          {{ btn.label }}
                        </el-button>
                      </template>
                    </template>
                  </template>
                </template>
              </el-table-column>
            </template>
          </template>
          <template v-else>
            <!-- formatter 和插槽不能一起使用 -->
            <template v-if="item.formatter">
              <el-table-column
                v-if="item.isShow ? item.isShow() : true"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :min-width="item.minWidth"
                :formatter="item.formatter"
                show-overflow-tooltip
                :sortable="item.sort"
                :align="item.align"
              >
              </el-table-column>
            </template>
            <!-- 正常列 -->
            <template v-else>
              <el-table-column
                v-if="item.isShow ? item.isShow() : true"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :min-width="item.minWidth"
                show-overflow-tooltip
                :sortable="item.sort"
                :align="item.align"
              >
                <template slot-scope="{ row }">
                  <!-- defined 自定义插槽-->
                  <slot v-if="item.defined" :name="item.prop" :data="row"></slot>
                  <!-- 普通属性 -->
                  <span v-else>{{ row[item.prop] }}</span>
                </template>
              </el-table-column>
            </template>
          </template>
        </template>
        <template v-slot:empty>
          <div v-if="showNoData" class="emptyData">
            <img src="@/assets/nodata.png" />
            <!-- <span>暂无任何信息!</span> -->
          </div>
        </template>
      </el-table>
    </div>
    <div class="paginationComp">
      <el-pagination
        class="pg"
        layout="total, sizes, prev, pager, next, jumper"
        v-if="tableData.length && total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        :pager-count="pagerCount"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showNoData: false
    }
  },
  props: {
    // 加载中
    loading: {
      type: Boolean,
      default: false
    },
    // 表格边框
    border: {
      type: Boolean,
      default: false
    },
    // 斑马纹
    stripe: {
      type: Boolean,
      default: false
    },
    // 表格高度
    height: {
      type: [Number, String],
      default: '100%'
    },
    // 分页数据总数
    total: {
      type: Number,
      default: 0
    },
    // 单页数据量
    pageSize: {
      type: Number,
      default: 10
    },
    // 分页切换数组
    pageSizes: {
      type: Array,
      default: () => {
        return [10, 50, 100, 300]
      }
    },
    // 当前页码
    currentPage: {
      type: Number,
      default: 1
    },
    // 分页器最大页码数
    pagerCount: {
      type: Number,
      default: 7
    },
    // 表格数据
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 表头数据
    columnData: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 操作数据
    optionsList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  computed: {
    compStyle() {
      let style = {}
      if (this.tableData.length && this.total) {
        style.height = 'calc(100% - 56px)'
      } else {
        style.height = 'calc(100% - 0px)'
      }
      return style
    }
  },
  methods: {
    rowKey(row) {
      return row.id
    },
    handleCurrentChange(currentPage) {
      this.handleScrollTop()
      this.$emit('handleChange', this.pageSize, currentPage)
    },
    handleSizeChange(pageSize) {
      this.handleScrollTop()
      this.$emit('handleChange', pageSize, 1)
    },
    handleScrollTop() {
      // 表格滚动条回到最顶部
      this.$refs['eTable'].bodyWrapper.scrollTop = 0
    },
    rowDblclick(row) {
      this.$emit('rowDblclick', row)
    },
    getListIndex(index) {
      return (this.currentPage - 1) * this.pageSize + index + 1
    },
    sortChange(data) {
      this.$emit('sortChange', data)
    },
    selectionChange(selection) {
      this.$emit('selectionChange', selection)
    }
  },
  watch: {
    tableData: {
      handler() {
        setTimeout(() => {
          this.showNoData = true
        }, 1000)
      }
    }
  }
}
</script>
<style lang="scss">
.eTable {
  height: 100%;
  .tableComp {
    border-bottom: 1px solid #ffffff;
    .el-table--medium th,
    .el-table--medium td {
      // padding: 3px 0;
      padding: 0;
      border: none;
    }
    .el-table__header > thead > tr > th {
      background-color: #fafafa;
    }
    .el-table--enable-row-transition .el-table__body td {
      height: 50px;
      padding: 0;
    }
    .el-table__body {
      width: 100% !important;
    }
    .el-table__body-wrapper::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 7px;
      height: 7px;
    }
    .el-table__body-wrapper::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 100px;
      // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: #e0e1e2;
      // background: rgb(113, 133, 141);
    }
    .el-table__body-wrapper::-webkit-scrollbar-thumb:hover {
      background: rgba(157, 165, 183, 0.8);
      border-color: #000;
    }
    .el-table__body-wrapper::-webkit-scrollbar-track {
      /*滚动条里面轨道*/
      // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      border-radius: 20px;
      background: transparent;
    }
    .el-table__body-wrapper {
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    .el-table--striped .el-table__body tr.el-table__row--striped td {
      background-color: #f7f9fb;
    }
    .el-table__row:hover td {
      background-color: #ebf0f5 !important;
    }
    colgroup {
      col[name='gutter'] {
        width: 7px !important;
      }
    }
    .emptyData {
      display: flex;
      justify-content: center;
      align-items: center;
      > span {
        margin-left: 30px;
        color: #606060;
      }
    }
    .imgBtn {
      margin-right: 10px;
      .el-button {
        padding: 0;
        vertical-align: middle;
      }
    }
  }
  .paginationComp {
    .pg {
      margin-top: 8px;
      text-align: right;
    }
    .el-pagination__total {
      float: left;
    }
  }
}
</style>
