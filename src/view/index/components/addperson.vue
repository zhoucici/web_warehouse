<template>
    <div>
        <el-breadcrumb style="margin-bottom: 10px;" separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加用户</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form ref="form" :model="form" label-width="80px" style="width:500px;">
            <el-form-item label="账号">
                <el-input size="mini" v-model="form.userId" placeholder="请输入字母和数字"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input size="mini" v-model="form.pwd" placeholder="请输入字母和数字"></el-input>
            </el-form-item>
            <el-form-item label="使用者">
                <el-input size="mini" v-model="form.name" placeholder="请输入使用者"></el-input>
            </el-form-item>
            <el-form-item label="电话">
                <el-input size="mini" v-model="form.phone" placeholder="请输入数字"></el-input>
            </el-form-item>
            <el-form-item label="所属部门" >
                <el-input size="mini" v-model="form.belongto" placeholder="请输入所属部门"></el-input>
            </el-form-item>
            <el-form-item label="权限配置">
                <el-checkbox-group v-model="form.quanx">
                <el-checkbox label="1" >添加库存</el-checkbox>
                <el-checkbox label="2" >入库</el-checkbox>
                <el-checkbox label="3" >出库</el-checkbox>
                <el-checkbox label="4" >查看记录</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="form.state">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">禁用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button  @click="clear">取消</el-button>
            </el-form-item>
            </el-form>
    </div>
</template>
<script>
export default {
    data() {
      return {
        form: {
          userId: '',
          pwd: '',
          name: '',
          phone: '',
          belongto: '',
          quanx: [],
          state:''
        }
      }
    },
    methods: {
      onSubmit() {
          if(!this.form.userId||!this.form.pwd||!this.form.name||!this.form.phone||!this.form.belongto||!this.form.state){
              this.$message.error('有选项为空')
          }else{
              let data=JSON.parse(JSON.stringify(this.form))
        
        this.$store.dispatch('Addperson',data)
        .then(res=>{
        if(res.data.code=0){
            this,$message.error('该账号已经存在')
        }else{
            this.$message.success('添加成功')
        }
        })
          }
          
      },
      clear(){
          this.form={}
      }
    }
}
</script>
<style lang="less" scoped>

</style>

