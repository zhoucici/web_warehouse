<template>
  <div>
    <el-breadcrumb style="margin-bottom: 10px;" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="dt-filter-box">
        <div class="dt-filter-left">
            <el-form :inline="true" size="mini">
                <el-form-item>
                    <el-button @click="abc()"  type="warning" icon="el-icon-edit">修改状态</el-button>
                </el-form-item>
            </el-form>

        </div>
        <div class="dt-filter-right">
            <el-form :inline="true" size="mini">
                <el-form-item>
                    <el-input size="mini" v-model="keywords" placeholder="品名/姓名/管理者" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="dtc-search" @click="search()" type="primary" icon="el-icon-search">搜索</el-button>
                    <el-button class="dtc-search" @click="clearsearch()" type="" icon="el-icon-error">清除搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
    <el-table
    v-loading='loading'
            :data="tableDatalist"
            size="mini"
            >
        <el-table-column
                prop="realName"
                label="用户名"
                width="100">
        </el-table-column>
        <el-table-column
                prop="realName"
                label="使用者"
                width="100">
        </el-table-column>
        <el-table-column
                prop="userPhone"
                label="电话"
                width="120px">
        </el-table-column>
        <el-table-column
                prop="groupName"
                label="所属部门"
        >
        </el-table-column>
        <el-table-column
                prop="groupName"
                label="权限控制"
        >
        </el-table-column>
        <el-table-column
                prop="userStatus"
                label="状态"
                width="100px">
        </el-table-column>
        <el-table-column
                type="flex"
                prop="option"
                label="操作"
                width="200px"
                >
            <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="goToDetail(scope.row.userId)">编辑</el-button>
                <el-button type="primary" size="mini" @click="goToDetail(scope.row.userId)">删除</el-button>
            </template>
        </el-table-column>

    </el-table>
  </div>
</template>
<script>
import { Message } from 'element-ui'
export default {
  data () {
    return {
        loading:false,
      ab: '',
      searchdata:'',
      searching:'',
      keywords: '',
      tableDatalist:[],  // 表格数据
      nowpage:1,
      total:0
    }
  },
  created(){
      this.getData()
  },
  methods: {
    search () {
        this.searching=this.searchdata
        this.getData(1)
    },
    clearsearch(){
        this.searching=''
        this.searchdata=''
        this.getData(1)
    },
    getData(page){
        this.loading=true
      let _data={
        page: page||this.nowpage,
        data: this.searching
        }
        this.$store.dispatch('GetUserTable', _data).then(res => {
            this.loading=false
            console.log(res);
      }).catch(err => {
      })
    }
  }
}
</script>
<style scoped>
.dt-filter-left,.dt-filter-right
{
    height: 100%;
    display: table;
}
.dt-filter-left
{
    float: left;
}
.dt-filter-right
{
  float: right;
}
</style>
