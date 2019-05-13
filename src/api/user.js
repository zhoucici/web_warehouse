import request from '../utils/request'

export function getUserTable (page, text, size) {
  const data = {
    page,
    text,
    size
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
export function addperson (user) {
  const data = {
    user
  }
  return request({
    url: '/adduser',
    method: 'post', 
    data
  })
}