<template>
<div class="z-pagination">
    <el-pagination
      @size-change="newSize"
      @current-change="newPage"
      :current-page="now_page"
      :page-size="10"
      background
      layout='->,total,jumper, prev,pager,next'
      :total="this.total">
    </el-pagination>
</div>
    
</template>
<script>
export default {
    data(){
        return{
            aaa:1,
            pagelist:[1,2,3],
        }
    },
    props:{
        total:Number,
        "current-page":{
            type:Number,
            default:1,
            },
    },
    computed:{
        now_page(){
            return this.currentPage;
        }
    },
    methods:{
        newSize(size){
            this.$emit('sizeChange',size);
        },
        newPage(page){
            this.$emit("pageChange",page)
        },
        selectionChange(selection){
            this.$emit('selection-change',selection);
        },
    }
}
</script>
<style lang="less" scoped>
.el-pagination{
    margin-top: 5px;
    padding-right: 20px;
    
}
</style>
