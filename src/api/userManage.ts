import { $get } from '@/utils/request'
import type { UserListResponse, AxiosResponse } from '@/interface'

export const getUserList = (params = {}) => {
  return $get<AxiosResponse<UserListResponse>>('/users', params)
}
