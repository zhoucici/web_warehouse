import request from '../utils/request'
export function getRecord (searchData) {
  return request({
    url: '/getrecord',
    method: 'post',
    data: searchData
  })
}