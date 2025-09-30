import type { AxiosResponse, User } from '@/interface'
import { $get, $put } from '../utils/request'
export const getUserList = async (params = {
    pagenum: 1,
    pagesize: 2,
}, query = {}) => {
    // 合并查询参数（params用于分页，query用于其他条件如username）
    const combinedParams = { ...params, ...query };

    // 使用$get的params配置自动处理查询参数拼接
    const res = $get<AxiosResponse<User>>('/users', combinedParams);
    return res;
}
export const statusUpdated = async (data: any) => {
    await $put('/users/' + data.id + '/state/' + data.mg_state, data)
}