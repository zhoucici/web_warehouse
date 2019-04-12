import { getUserTable,deleteuser,edituser} from '../../api/user'
const usertable = {
  state: {
    _usertable: ''
  },
  mutations: {
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
    },
    Deleteuser({commit},id){
      return new Promise((resolve,reject)=>{
        deleteuser(id).then(res=>{
          resolve(res)
        })
        .catch(error=>{
          reject(error)
        })
      })
    },
    Edituser({},user){
      console.log(user);
      
      return new Promise((resolve, reject) => {
        edituser(user).then(response => {
            resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}
export default usertable
