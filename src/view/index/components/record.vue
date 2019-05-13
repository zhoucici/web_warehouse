<template>
  <div class="container">
    <el-breadcrumb style="margin-bottom: 10px;" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
      <el-breadcrumb-item>仓库查询</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-form :inline="true" size="mini">
        <el-form-item>
          <el-input size="mini" v-model="searchData.search" placeholder="物品名/管理者/所属部门" style="width: 180px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="dtc-search" @click="search()" type="primary" icon="el-icon-search">搜索</el-button>
          <el-button class="dtc-search" @click="clearSearch()" type="" icon="el-icon-error">清除搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="goodsData.data"
        size="mini"
        cell-class-name='cellclass'>
          <el-table-column prop="name" label="操作人"></el-table-column>
          <el-table-column prop="person" label="存取人"></el-table-column>
          <el-table-column prop="belongto" label="物品所属"></el-table-column>
          <el-table-column prop="date" label="操作时间"></el-table-column>
          <el-table-column prop="towhere" label="来去向"></el-table-column>
          <el-table-column prop="type" label="存取类型"></el-table-column>
          <el-table-column prop="liyou" label="理由"></el-table-column>
      </el-table>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="goodsData.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, prev, pager, next, jumper"
      :total="goodsData.total">
    </el-pagination>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { getRecord } from '@/api/record'
export default {
  data () {
    return {
      // 查询条件
      searchData: {
        search: '',
        page: 1,
        id: null,
        sys: this.$store.getters._userinfo.sys || ''
      },
      // 用户列表
      userList: {},
      // 记录列表
      goodsData: {},
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
      // console.log(this.$store.getters._userinfo.sys)
      getRecord(this.searchData).then(res => {
        console.log(res.data)
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
      this.$router.push({ name: 'record', params: {id: item.id}})
      // this.recordDialogVisible = true
      // this.recordList = item
    },
    // handleSizeChange(size) {
    //   this.$set(this.searchData, 'pageSize', size)
    //   this.getData()
    // },
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
