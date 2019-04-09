import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import usertable from './modules/usertable'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    usertable,
    user
  },
  getters
})

export default store
