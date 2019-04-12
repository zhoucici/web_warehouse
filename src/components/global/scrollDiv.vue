<template>
	<div class="z-scrollDiv" ref="all_wrap"  @mouseenter="barRender">
		<div class="z-scroll-main" ref="scroll" :style="{transform:`translate3d(${X_position}px,${Y_position}px,0)`}">
		<!-- <div class="z-scroll-main" ref="scroll" :style="{left:`${X_position}px`,top:`${Y_position}px`}"> -->
			<slot></slot>
		</div>
		<!-- 滚动条 -->
		<div class="z-scroll-bar y" ref="Y_bar">
			<div v-show="bar.Y.show"  :style="{height:`${bar.Y.size}px`,transform:`translate3d(0,${bar.Y.number}px,0)`}"></div>
		</div>
		<div class="z-scroll-bar x" ref="X_bar">
			<div v-show="bar.X.show"  :style="{width:`${bar.X.size}px`,transform:`translate3d(${bar.X.number}px,0,0)`}"></div>
		</div>
		<!-- 遮罩 -->
		<div class="z-cover" v-show="dragFlag"></div>
	</div>
</template>

<script>
    export default {
		props:{
			// 滚轮滚动一次位移的距离
			speed:{   
				type:Number,
			},
			// 动画函数
			animate:{
				type:String,
			},
			// 启用X方向滚动
			xbar:{
				type:Boolean,
				default:false,
			}
		},
		data(){
			return {
				dragFlag:false,   //拖动状态判断
				drag_bar:'Y',     //触发拖动的bar

				// **** 滚动条数据
				minSize:20,  //px   滚动条最小长度
				bar:{
					Y:{
						size:0,  //px   Y滚动条高度
						show:false,
						number:0,	//位置
					},
					X:{
						size:0,  //px   X滚动条宽度
						show:false,
						number:0,   //位置
					},
				},

				// *** 动画效果
				// * t: current time（当前时间）；
				// * b: beginning value（初始值）；
				// * c: change in value（变化量）；
				// * d: duration（持续时间）。
				Tween:{
					Linear: function(t, b, c, d) { 
						return c * t / d + b; 
					},
					Quad: {
						easeIn: function(t, b, c, d) {
							return c * (t /= d) * t + b;
						},
						easeOut: function(t, b, c, d) {
							return -c *(t /= d)*(t-2) + b;
						},
						easeInOut: function(t, b, c, d) {
							if ((t /= d / 2) < 1) return c / 2 * t * t + b;
							return -c / 2 * ((--t) * (t-2) - 1) + b;
						}
					},
				},
				

			}
		},
		computed:{
			// **** 配置
			//每次滚轮的触发的移动距离
			scrollSpeed(){ 
				if(typeof this.speed == 'number'){
					return this.speed;
				}else{
					return 60;
				}
			}, 
			// 动画函数
			choose_animate(){
				if(this.Tween[this.animate]){
					return this.Tween[this.animate]
				}else{
					return this.Tween.Quad.easeOut;
				}
			},


			// **** 计算数据
			// Y滚动条可以滚动的距离
			Y_barRange(){
				let wrap = this.$refs.all_wrap;
				if(wrap){
					return wrap.clientHeight - this.bar.Y.size;
				}
			},
			// X滚动条可以滚动的距离
			X_barRange(){
				let wrap = this.$refs.all_wrap;
				if(wrap){
					return wrap.clientWidth - this.bar.X.size;
				}
			},

			// 内容块位置
			// Y内容块
			Y_position(){
				// 无滚动 不计算  
				if(!this.bar['Y'].show || !this.$refs.scroll){
					return 0;
				}
				return this.calc_position();
			},
			// X内容块
			X_position(){
				// 无滚动 不计算  
				if(!this.bar['X'].show || !this.$refs.scroll){
					return 0;
				}
				return this.calc_position('X');
			},

		},

		mounted(){
			this.init();
		},

		methods:{
			// ******** 初始化
			init(){
				// 处理兼容
				if (!window.requestAnimationFrame) {
					requestAnimationFrame = function(fn) {
						setTimeout(fn, 17);
					};	
				}

				// 数据初始化
				this.style_init();

				// 渲染滚动条
				this.barRender();

				// 绑定事件
				this.bindEvent();
				
			},

			// ******* 数据初始化
			// 检测padding 提供给组件
			style_init(){
				let wrap = this.$refs.all_wrap;
				let main = this.$refs.scroll;

				// 移植padding
				let padd_top = this.getStyle(wrap,'padding-top');
				let padd_right = this.getStyle(wrap,'padding-right');
				let padd_bottom = this.getStyle(wrap,'padding-bottom');
				let padd_left = this.getStyle(wrap,'padding-left');
				wrap.style['padding'] = 0;
				main.style['padding'] = `${padd_top} ${padd_right} ${padd_bottom} ${padd_left}`;
			},


			// ******* 事件绑定
			bindEvent(){
				this.clickEvent();
				this.dragEvent();
				this.scrollEvent();
			},
			// 滚轮事件
			scrollEvent(){
				let main = this.$refs.scroll;
				let keyStr = (document.mozFullScreen !== undefined)?"DOMMouseScroll":"mousewheel";

				main.addEventListener(keyStr,(e)=>{
					this.$emit("scroll");  // 暴露的事件
					e = this.eventFilter(e);
					if(this.bar.Y.show){
						this.scrollCalc('Y',e.direction*this.scrollSpeed,20)
						// this.ani_scroll('Y',this.bar.Y.number + e.direction*this.scrollSpeed,20)
						e.preventDefault();
						e.stopPropagation();
					}else if(this.bar.X.show){
						this.scrollCalc('X',e.direction*this.scrollSpeed,20)
						// this.ani_scroll('X',this.bar.X.number + e.direction*this.scrollSpeed,20)
						e.preventDefault();
						e.stopPropagation();
					}
				});
			},
			eventFilter(e){  //过滤事件对象
				e = e || window.event;
				if(e.type === "mousewheel"){
					e.direction = e.wheelDelta<0?1:-1;
				}else if(e.type === "DOMMouseScroll"){
					e.direction = e.detail>0?1:-1;
				}
				return e;
			},
			// 拖拽事件
			dragEvent(){
				let wrap = this.$refs.all_wrap;
				let main = this.$refs.scroll;

				let last = {
					X:0,
					Y:0
				};

				wrap.addEventListener('mousemove',(e)=>{
					e = e || window.event;

					if(this.dragFlag){
						let key = this.drag_bar;
						last[key] = last[key] || e[`client${key}`];

						let cha = e[`client${key}`] - last[key];
						last[key] = e[`client${key}`];

						this.barNumberRender(key,this.bar[key].number + cha);
					}
				});

				wrap.addEventListener('mouseup',(e)=>{
					e = e || window.event;
					if(this.dragFlag == true){
						last[this.drag_bar] = 0;
						this.dragFlag = false;
					}
				});
			},
			// 点击事件
			clickEvent(){
				let wrap = this.$refs.all_wrap;
				let y_bar = this.$refs.Y_bar;
				let x_bar = this.$refs.X_bar;
				
				y_bar.addEventListener('mousedown',(e)=>{
					this.mouseDown(e,y_bar,'Y')
				})
				x_bar.addEventListener('mousedown',(e)=>{
					this.mouseDown(e,x_bar,'X')
				})
			},
			mouseDown(e,el,key = 'Y'){
				e = e || window.event;
				let target = e[`client${key}`] - this.getOrigin(el,key);
				let size = this.bar[key].size;
				let number = this.bar[key].number;

				// 点击到滚动条
				if(target >= number && target <= number + size){
					if(this.bar[key].show){
						this.drag_bar = key;
						this.dragFlag = true;
					}
				}else{
					if(target < number){
						size = 0;
					}
					this.ani_scroll(key,target - size,25)
				}
			},


			// *** 属性渲染器  滚动条位置，长度，宽度渲染
			//滚动条渲染
			barRender(){   
				// 无dom不需要进行渲染
				if(!this.$refs.scroll){
					return;
				}

				// 更新滚动条长度
				this.barSizeRender();
				this.barSizeRender("X");

				// 更新滚动条位置
				this.barNumberRender();
				this.barNumberRender('X');
			},
			// 滚动条长度渲染
			// * key  'X,Y' (可省略，默认Y)
			// * wrap_size  容器尺寸
			// * main_size  内容尺寸
			barSizeRender(...arg){
				let key = 'Y',wrap_size,main_size;
				let word = "Height";

				// 处理参数
				let hasKey = this.hasKeyJudge(arg);
				if(hasKey){
					if(key != arg[0]){
						key = 'X';
						word = "Width"
					}

					wrap_size = arg[1] || this.$refs.all_wrap[`client${word}`];
					main_size = arg[2] || this.$refs.scroll[`scroll${word}`];
				}else{
					wrap_size = arg[0] || this.$refs.all_wrap[`client${word}`];
					main_size = arg[1] || this.$refs.scroll[`scroll${word}`];
				}

				// 更新长度
				let per = wrap_size*100/main_size;
				// 控制显示
				if(this.xbar == false && key == "X"){      //****遮蔽x滚动条 */
					this.bar[key].show = false;
				}else{
					this.bar[key].show = per<100;  
				}

				// console.log(this.getStyle(this.$refs.scroll,'height'))
				// 内容 不足 容器
				if(key == 'Y' && per > 100){
					this.$refs.scroll.style.height = wrap_size + 'px';
				}

				let value = wrap_size*per/100;
				this.bar[key].size = (value<this.minSize)?this.minSize:value;
			},
			// 滚动条位置渲染  包含滚动窗口位置渲染
			barNumberRender(...arg){
				let key = 'Y',value;

				// 处理参数
				let hasKey = this.hasKeyJudge(arg);
				if(hasKey){
					if(key != arg[0]){
						key = 'X';
					}
					value = arg[1] || this.bar[key].number;
				}else{
					value = arg[0] || this.bar[key].number;
				}
				if(!this.bar[key].show || value < 0){  // 无滚动条 重置位置
					value = 0;
				}else if(value > this[`${key}_barRange`]){ // 超出范围  重置到极限位置
					value = this[`${key}_barRange`];
				}
				this.bar[key].number = value;
			},
			

			// *****特别操作
			zero(){
				this.bar.Y.number = 0;
				this.bar.X.number = 0;
			},
            // 获取属性
            getStyle(element, attr) {
                if(element.currentStyle) {
                    return element.currentStyle[attr];
                } else {
                    return getComputedStyle(element, false)[attr];
                }
            },
			// scrollTop(){
			// 	setTimeout(()=>{
			// 		this.ani_scroll("Y",0,5)
			// 	},300)
			// },
			

			// **** 最终运动  
			// 抽离动画
			step(obj,func,end){
				// 更新当前位置值
				let value = this.choose_animate(obj.t, obj.b, obj.c, obj.d);
				
				func && func(value)
				obj.t++;
				if (obj.t <= obj.d) {
					// 继续运动
					let run = this.step.bind(this,obj,func,end);
					requestAnimationFrame(run);
				} else {
					// 动画结束
					typeof end == 'function' && end.call(this);
				}
			},
			// 滚动条运动
			// * key 	 'X,Y' (可省略，默认为Y)
			// * target  目标位置
			// * time    运动时间(可省略，默认100)
			ani_scroll(...arg){
				let key = 'Y',target,time = 100;

				// 处理参数
				let hasKey = this.hasKeyJudge(arg);
				if(hasKey){
					if(key != arg[0]){
						key = 'X';
					}
					target = arg[1] === undefined?this.bar[key].number:arg[1]; 
					time = arg[2] || time;
				}else{
					target = arg[0] === undefined?this.bar[key].number:arg[0]; 
					time = arg[1] || time;
				}

				let begin_number = this.bar[key].number;
				this.step({
					t:0,
					b:begin_number,
					c:target - begin_number,
					d:time,
				},(value)=>{
					this.barNumberRender(key,value)
				})
			},


			// ****其余辅助函数
			hasKeyJudge(arr){
				return arr.some(val=>isNaN(val - 0));
			},
			// 根据滚动条位置计算 主体位置
			calc_position(key = 'Y'){
				let word = key == 'Y'?'Height':'Width';

				// 容器高和内容高
				let wrap_size = this.$refs.all_wrap[`client${word}`];
				let main_size = this.$refs.scroll[`scroll${word}`];

				let differ = main_size - wrap_size;
				// 位移比例
				let rate = differ/this[`${key}_barRange`];
				return Math.round(-rate*this.bar[key].number); 
			},
			// 根据主体位移距离 计算滚动条位移
			// key：X,Y轴 distance:距离  time：动画时间
			scrollCalc(key,distance,time){
				let word = key == 'Y'?'Height':'Width';

				// 容器高和内容高
				let wrap_size = this.$refs.all_wrap[`client${word}`];
				let main_size = this.$refs.scroll[`scroll${word}`];

				let differ = main_size - wrap_size;
				// 位移比例
				let rate = differ/this[`${key}_barRange`]; 
				// 通过计算 安排滚动条位移动画
				this.ani_scroll(key,this.bar[key].number + distance/rate ,time)
			},

			// 起始位置
			getOrigin(element,key = 'Y'){
				let word = key == 'Y'?'top':'left';
				return element.getBoundingClientRect()[word];
			},

		}
    }
