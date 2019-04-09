import request from '../utils/request'

export function getUserTable (page, text) {
  const data = {
    page,
    text
  }
  return request({
    url: '/api/usertable',
    method: 'post',
    data
  })
}
