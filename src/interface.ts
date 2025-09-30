export interface AxiosResponse<T> {
  data: T,
  meta: {
    status: number,
    msg: string
  }
}
// 登录响应数据
export interface LoginResponse {
  email: string,
  id: number,
  mobile: string,
  rid: number,
  token: string,
  username: string,
}
// 菜单响应数据
export interface Menus {
  id: number,
  order: number,
  authName: string,
  path: string,
  children?: Menus[]
}
// 用户列表响应数据
export interface UserListResponse {
  pageNum: number,
  total: number,
  users: Array<{
    readonly id: number,
    username: string,
    mobile: string,
    email: string,
    role_name: string,
    mg_state: Boolean,
    create_time: number,
  }>
}
import type { SearchFormDataInterface } from '@/views/userManage/UserList.vue'
export interface SearchFormItemInterface {
  label: string
  prop: keyof SearchFormDataInterface,
  placeholder: string
  type: 'input' | 'select'
  options?: {
    label: string
    value: string
  }[]
}
export interface TableColumnInterface {
  label: string
  prop: string,
  slots?: string,
  btns?: object & {
    edit?: boolean,
    editLabel?: string,
    del?: boolean,
    delLabel?: string,
    allocate?: boolean,
    allocateLabel?: string,
  }
}
// 报表响应数据
export interface ReportResponse {
  legend: {
    data: String[]
  },
  series: Array<{
    name: string,
    type: string,
    data: Array<number>,
    stack: string,
    areaStyle: Object,
  }>,
  xAxis: Array<{
    data: Array<string>,
  }>,
  yAxis: Array<{
    type: string,
  }>,
}
