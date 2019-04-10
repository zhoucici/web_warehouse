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
