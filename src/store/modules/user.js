import { loginByUsername, logout } from '../../api/login'
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
          console.log(response)
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
    LogOut ({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default user
