import Vue from 'vue';

// 导入全局组件
import page from "@/components/global/page.vue"      //基础页面
import scrollDiv from "@/components/global/scrollDiv.vue"      //滚动容器
import windowPop from "../../components/global/windowPop.vue"      // 弹窗
import pagination from "@/components/global/pagination.vue"

Vue.component('z-page', page);
Vue.component('z-scrollDiv', scrollDiv);
Vue.component('z-windowPop', windowPop);
Vue.component('z-pagination', pagination);