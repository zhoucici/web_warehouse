// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/config/less/common.less'
import "@/assets/config/global-component.js"
Vue.use(ElementUI)
Vue.config.productionTip = false

require('./mock/index')

router.beforeEach((to, from, next) => {
  
  if (to.path === '/login') {
    sessionStorage.clear()
    next()
  } else {

    if (sessionStorage.getItem('user')) {
      store.commit('SET_USER', JSON.parse(sessionStorage.getItem('user')))
    }else{
      next({
        path: '/login',
      })
    }
    if (store.getters.user._userinfo) {
      store.dispatch('Getuserinfo',store.getters.user._userinfo.id)
      next()
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
