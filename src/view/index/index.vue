<style>
    #container-menu{
        height: 100%;
    }
    .index-container{
        height: calc( 100% - 50px );
    }
    .dtc-menu{
        height: 100%;
    }
    .el-table__row .el-button + .el-button {
        margin-left: 5px;
    }

    .dtc-menu {
        width: 180px;
        float: left;
        overflow-y: auto;
        overflow-x: hidden;
        background-color: #F8FBFC;
    }

    .el-menu {
        border-right: none;
    }

    .dtc-content {
        margin-left: 180px;
        padding: 5px 15px 15px 15px;
        overflow: auto;
    }

    .el-menu-item:hover {
        background-color: #5397F5;
    }

    .dtc-menu .el-scrollbar__wrap {
        overflow-x: hidden;
    }

    .el-submenu .el-menu-item {
        min-width: 180px !important;
    }

    .el-submenu .el-menu-item {
        height: 30px;
        line-height: 30px;
        font-size: 13px;
    }

    .el-menu-item, .el-submenu__title {
        height: 40px;
        line-height: 40px;
    }

    .el-menu-item {
        border-left: 4px solid #fff;
    }

    .el-menu-item:hover {
        border-left: 4px solid #cccccc;
        background-color: #72C4b4 !important;
        color: #ffffff !important;
    }

    .el-menu-item:hover i {
        color: #ffffff !important;
    }

    .el-menu-item.is-active {
        border-left: 4px solid #B2e0D7;
        background-color: #72C4b4 !important;
        color: #ffffff !important;
    }

    .el-submenu__title:hover {
        background-color: #72C4b4 !important;
        color: #ffffff !important;
    }

    .el-submenu__title:hover i {
        color: #ffffff !important;
    }

    .dtc-menu {
        overflow-x: hidden;
    }

    .parent-menu-title {
        color: #5397F5;
        font-weight: bold;
        font-size: 15px;
        height: 40px;
        line-height: 40px;
        text-indent: 45px;
    }

    .children-menu-item {
        height: 30px;
        line-height: 30px;
        color: #666;
        text-indent: 70px;
        font-size: 14px;
        background-size: 14px;
        background-repeat: no-repeat;
        background-position-x: 45px;
        background-position-y: center;
        border-left: 3px solid #f8f8fc;
        cursor: pointer;
    }

    .children-menu-item-active {
        color: #ffffff;
        background-color: #6cadff;
        border-left: 3px solid #B2e0D7;
    }

    .top-bar {
        padding: 0;
    }

    .dt-header {
        height: 50px;
        background-color: #F8FBFC;
    }

    .dt-header-title {
        text-align: center;
        height: 50px;
        line-height: 50px;
        padding-left: 10px;
        float: left;
        font-weight: bolder;
        background-color: #5397F5;
        width: 170px;
        color: #fff;
    }

    .dt-header-user {
        margin-left: 190px;
        padding-right: 15px;
        font-size: 12px;
        text-indent: 35px;
        background-size: 15px;
        background-position-x: 10px;
        background-position-y: center;
        background-repeat: no-repeat;
        background-image: url("../../../static/img/ic_title_notice.png");
    }

    .dt-user-name, .dt-login-out {
        line-height: 50px;
        height: 50px;
    }

    .dt-login-out {
      cursor:pointer;
        position: absolute;
        top: 0;
        right: 10px;
        width: 100px;
        text-align: 20px;
        background-size: 15px;
        background-position-x: 10px;
        background-position-y: center;
        background-repeat: no-repeat;
        background-image: url("../../../static/img/ic_title_logout.png");
    }

    .el-badge__content.is-fixed.is-dot{
        right: 15px;
        top: 50%;
    }
    .el-badge{
        display: block;
    }
</style>
<template>
  <div id="container-menu" v-cloak>
      <div class="top-bar navbar-fixed-top dt-header">
          <div class="dt-header-title">
            <h3>仓储管理系统</h3>
          </div>

          <div class="dt-header-user">
              <div class="dt-user-name" id="userName">{{_userinfo.name}}，您好<span v-if="_userinfo.admin">,您是超级管理员</span> </div>

              <div class="dt-login-out dt-button-pointer" @click="logoutshow=true">&nbsp;退出登录</div>
          </div>
      </div>

      <div class="index-container">
          <div class="dtc-menu">
              <el-scrollbar style="height: 100%">
                  <div class="parent-menu" v-for="(item,index) in tableData" :key="index">
                      <div class="parent-menu-title">{{item.menuName}}</div>
                      <div class="children-menu" v-for="(child,index) in item.childMenuList" :key="index" @click="chooseMenu(child.menuId,child.menuIcon)">
                          <div class="children-menu-item children-menu-item-active"
                              v-if="currentMenuId===child.menuId"
                              v-bind:style="{backgroundImage:'url(../../../static/img/' + child.menuIcon + '_h.png)'}"
                          >
                              <span>{{child.menuName}}</span>
                          </div>
                          <div class="children-menu-item"
                              v-else
                              v-bind:style="{backgroundImage:'url(../../../static/img/' + child.menuIcon + '.png)'}"
                          >
                              <span>{{child.menuName}}</span>
                          </div>
                      </div>
                  </div>
              </el-scrollbar>

          </div>
          <z-windowPop 
            btnClass="danger"
            savetext="确定"
            :btnshow="true"
            title="退出系统"
            @confirm="backLoginOut()"
            width='454px'
            v-model="logoutshow">
            <div class="reset">
                <img src="../../assets/img/warn_icon.svg">
                <div>您确定要退出吗</div>
            </div>
        </z-windowPop>
          <div class="dtc-content">
            <keep-alive>
              <router-view></router-view>
            </keep-alive>
          </div>
      </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      logoutshow:false,
      currentMenuId: '',
      tableData: [
        {
          menuName: '用户管理',
          childMenuList: [
            {
              menuName: '用户管理',
              menuId: 101,
              menuIcon: 'person'
            },
            {
              menuName: '添加用户',
              menuId: 102,
              menuIcon: 'addperson'
            }
          ]
        },
        {
          menuName: '仓库管理',
          childMenuList: [
            {
              menuName: '库存查询',
              menuId: 201,
              menuIcon: 'Stock'
            },
            {
              menuName: '出入记录',
              menuId: 202,
              menuIcon: 'record'
            }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['_userinfo'])
  },
  watch:{
    "$route"(to){
        this.menuChange(to);
			}
  },
  created(){
			this.menuChange(this.$route);
		},
  mounted () {
    // $('.dtc-menu').css('height', ($(window).height() - 50) + 'px')
    // $('.dtc-content').css('height', ($(window).height() - 80) + 'px')
  },
  methods: {
    backLoginOut(){
      this.$store.dispatch('Logout')
      this.$router.push('/login')
    },
    menuChange(route){
        let pathArr = route.fullPath.substring(1).split("/").map(str=>str.split('?')[0]);
        switch (pathArr[0]){
          case 'person':
          this.currentMenuId=101;
          break;
          case 'addperson':
          this.currentMenuId=102;
          break;
          case 'Stock':
          this.currentMenuId=201;
          break;
          case 'record':
          this.currentMenuId=202;
          break;
        }
        
    },
    chooseMenu (subMenuId, menuurl) {
      if (menuurl === '' || menuurl === '#') {
        this.$message.warning('功能建设中')
      } else {
        this.currentMenuId = subMenuId
        this.$router.push('/' + menuurl)
      }
    }
  }
}
</script>
<style lang='less' scoped>
.logintext{
  text-align: center;
  height: 100px;
  line-height: 100px;
}

</style>
