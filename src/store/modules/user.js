import { loginByUsername, getUserInfo } from '../../api/login'
const user = {
  state: {
    _userinfo: ''
  },
  mutations: {
    SET_USER: (state, token) => {
      state._userinfo = token
    }
  },
  actions: {
    LoginByUsername ({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password).then(response => {
          if (response.data.code === 1) {
            sessionStorage.setItem('user', JSON.stringify(response.data.data))
            commit('SET_USER', response.data.data)
            resolve(response.data.mes)
          } else {
            reject(response.data.mes)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    Logout({ commit, state }) {
      sessionStorage.clear()
      commit('SET_USER', '')
    },
    Getuserinfo({ commit },id){
        getUserInfo(id)
        .then(res=>{
          
          
          commit('SET_USER', res.data[0])
        })
    }
  }
}
export default user
