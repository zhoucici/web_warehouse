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
Mock.mock('/api/login', 'post', login)
