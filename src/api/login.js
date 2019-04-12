import request from '../utils/request'

export function loginByUsername (username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/login',
    method: 'post',
    data
  })
}


export function getUserInfo (id) {
  let data={
    id
  }
  return request({
    url: '/userinfo',
    method: 'post',
    data
  })
}
