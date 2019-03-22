<template>
    <div id="login-container">
        <div class="login-box">
            <div class="login-title-logo">
                <img src="../../../static/img/logintitle.png" alt="">
                <h3>仓库管理系统</h3>
            </div>
            <div class="login-control-box" style="margin-top: 50px">
                <div class="login-control-title">账号</div>
                <div class="login-control-input" style="background-image: url('../../../static/img/ic_login_user.png')">
                    <input type="text" placeholder="请输入帐号" autofocus v-model="loginForm.username" maxlength="20"/>
                </div>
            </div>
            <div class="login-control-box">
                <div class="login-control-title">密码</div>
                <div class="login-control-input" style="background-image: url('../../../static/img/ic_login_password.png')">
                    <input type="password" placeholder="请输入密码" v-model="loginForm.password" maxlength="12"/>
                </div>
            </div>
            <div class="login-footer-btn" style="opacity: 0.5;cursor: not-allowed" title="请输入用户名和密码后登录" v-if="loginForm.username===''||loginForm.password===''">登录</div>
            <div class="login-footer-btn" v-else @click="submitForm">登录</div>
        </div>
    </div>
</template>
<script>
import { Message } from 'element-ui'
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    submitForm () {
      this.$store.dispatch('LoginByUsername', this.loginForm).then(res => {
        Message({
          message: res,
          type: 'success',
          duration: 5 * 1000
        })
        this.$router.push('/table')
      }).catch(err => {
        Message({
          message: err,
          type: 'error',
          duration: 5 * 1000
        })
      })
    }
  }
}
</script>
<style scoped>
    *{
        padding: 0;
        margin: 0;
        font-family: Microsoft YaHei,Arial;
        overflow: hidden;
    }
    body{
        height: 100%;
    }
    #login-container
    {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: skyblue;
        /* background-image: url("/back/img/pic_login_bg.jpg");
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat; */
    }
    .login-box
    {
        width:260px;
        height: 360px;
        background-color: white;
        border-radius: 10px;
        position: absolute;
        left: 50%;
        top: 50%;
        padding: 60px;
        transform: translate(50%,-50%);
        -ms-transform:translate(50%,-50%);
        -moz-transform:translate(50%,-50%);
        -webkit-transform: translate(50%,-50%);
        -o-transform:translate(50%,-50%);
    }
    .login-title-logo
    {
        height: 30px;
    }
    .login-title-logo img
    {
      display: inline-block;
      height: 30px;
    }
    .login-title-logo h3
    {
      display: inline-block;
    }
    .login-title-txt
    {
        font-size: 28px;
        font-weight: bold;
        margin-top: 5px;
        margin-bottom: 5px;
        color:#333;
    }
    .login-control-box
    {
        margin-bottom: 20px;
    }
    .login-control-title
    {
        line-height: 30px;
        height: 30px;
        font-size: 14px;
        color: #666;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .login-control-input
    {
        height: 30px;
        border-bottom: 1px solid #f1f1f1;
        line-height: 30px;
        position: relative;
        background-position-x: left;
        background-position-y: center;
        background-size: 20px;
        background-repeat: no-repeat;
    }
    .login-control-input input
    {
        width: calc(100% - 40px);
        height: 100%;
        border: none;
        outline: none;
        position: absolute;
        left: 40px;
        right: 0;
        top: 0;
        bottom: 0;
    }
    .login-footer-btn
    {
        margin-top: 60px;
        background-color: #5397F5;
        height: 40px;
        border-radius: 20px;
        color: #fff;
        text-align: center;
        line-height: 40px;
        font-size: 16px;
        -moz-box-shadow: 0 5px 10px #74b1f8;
        box-shadow: 0 5px 10px #74b1f8;
        cursor: pointer;
    }

</style>
