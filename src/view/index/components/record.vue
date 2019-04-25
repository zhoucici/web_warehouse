<template>
  <div class="container">
    <el-breadcrumb style="margin-bottom: 10px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
      <el-breadcrumb-item>出入记录</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-form :inline="true" size="mini">
        <el-form-item>
          <el-input size="mini" v-model="searchData.search" placeholder="请输入搜索信息" style="width: 180px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="dtc-search" @click="search()" type="primary" icon="el-icon-search">搜索</el-button>
          <el-button class="dtc-search" @click="clearSearch()" type="" icon="el-icon-error">清除搜索</el-button>
        </el-form-item>
        <el-form-item class="add">
          <el-button type="primary" size="small" @click="addGoods">添加物品</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="goodsData.goodsList"
        size="mini"
        cell-class-name='cellclass'>
          <el-table-column prop="goodsName" label="物品名"></el-table-column>
          <el-table-column prop="goodsId" label="物品编号"></el-table-column>
          <el-table-column prop="belongTo" label="所属部门"></el-table-column>
          <el-table-column prop="controller" label="管理者"></el-table-column>
          <el-table-column label="出入记录">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                class="tablebtn"
                @click="checkRecord(scope.$index, scope.row.record)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="nowAmount" label="目前库存"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                class="tablebtn"
                @click="intoWarehouse(scope.$index, scope.row)">入仓</el-button>
              <el-button
                v-if="scope.row.nowAmount"
                size="mini"
                type="success"
                class="tablebtn"
                @click="outWarehouse(scope.$index, scope.row)">出仓</el-button>
            </template>
          </el-table-column>
          <el-table-column label="编辑">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                class="tablebtn"
                @click="editGoods(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                class="tablebtn"
                @click="delGoods(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
      </el-table>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="goodsData.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="goodsData.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="goodsData.total">
    </el-pagination>
    <el-dialog
      :title="title"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="30%">
        <el-form ref="form" :model="goodsDetail" :rules="rules" label-width="80px" style="width:360px;">
          <el-form-item label="物品名" prop="goodsName">
              <el-input size="mini" v-model="goodsDetail.goodsName" placeholder="请输入物品名称"></el-input>
          </el-form-item>
          <el-form-item label="物品编号" prop="goodsId">
              <el-input size="mini" :disabled="!isAdd" v-model="goodsDetail.goodsId" placeholder="请输入物品编号"></el-input>
          </el-form-item>
          <el-form-item label="所属部门" prop="belongTo">
              <el-input size="mini" v-model="goodsDetail.belongTo" placeholder="请输入所属部门"></el-input>
          </el-form-item>
          <el-form-item label="管理者" prop="controller">
              <el-input size="mini" v-model="goodsDetail.controller" placeholder="请输入管理者"></el-input>
          </el-form-item>
          <el-form-item label="目前库存" prop="goodsId">
              <el-input size="mini" v-model="goodsDetail.goodsId" placeholder="请输入目前库存"></el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="execute">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="出入库记录"
      v-if="recordDialogVisible"
      :visible.sync="recordDialogVisible"
      width="30%">
      <el-table
        :data="recordList"
        size="mini"
        cell-class-name='cellclass'>
          <el-table-column prop="into" label="物品入库"></el-table-column>
          <el-table-column prop="out" label="物品出库"></el-table-column>
          <el-table-column prop="time" label="出入库时间"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { getGoods, addGoods, delGoodsById, editGoodsById } from '@/api/goods'
export default {
  data () {
    return {
      dialogVisible: false,
      // 出入记录弹窗
      recordDialogVisible: false,
      // 出入记录列表
      recordList: [],
      isAdd: true,
      // 查询条件
      searchData: {
        search: '',
        currentPage: 1,
        pageSize: 10
      },
      // 记录列表
      goodsData: {},
      // 单个记录详情
      goodsDetail: {
        goodsName: '',
        goodsId: '',
        belongTo: '',
        controller: '',
        record: [],
        nowAmount: 0
      },
       rules: {
        goodsName:  { required: true, message: '请输入物品名称', trigger: 'blur' },
        goodsId:  { required: true, message: '请输入物品编号', trigger: 'blur' },
        belongTo:  { required: true, message: '请输入所属部门', trigger: 'blur' },
        controller:  { required: true, message: '请输入管理者', trigger: 'blur' },
        nowAmount:  { required: true, message: '请输入目前库存', trigger: 'blur' }
      }
    }
  },
  created(){
    this.getData()
  },
  computed: {
    title() {
      if(this.isAdd) {
        return "添加"
      } else {
        return "编辑"
      }
    }
  },
  methods: {
    // 获取数据
    getData() {
      getGoods(this.searchData).then(res => {
        this.goodsData = res.data
      })
    },
    // 搜索
    search() {
       this.getData()
    },
    // 清除搜索内容
    clearSearch() {
      this.searchData.search = ''
      this.getData()
    },
    // 查看出入记录
    checkRecord(index, item) {
      this.recordDialogVisible = true
      this.recordList = item
    },
    // 入仓操作
    intoWarehouse() {

    },
    // 出仓操作
    outWarehouse() {

    },
    // 添加物品
    addGoods() {
      this.isAdd = true
      this.dialogVisible = true
    },
    // 编辑操作
    editGoods(index, item) {
      this.isAdd = false
      this.dialogVisible = true
      this.goodsDetail = Object.assign({}, item)
    },
    // 执行添加或编辑并关闭弹窗
    execute() {
      this.$refs.form.validate(valid => {
        if(valid) {
          if(this.isAdd) {
            addGoods(this.goodsDetail).then(() => {
              this.getData()
              this.dialogVisible = false
            })
          } else {
            editGoodsById(this.goodsDetail.goodsId, this.goodsDetail).then(() => {
              this.getData()
              this.dialogVisible = false
            })
          }
        } else {
            this.$message.error('请填写正确信息');
        }
      })
    },
    // 删除操作
    delGoods(index, item) {
      // 根据物品编号删除物品
      delGoodsById(item.goodsId).then(() => {
        this.getData()
      })
    },
    handleSizeChange(size) {
      this.$set(this.searchData, 'pageSize', size)
      this.getData()
    },
    handleCurrentChange(val) {
      this.$set(this.searchData, 'currentPage', val)
      this.getData()
    }
  }
}
</script>
<style lang='less' scoped>
.container{
  .el-pagination{
    margin-top: 20px;
    text-align: center;
  }
}
.add{
  position: absolute;
  right: 40px;
}
</style>
