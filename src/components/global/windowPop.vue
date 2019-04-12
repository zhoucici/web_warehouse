<template>
    <transition name="pop">
        <div class="big-pop" 
            ref="big"
            v-show="show_flag" 
            v-if="render_flag" 
            @click.self="()=>{if(bgClose){close()}}"
            :class="{'black-bg':black}">

            <div class="main" :style="{height:height,width:width,top:top}" ref="main">
                <div class="title" v-if='!noTitle'>
                    <div class="text" :title="tip?title:''">{{ title | titleLimit }}</div>
                    <slot name="tab-title"></slot>
                    <!-- <img  class='close' @click="close" src="~assets/image/back-close.svg"> -->
                    <i  @click="close" class="close el-icon-close"></i>
                </div>
                <z-scrollDiv class="wrap" ref='wrap'>
                    <slot></slot>
                    <div class="pop-btns" v-if="!noBtns">
                        <div class="z-btn" :class="btnClass" v-if="btnshow" @click="save">{{ savetext }}</div>
                        <div class="z-btn" @click="close">{{ canceltext }}</div>
                    </div>
                </z-scrollDiv>
            </div>

        </div>
    </transition>
</template>

<script>
    export default {
        // props:["black","height","noBtns","show","title","savetext","canceltext","btnshow"],
        model: {
            prop: 'show',
            event: 'change'
        },
        props:{
            show:{  //弹窗控制
                type:Boolean, 
                default:undefined,
            },
            render:{
                type:Boolean,
                default:undefined,
            },
            title:{  //弹窗标题
                type:String,
            },
            // 点击背景关闭弹窗 
            bgClose:{
                type:Boolean,
                default:true,
            },
            // 是否一直展示  不会被内部机制关闭
            always:{
                type:Boolean,
                default:false,
            },

            // ****功能按钮
            noTitle:{
                type:Boolean,
                default:false,
            },
            noBtns:{  //不显示控制按钮
                type:Boolean, 
                default:false,
            },
            btnshow:{   //保存———功能按钮显示
                type:Boolean,
                default:false,
            },
            savetext:{   //保存按钮文本
                type:String,
                default:"保存",
            },
            canceltext:{  //取消按钮文本
                type:String,
                default:"取消",
            },

            // *****样式

            black:{   //黑色背景遮罩
                type:Boolean,
                default:false,
            },
            //main 部分距离顶部高度
            top:{
                type:String,
                default:'40%'
            },
            tip:{
                type:Boolean,
                default:false,
            },
            height:{  //主体高度  默认不做限制
                type:String,
                default:"auto",
            },
            width:{  //主体宽度  默认不做限制
                type:String,
                default:"auto",
            },
            btnClass:{
                type:String,
                default:'normal',
            }
        },

        data(){
            return {
                auto_flag:this.height == 'auto',  // 初始值为auto默认
            }
        },
        computed:{
            render_flag(){
                if(this.render === undefined) return true;
                return this.render;
            },
            show_flag(){
                if(this.show === undefined) return this.render;
                return this.show;
            },
            always_flag(){
                return this.always !== false;
            },
            calc_height(){
                return this.$refs['main'] && this.show
                    ?Math.floor(this.$refs['main'].clientHeight) + 'px'
                    :this.height
                        
            }
        },

        filters:{
            titleLimit(str = ''){
                let num = 20;
                if(str.length > 20){
                    str = str.substr(0,17)+'...';
                }
                return str;
            },
        },
        // computed:{
        //     saveText(){
        //         return this.savetext || "保存";
        //     },
        //     cancelText(){
        //         return this.canceltext || "取消";
        //     },
        //     calc_height(){
        //         return this.height || "auto";  
        //     },
        // },

        watch:{
            // 监听最高级别判断
            "$store.state.Call.calling"(val){
                if(val && this.always_flag != true){
                    this.close();
                }
            },
            show(val){
                if(val){
                    // 归正高度 防止模糊
                    requestAnimationFrame(()=>{
                        let num = this.$refs['big'].clientHeight*0.8;
                        if(this.auto_flag || parseInt(num) != num || num%2 != 0 ){
                            num = Math.floor(num);
                            this.$refs['main'].style['max-height'] = num % 2 == 0
                                ?num + 'px'
                                :num - 1 + 'px'
                        }

                        if(this.auto_flag){ // 默认auto  则每次需要重新计算
                            let mainH =  Math.floor(this.$refs['main'].clientHeight);
                            // console.log('mainH',mainH)
                            this.$refs['main'].style['height'] = mainH % 2 == 0
                                ?mainH + 'px'
                                :mainH - 1 + 'px'
                        }
                    })

                    if(this.noTitle){
                        // let $main = this.$refs.main;
                        requestAnimationFrame(()=>{
                            // $main.style.height = $main.clientHeight + 'px'
                            this.$refs.wrap.$el.style['max-height'] = '100%';
                        })
                    }
                }

                if(val == false){
                    this.$refs.wrap.zero();
                    this.$emit("cancel");         // 后续
                    if(this.auto_flag){
                        this.$refs['main'].style['height'] = 'auto';
                    }
                }
            },
        },

        methods:{
            //关弹窗
            close(){  
                this.$emit("change",false);   // 关
            }, 
            //保存/确认
            save(){  
                this.$emit("confirm");
            }
        },
    }
