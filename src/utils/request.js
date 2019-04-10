import axios from 'axios'
import $url from '../assets/config/address-config'
import { Message } from 'element-ui'
const server = $url.supplier;  //地址
const service = axios.create({
  baseURL:server,
  timeout: 30000,
  withCredentials: true, //请求头带cookie
})
// response interceptor
service.interceptors.response.use(
  response => response,
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    console.log(error);
    
    return Promise.reject(error)
  }
)

export default service
