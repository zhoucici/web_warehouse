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
                    <el-button @click="" type="primary" icon="el-icon-plus">添加用户</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button @click=""  type="warning" icon="el-icon-edit">修改状态</el-button>
                </el-form-item>
            </el-form>

        </div>
        <div class="dt-filter-right">
            <el-form :inline="true" size="mini">
                <el-form-item>
                    <el-input size="mini" v-model="keywords" placeholder="品名/姓名/管理者" style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="dtc-search" @click="" type="primary" icon="el-icon-search">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
    <el-table
            ref="multipleTable"
            :data="tableData"
            size="mini"
            :fit="true"
            @selection-change="selsChange">

        <el-table-column
                width="60px"
                prop="user_name"
                label="全选"
                type="selection">
        </el-table-column>
        <el-table-column
                prop="realName"
                label="姓名"
                width="100">
            <template slot-scope="scope">
                ${scope.row.realName | noDataFormat}
            </template>
        </el-table-column>
        <el-table-column
                prop="residentId"
                label="身份证号"
                width="150">
            <template slot-scope="scope">
                ${scope.row.residentId | noDataFormat}
            </template>
        </el-table-column>
        <el-table-column
                prop="userPhone"
                label="联系电话"
                width="120px">
            <template slot-scope="scope">
                ${scope.row.userPhone | noDataFormat}
            </template>
        </el-table-column>
        <el-table-column
                prop="griddingName"
                label="所属网格"
                >
            <template slot-scope="scope">
                ${scope.row.griddingName | noDataFormat}
            </template>
        </el-table-column>
        <el-table-column
                prop="areaName"
                label="所属片区"
                >
            <template slot-scope="scope">
                ${scope.row.areaName | noDataFormat}
            </template>
        </el-table-column>
        <el-table-column
                prop="groupName"
                label="所属小组"
        >
            <template slot-scope="scope">
                ${scope.row.groupName | noDataFormat}
            </template>
        </el-table-column>
        <el-table-column
                prop="userPoint"
                label="积分"
                width="100px">
            <template slot-scope="scope">
                ${scope.row.userPoint | noDataFormat}
            </template>
        </el-table-column>
        <el-table-column
                prop="isPartyMember"
                label="是否入党"
                width="100px">
            <template slot-scope="scope">
                ${scope.row.isPartyMember | PartyFilter}
            </template>
        </el-table-column>
        <el-table-column
                prop="userStatus"
                label="状态"
                width="100px">
            <template slot-scope="scope">
                ${scope.row.userStatus | StatusFilter}
            </template>
        </el-table-column>
        <el-table-column
                prop="areaName"
                label="审核状态"
                width="100px"
        >
            <template slot-scope="scope">
                ${scope.row.villagerId | VillagerIdFilter}
            </template>
        </el-table-column>
        <el-table-column
                type="flex"
                prop="option"
                label="操作"
                width="200px"
                >
            <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="goToDetail(scope.row.userId)">详情</el-button>
                <el-button type="success" size="mini" v-if="scope.row.villagerId==-2" @click="reviewVillager(scope.row.userId,scope.row.userPhone,1)">审核成功</el-button>
                <el-button type="warning" size="mini" v-if="scope.row.villagerId==-2" @click="reviewVillager(scope.row.userId,scope.row.userPhone,0)">审核失败</el-button>
            </template>
        </el-table-column>

    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      ab: '',
      keywords: ''
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
