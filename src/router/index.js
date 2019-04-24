import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/*',
    //   name: '404',
    //   component: resolve => require(['../view/404/404.vue'], resolve)
    // },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['../view/login/login.vue'], resolve)
    },
    {
      path: '/',
      redirect: '/table',
      name: 'index',
      component: resolve => require(['../view/index/index.vue'], resolve),
      children: [
        {
          path: '/table',
          component: resolve => require(['../view/index/components/index.vue'], resolve)
        },
        {
          path: '/person',
          component: resolve => require(['../view/index/components/person.vue'], resolve)
        },
        {
          path: '/addperson',
          component: resolve => require(['../view/index/components/addperson.vue'], resolve)
        },
        {
          path: '/Stock',
          component: resolve => require(['../view/index/components/Stock.vue'], resolve)
        }
      ]
    }
  ]
})
