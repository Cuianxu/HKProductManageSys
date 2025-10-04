import type { AxiosResponse, GoodsListResponse, SearchFormDataInterface, GoodsTableDataInterface, CategoryParamListInterface, goodsCategoryListResponse, ParamListInterface } from '@/interface'
import { $get, $post, $delete, $put } from '@/utils/request'
import type { UploadUserFile } from 'element-plus'

export const getGoodsList = (params: SearchFormDataInterface = {
  query: '',
  pagenum: 1,
  pagesize: 10,
}) => {
  return $get<AxiosResponse<GoodsListResponse>>('/goods', params)
}

export const addGoodsItem = (params: {
  attrs?: Array<{
    attr_id: number,
    attr_value: string
  }>
  goods_name: string
  goods_price: number
  goods_weight: number
  goods_number: number
  goods_cat: string
  pics: UploadUserFile[]
  goods_introduce: string
}) => {
  return $post<AxiosResponse<GoodsTableDataInterface>>(`/goods`, params)
}

export const deleteGoodsItem = (params: { id: number }) => {
  return $delete<AxiosResponse<GoodsTableDataInterface>>(`/goods/${params.id}`)
}

export const getCategoryParamList = (params = {}) => {
  return $get<AxiosResponse<CategoryParamListInterface[]>>('/categories', params)
}

export const getCurrentCategoryTableData = (selVal: number, params: { sel: string }) => {
  return $get<AxiosResponse<ParamListInterface[]>>(`/categories/${selVal}/attributes`, params)
}

export const addCategoryParam = (selVal: number, params: { attr_name: string, attr_sel: string }) => {
  return $post<AxiosResponse<CategoryParamListInterface>>(`/categories/${selVal}/attributes`, params)
}

export const editCategoryParam = (selVal: number, id: number, params: { attr_name: string, attr_sel: string }) => {
  return $put<AxiosResponse<CategoryParamListInterface>>(`/categories/${selVal}/attributes/${id}`, params)
}

export const deleteCategoryParam = (selVal: number, id: number) => {
  return $delete<AxiosResponse<CategoryParamListInterface>>(`/categories/${selVal}/attributes/${id}`)
}


// 添加分类
export const addCategory = (params: { cat_name: string, cat_level: number, cat_pid: number }) => {
  return $post<AxiosResponse<CategoryParamListInterface>>(`/categories`, params)
}
// 得到商品分类列表
export const getGoodsCategoryList = (params = {}) => {
  return $get<AxiosResponse<goodsCategoryListResponse>>('/categories', params)
}
