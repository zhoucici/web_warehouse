import request from '../utils/request'
export function getGoods (searchData) {
  return request({
    url: 'https://www.easy-mock.com/mock/5cb429769e5e43437f720ad8/example/getGoods',
    method: 'post',
    data: searchData
  })
}

export function delGoodsById (id) {
  return request({
    url: '/del',
    method: 'post',
    data: {
      id
    }
  })
}
export function addGoodsById (params) {
  return request({
    url: '/add',
    method: 'post',
    data: params
  })
}
export function editGoodsById (id, params) {
  return request({
    url: '/edit',
    method: 'post',
    data: Object.assign({}, id, params)
  })
}