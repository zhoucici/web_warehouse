import request from '../utils/request'
export function getGoods (searchData) {
  return request({
    url: '/getgoods',
    method: 'post',
    data: searchData
  })
}
export function outInto (params) {
  return request({
    url: '/outin',
    method: 'post',
    data: params
  })
}
export function delGoodsById (id) {
  return request({
    url: '/delgoods',
    method: 'post',
    data: {
      id
    }
  })
}
export function addGoods (params) {
  return request({
    url: '/add',
    method: 'post',
    data: params
  })
}
export function editGoodsById (id, params) {
  return request({
    url: '/editgoods',
    method: 'post',
    data: Object.assign({}, id, params)
  })
}