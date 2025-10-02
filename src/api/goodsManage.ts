import type { AxiosResponse, GoodsListResponse, SearchFormDataInterface, GoodsTableDataInterface, CategoryParamListInterface } from '@/interface'
import { $get, $post, $delete } from '@/utils/request'

export const getGoodsList = (params: SearchFormDataInterface = {
  query: '',
  pagenum: 1,
  pagesize: 10,
}) => {
  return $get<AxiosResponse<GoodsListResponse>>('/goods', params)
}

export const addGoods = (params: GoodsTableDataInterface) => {
  return $post<AxiosResponse<GoodsTableDataInterface>>(`/goods`, params)
}

export const deleteGoods = (params: { id: number }) => {
  return $delete<AxiosResponse<GoodsTableDataInterface>>(`/goods/${params.id}`)
}

export const getCategoryParamList = () => {
  return $get<AxiosResponse<CategoryParamListInterface[]>>('/categories')
}

export const getCurrentCategoryTableData = (params: { cat_id: number }) => {
  return $get<AxiosResponse<CategoryParamListInterface>>(`/categories/${params.cat_id}`)
}
