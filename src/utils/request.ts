import axios from 'axios'
import router from '../router/index'
import { ElMessage } from 'element-plus'
import { useStore } from '@/stores/store'
const instance = axios.create({
  baseURL: "http://127.0.0.1:8888/api/private/v1",
  timeout: 5000,
})
const store = useStore()
instance.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  } else {
    delete config.headers.Authorization
  }
  return config;
})


instance.interceptors.response.use((response) => {
  if (response.data.meta.msg === "无效token") {
    window.localStorage.removeItem("token")
    router.push('/login')
    ElMessage.error('登录过期，请重新登录')
    return Promise.reject(response.data.meta.msg);
  }
  return response;
})




export const $get = <T>(url: string, params = {}, headers = {}) => {
  return instance.get<T>(url, { params, headers });
}

export const $post = <T>(url: string, data = {}, headers = {}) => {
  return instance.post<T>(url, data, { headers });
}
export const $put = <T>(url: string, data: any, headers = {}) => {
  instance.put<T>(url, data, { headers })
}

export default instance