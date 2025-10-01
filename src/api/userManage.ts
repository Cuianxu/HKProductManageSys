import { $get, $put, $post, $delete } from '@/utils/request'
import type { UserListResponse, AxiosResponse } from '@/interface'

export const getUserList = (params = {
  query: '',
  pagenum: 1,
  pagesize: 2,
}) => {
  return $get<AxiosResponse<UserListResponse>>('/users', params)
}
export const changeStatus = (params = {
  id: 0,
  status: false
}) => {
  return $put<AxiosResponse<{
    email: string,
    id: number,
    mg_state: boolean,
    mobile: string,
    rid: number,
    username: string,
  }>>(`/users/${params.id}/state/${params.status}`)
}
export const addUser = (params = {
  username: '',
  password: '',
  email: '',
  mobile: '',
}) => {
  return $post<AxiosResponse<{
    username: string,
    password: string,
    email: string,
    mobile: string,
  }>>(`/users`, params)
}
export const deleteUser = (params = {
  id: 0,
}) => {
  return $delete<AxiosResponse<null>>(`/users/${params.id}`)
}

export const editUser = (params = {
  id: 0,
  email: '',
  mobile: '',
}) => {
  return $put<AxiosResponse<{
    email: string,
    mobile: string,
  }>>(`/users/${params.id}`, params)
}

export const getRoleList = () => {
  return $get<AxiosResponse<{
    id: number,
    roleName: string,
    roleDesc: string,
  }[]>>('/roles')
}

export const changeRole = (id: number, params = {
  rid: 0,
}) => {
  return $put<AxiosResponse<{
    roleList: number[],
  }>>(`/users/${id}/role`, params)
}
