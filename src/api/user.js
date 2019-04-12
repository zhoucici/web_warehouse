import request from '../utils/request'

export function getUserTable (page, text) {
  const data = {
    page,
    text
  }
  return request({
    url: '/usertable',
    method: 'post',
    data
  })
}
export function deleteuser (id) {
  const data = {
    id
  }
  return request({
    url: '/deleteuser',
    method: 'post',
    data
  })
}
export function edituser (user) {
  const data = {
    user
  }
  return request({
    url: '/edituser',
    method: 'post', 
    data
  })
}