</script>

<style lang="less">
    @title_h:50px;

    .big-pop{
        position: fixed;
        width:100%;
        height: 100%;
        left: 0;
        top:0;
        background:rgba(246,249,253,0.85);
        
        z-index:30;
        // filter: blur(2px);
        // &:before{
        //     content:"";
        //     display:block;
        //     position: absolute;
        //     width:100%;
        //     height: 100%;
        //     top:0;
        //     left:0;
        //     // background:rgba(255,255,255,0.6);
        // }
        

        // 主体部分
        >.main{
            // box-shadow: 0 4px 15px 0 #adadad;
            // box-shadow:0px 2px 4px 0px rgba(167,191,214,0.3);
            box-shadow:0px 4px 6px 0px rgba(0,0,0,0.2);
            min-width:300px;
            max-height:80%;
            background:#fff;
            position: absolute;
            top:40%;
            left: 50%;
            transform: translate(-50%,-50%);

            
            // 标题
            >.title{
                position: relative;
                height: @title_h;
                line-height:@title_h;
                box-sizing:border-box;
                padding-left: 20px;
                .text{
                    font-size: 16px;
                    font-weight:600;
                    float: left;
                }
                .close{
                    position: absolute;
                    top:50%;
                    right:10px;
                    // right: 30px;
                    transform: translateY(-50%);
                    cursor:pointer;
                    padding: 5px;
                    font-size: 20px;
                    color:#D7D8D9;
                }

                // tab  头
                &>div:nth-of-type(2){
                    display:inline-block;
                    // margin-left: 60px;
                    margin-bottom: 0;
                    position: relative;
                    &:after{
                        content:"";
                        display: block;
                        clear: both;
                    }
                    // >div{
                    //     float: left;
                    //     color:#929292;
                    //     font-size:12px;
                    //     line-height: @title_h - 2px;
                    //     transition:0.3s;
                    //     cursor:pointer;
                    //     box-sizing: border-box;
                    //     border-bottom: 2px solid transparent;
                    //     &+div{
                    //         margin-left: 30px;
                    //     }
                    //     &:hover{
                    //         color:@g_black;
                    //     }
                    //     &.active{
                    //         color:@g_black;
                    //         border-bottom: 2px solid @g_blue;
                    //     }
                    // }
                }

                .clear();

            }

            // slot包裹
            >.wrap{
                max-height:calc(~"100% - @{title_h}");
                &:after{
                    content: "";
                    display: block;
                    clear:both;
                }
                
                // 按钮组
                .pop-btns{
                    padding:20px;
                    text-align: right;
                    .z-btn{
                        display:inline-block;
                        &+.z-btn{
                            margin-left:10px;
                        }
                    }
                }

            }

            // // 按钮组
            // >.btns{
            //     padding:20px;
            //     text-align: right;
            //     .z-btn{
            //         display:inline-block;
            //         &+.z-btn{
            //             margin-left:10px;
            //         }
            //     }
            // }

        }

        &.black-bg{
            background:rgba(0,0,0,0.4);
            .main{
                box-shadow: 0px 4px 6px 0px rgba(0,0,0,0.2)
            }
        }
    }

    .pop-enter-active,
    .pop-leave-active {
        transition: .4s;
    }

    .pop-enter,
    .pop-leave-active {
        opacity: 0;
        // transform: translateY(10px);
        // margin-top:10px;
    }
</style>