</script>

<style lang="less">
	@bar_color:#cbd5e5;
	@samll_w:5px;
	@big_w:10px;

	.clear{
		&:after{
			content:"";
			display: block;
			clear:both;
		}
	}

	// 滚动框
	.z-scrollDiv{
		position: relative;
		overflow: hidden;
		.clear();

		.z-scroll-main{
			height: 100%;
			min-width: 100%;
			box-sizing: border-box;
			padding:0.1px;
			position: relative;
			float:left;
			.clear();
		}

		&:hover{
			>.z-scroll-bar{
				opacity: 1;
			}
		}

		.z-scroll-bar{
			opacity: 0;
			position: absolute;
			transition: 0.2s;
			>div{
				position: absolute;
				top:0;
				cursor:pointer;
				border-radius: @samll_w/2;
				background:@bar_color;
			}
			// 竖滚动条
			&.y{
				height: 100%;
				right: 3px;
				top:0;
				width:@samll_w;
				>div{
					right: 0;
					width:@samll_w;
				}
				
				&:hover{
					width:@big_w;
					>div{
						border-radius: @big_w/2;
						width:@big_w;
					}
				}
			}
			// 横滚动条
			&.x{
				width: 100%;
				bottom: 3px;
				left:0;
				height:@samll_w;
				>div{
					left: 0;
					height:@samll_w;
				}
				
				&:hover{
					height:@big_w;
					>div{
						border-radius: @big_w/2;
						height:@big_w;
					}
				}
			}

		}
		
		// 遮罩
		.z-cover{
			position: fixed;
			width:100%;
			height:100%;
			top:0;
			left:0;
			// background:rgba(0,0,0,0.4);
			opacity: 0;
			z-index:1000;
		}
	}
	
</style>


