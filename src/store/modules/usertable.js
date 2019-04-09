import { getUserTable } from '../../api/user'
const usertable = {
  state: {
    _usertable: ''
  },
  mutations: {
    SET_USERTABLE: (state, DATA) => {
      state._userinfo = DATA
    }
  },
  actions: {
    GetUserTable ({ commit }, data) {
      return new Promise((resolve, reject) => {
        getUserTable(data.page, data.data).then(response => {
            resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default usertable
