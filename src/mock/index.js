const Mock = require('mockjs')
Mock.mock('/login/login', 'post', {
  state: 1,
  msg: '登录成功'
})
