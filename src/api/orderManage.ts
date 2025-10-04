import type { AxiosResponse, SearchFormDataInterface, OrderListResponse } from '@/interface'
import { $get } from '@/utils/request'

export const getOrderList = (params: SearchFormDataInterface = {
  query: '',
  pagenum: 1,
  pagesize: 10,
}) => {
  return $get<AxiosResponse<OrderListResponse>>('/orders', params)
}
