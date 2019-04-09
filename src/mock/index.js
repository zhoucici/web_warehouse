const Mock = require('mockjs')
const login = function () {
  return {
    code: 1,
    mes: '登录成功',
    data: {
      username: '测试管理员'
    }
  }
}
const table = function () {
  return {
    page:1,
    mes: '登录成功',
    data: [{
      
    },{

    }],
    tolot:2
  }
}
Mock.mock('/api/login', 'post', login)
Mock.mock('/api/usertable', 'post', table)