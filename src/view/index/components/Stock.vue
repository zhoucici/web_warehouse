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
        <el-form-item class="add">
          <el-button type="primary" size="small" @click="addGoods1">添加物品</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table
        :data="goodsData.list"
        size="mini"
        cell-class-name='cellclass'>
          <el-table-column prop="name" label="物品名"></el-table-column>
          <el-table-column prop="id" label="物品编号"></el-table-column>
          <el-table-column prop="belongto" label="所属部门"></el-table-column>
          <el-table-column prop="user" label="管理者"></el-table-column>
          <el-table-column label="出入记录">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                class="tablebtn"
                @click="checkRecord(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="num" label="目前库存"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                class="tablebtn"
                @click="intoWarehouse(scope.$index, scope.row)">入仓</el-button>
              <el-button
                v-if="scope.row.num"
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
      @current-change="handleCurrentChange"
      :current-page="goodsData.currentPage"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, prev, pager, next, jumper"
      :total="goodsData.total">
    </el-pagination>
    <el-dialog
      :title="title"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      width="30%">
        <el-form ref="form" :model="goodsDetail" :rules="rules" label-width="80px" style="width:360px;">
          <el-form-item label="物品名" prop="name">
              <el-input size="mini" v-model="goodsDetail.name" placeholder="请输入物品名称"></el-input>
          </el-form-item>
          <!-- <el-form-item label="物品编号" prop="id">
              <el-input size="mini" :disabled="!isAdd" v-model="goodsDetail.id" placeholder="请输入物品编号"></el-input>
          </el-form-item> -->
          <el-form-item label="管理者" prop="user">
            <el-select v-model="goodsDetail.user" @change="changeUser" placeholder="请选择">
              <el-option
                v-for="item in userList.data"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
           </el-form-item>
          <el-form-item label="所属部门" prop="belongto">
              <el-input size="mini" disabled v-model="goodsDetail.belongto" placeholder="请输入所属部门"></el-input>
          </el-form-item>
          <!-- <el-form-item label="管理者" prop="user">
              <el-input size="mini" v-model="goodsDetail.user" placeholder="请输入管理者"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="目前库存" prop="num">
              <el-input size="mini" v-model="goodsDetail.num" placeholder="请输入目前库存"></el-input>
          </el-form-item> -->
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="execute">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="typeName"
      v-if="intoDialogVisible"
      :visible.sync="intoDialogVisible"
      width="30%">
      <el-form ref="form" :model="outOrIn" label-width="80px" style="width:360px;">
        <el-form-item :label="typeName" prop="name">
            <el-input size="mini" v-model="outOrIn.num" placeholder="请输入数量"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button @click="intoDialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleOutOrIn">确 定</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { getGoods, addGoods, delGoodsById, editGoodsById ,outInto } from '@/api/goods'
import { getUserTable} from '@/api/user'
export default {
  data () {
    return {
      dialogVisible: false,
      // 物品入仓
      intoDialogVisible: false,
      outOrIn: {
        type: 0, // 0入仓,1出仓
        num: 0,
        id: 0
      },
      // 出入记录列表
      // recordList: [],
      isAdd: true,
      // 查询条件
      searchData: {
        search: '',
        currentPage: 1,
        sys: this.$store.getters._userinfo.sys
      },
      // 用户列表
      userList: {},
      // 记录列表
      goodsData: {},
      // 单个记录详情
      goodsDetail: {
        name: '',
        // id: '',
        belongto: '',
        user: '',
        sys: this.$store.getters._userinfo.sys
      },
       rules: {
        name:  { required: true, message: '请输入物品名称', trigger: 'blur' },
        id:  { required: true, message: '请输入物品编号', trigger: 'blur' },
        belongto:  { required: true, message: '请输入所属部门', trigger: 'blur' },
        user:  { required: true, message: '请输入管理者', trigger: 'blur' },
        num:  { required: true, message: '请输入目前库存', trigger: 'blur' }
      }
    }
  },
  created(){
    this.getData()
    this.getUserList()
  },
  computed: {
    title() {
      if(this.isAdd) {
        return "添加"
      } else {
        return "编辑"
      }
    },
    typeName() {
      if(this.outOrIn.type === 0) {
        return "入仓操作"
      } else {
        return "出仓操作"
      }
    }
  },
  methods: {
    // 获取数据
    getData() {
      // console.log(this.$store.getters._userinfo.sys)
      getGoods(this.searchData).then(res => {
        console.log(res.data)
        this.goodsData = res.data
      })
    },
    // 获取用户列表
    getUserList() {
      getUserTable(1,'',10000).then(res => {
        this.userList = res.data
      })
    },
    // 改变用户
    changeUser (val) {
      this.userList.data.map((item) => {
         if(item.name === val) {
           this.goodsDetail.belongto = item.belongto
         }
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
    // 入仓操作
    intoWarehouse(index, item) {
      this.outOrIn = {
        type: 0,
        num: 0,
        id: item.id
      }
      this.intoDialogVisible = true
    },
    handleOutOrIn() {
      // console.log(typeof this.outOrIn.num)
      this.outOrIn.num = Number(this.outOrIn.num)
      outInto(this.outOrIn).then((res) =>{
        if(res.data.code === 1) {
          this.$message.success(res.data.res_data)
        } else if(res.data.code === 0) {
          this.$message.warning(res.data.res_data)
        }
        this.intoDialogVisible = false
        this.getData()
      })
    },
    // 出仓操作
    outWarehouse(index, item) {
      this.outOrIn = {
        type: 1,
        num: 0,
        id: item.id
      }
      this.intoDialogVisible = true
    },
    // 添加物品
    addGoods1() {
      this.goodsDetail = {
        name: '',
        // id: '',
        belongto: '',
        user: '',
        sys: this.$store.getters._userinfo.sys
      },
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
            console.log(this.goodsDetail)
            addGoods(this.goodsDetail).then(() => {
              if(res.data.code === 1) {
                this.$message.success(res.data.res_data)
              } else if(res.data.code === 0) {
                this.$message.warning(res.data.res_data)
              }
              this.getData()
              this.dialogVisible = false
            })
          } else {
            editGoodsById(this.goodsDetail.id, this.goodsDetail).then((res) => {
              if(res.data.code === 1) {
                this.$message.success(res.data.res_data)
              } else if(res.data.code === 0) {
                this.$message.warning(res.data.res_data)
              }
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
      this.$confirm('此操作将永久删除该物品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        delGoodsById(item.id).then((res) => {
          if(res.data.code === 1) {
              this.$message.success(res.data.res_data)
            } else if(res.data.code === 0) {
              this.$message.warning(res.data.res_data)
            }
          this.getData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
