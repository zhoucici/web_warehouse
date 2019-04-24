<template>
  <div>
    <el-breadcrumb style="margin-bottom: 10px;" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
        <el-breadcrumb-item>库存管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="dt-filter-box">
        <div class="dt-filter-left">
            <el-form :inline="true" size="mini">
                <el-form-item>
                    <el-input size="mini" v-model="searchdata" placeholder="用户名/姓名/管理者" style="width: 180px;"></el-input>
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
            cell-class-name='cellclass'
            >
        <el-table-column
                prop="userId"
                label="用户名"
                >
        </el-table-column>
        <el-table-column
                label="密码"
                >
                <template slot-scope="scope">
                    <div>{{scope.row.pwd}}</div>
                    
                </template>
        </el-table-column>
        <el-table-column
                prop="name"
                label="使用者"
                >
        </el-table-column>
        <el-table-column
                prop="phone"
                label="电话"
                >
        </el-table-column>
        <el-table-column
                prop="belongto"
                label="所属部门"
        >
        </el-table-column>
        <el-table-column
                label="状态"
                >
                <template slot-scope="scope">
                    <el-tag class="tabletag" v-if="scope.row.state==1" type="success">启用状态</el-tag>
                    <el-tag class="tabletag" v-else type="warning">停用状态</el-tag>
                </template>
        </el-table-column>
        <el-table-column
                type="flex"
                prop="option"
                label="操作"
                
                >
            <template slot-scope="scope">
                <el-button class="tablebtn" type="primary" size="mini" @click="editopen(scope.row)">编辑</el-button>
                <el-button class="tablebtn" type="danger" size="mini" @click="delopen(scope.row)">删除</el-button>
            </template>
        </el-table-column>

    </el-table>
    <z-windowPop 
            btnClass="danger"
            savetext="确定"
            :btnshow="true"
            title="确定删除"
            @confirm="deleteuser()"
            width='454px'
            v-model="delshow">
            <div class="reset">
                <img src="@/assets/img/warn_icon.svg">
                <div>您确定要删除<b>{{deluser.userId}}</b>吗</div>
            </div>
        </z-windowPop>

        <z-windowPop
            v-model="editshow"
            width='500px'
            :black='true'
            :btnshow='true'
            @confirm="edituser()"
            top='50%'
            title="修改信息"
            >
            <div class="popmain">
                <div class="popitem">
                    <div class="poptitle">
                        *使用者：
                    </div>
                    <div class="popinput">
                        <el-input 
                            size="mini"
                            v-model="deluser.name" 
                            placeholder="请写入使用者" 
                            >
                        </el-input>
                    </div>
                </div>
                <div class="popitem">
                    <div class="poptitle">
                        电话：
                    </div>
                    <div class="popinput">
                        <el-input 
                            size="mini"
                            v-model="deluser.phone" 
                            placeholder="请写入电话" 
                            >
                        </el-input>
                    </div>
                </div>
                <div class="popitem">
                    <div class="poptitle">
                        所属部门：
                    </div>
                    <div class="popinput">
                        <el-input 
                            size="mini"
                            v-model="deluser.belongto" 
                            placeholder="请写入所属部门" 
                            >
                        </el-input>
                    </div>
                </div>
                <div class="popitem">
                    <div class="poptitle">
                        密码：
                    </div>
                    <div class="popinput">
                        <el-input 
                            size="mini"
                            v-model="deluser.pwd" 
                            placeholder="请写入密码" 
                            >
                        </el-input>
                    </div>
                </div>
                <div class="popitem">
                    <div class="poptitle">
                        状态：
                    </div>
                    <div class="popinput">
                        <el-radio-group :disabled='this.deluser.admin==1' v-model="deluser.state">
                            <el-radio :label="1">启用</el-radio>
                            <el-radio :label="0">禁用</el-radio>
                        </el-radio-group>
                    </div>
                </div>
                <div class="popitem">
                    <div class="poptitle">
                        权限配置：
                    </div>
                    <div class="popinput">
                        <el-checkbox-group 
                            v-model="deluser.quanx"
                            >
                            <el-checkbox  label="1">添加库存</el-checkbox>
                            <el-checkbox  label="2">入库</el-checkbox>
                            <el-checkbox  label="3">出库</el-checkbox>
                            <el-checkbox  label="4">查看记录</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
                
            </div>
        </z-windowPop>
  </div>
</template>
<script>
import { Message } from 'element-ui'

export default {
  data () {
    return {
        editshow:false,
        delshow:false,
        loading:false,
      ab: '',
      searchdata:'',
      searching:'',
      tableDatalist:[],  // 表格数据
      nowpage:1,
      total:0,
      deluser:'',
    }
  },
  created(){
      this.getData()
  },
  computed:{
      isadmin(){
          return this.$store.getters.isadmin
      },
  },
  methods: {
      config(val){
          console.log(val);
          
      },
    search () {
        this.searching=this.searchdata
        this.getData(1)
    },
    delopen(val){
        if(val.id==this.$store.getters.user._userinfo.id){
            this.$message.error('请不要删除自己！')
        }else if(val.admin){
            this.$message.error('不能删除主账号！')
        }else{
            this.deluser=val
        this.delshow=true
        }
    },
    editopen(val){
        if(val.admin==1 && this.isadmin!=val.admin){
            this.$message.error('您没有权限编辑主账号！')
        }else{
            this.editshow=true
            this.deluser=JSON.parse(JSON.stringify(val))
        }
    },
    edituser(){
        console.log(this.deluser);
        
        this.$store.dispatch('Edituser',this.deluser)
        .then(res=>{
            this.$message.success('修改成功')
            this.$store.dispatch('Getuserinfo',this.$store.getters.user._userinfo.id)
            this.getData()
        })
        .catch(err=>{
            console.log(err);
            
            this.$message.error('修改失败')
        })
        this.editshow=false
    },
    deleteuser(){
        this.$store.dispatch('Deleteuser',this.deluser.id)
        .then(res=>{
            console.log(res);
            this.$message.success('删除成功')
            this.delshow=false
            this.getData()
        })
        .catch(res=>{
            this.$message.error('删除失败')
            this.getData()
        })
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
            this.tableDatalist=res.data.data
            this.loading=false
            if(page){
                this.$message.success('查询成功')
            }
      }).catch(err => {
          this.loading=false
      })
    }
  }
}
</script>
<style lang='less' scoped>
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
.cell{
    text-align: center !important;
}
.popmain{
        padding:12px 24px 0px;
        .popitem{
            padding: 8px 0px;
            .poptitle{
                display: inline-block;
                text-align: right;
                width: 20%;
            }
            .popinput{
                display: inline-block;
                width:75%;
            }
        }
    }
</style>
