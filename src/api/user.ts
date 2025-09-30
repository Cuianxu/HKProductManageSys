import type { AxiosResponse, User } from '@/interface'
import { $get, $put } from '../utils/request'
export const getUserList = async (params = {
    pagenum: 1,
    pagesize: 2,
    username: ''
}) => {
    const res = $get<AxiosResponse<User>>('/users', params)
    return res
}
export const statusUpdated = async (data: any) => {
    await $put('/users/' + data.id + '/state/' + data.mg_state, data)
}