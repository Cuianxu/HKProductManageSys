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
// 搜索表单数据接口
export interface SearchFormDataInterface {
  [key: string]: string | number,
  pagenum: number
  pagesize: number
}
// 搜索表单项接口
export interface SearchFormItemInterface {
  label: string
  prop: keyof SearchFormDataInterface,
  placeholder: string
  type: 'input' | 'select' | 'cascader'
  options?: {
    label: string
    value: number,
    children?: {
      label: string,
      value: number,
      children?: {
        label: string,
        value: number,
      }[]
    }[]
  }[]
}
// 表格列接口
export interface TableColumnInterface {
  label: string
  prop: string,
  width?: string,
  align?: string,
  slots?: string,
  btns?: {
    edit?: boolean,
    editLabel?: string,
    del?: boolean,
    delLabel?: string,
    allocate?: boolean,
    allocateLabel?: string,
  }
}
// 用户列表响应数据
export interface UserListResponse {
  pagenum: number,
  total: number,
  users: Array<UserTableDataInterface>
}
export interface UserTableDataInterface {
  readonly id: number,
  username: string,
  mobile: string,
  email: string,
  role_name?: string,
  mg_state?: Boolean,
  create_time?: number,
  password?: string,
}

// 权限管理表格数据接口
// 角色列表
export interface RoleTableDataInterface {
  readonly id: number,
  roleName: string,
  roleDesc: string,
  children?: RoleTableDataInterface[]
}
// 权限列表
export interface RightTableDataInterface {
  readonly id: number,
  authName: string,
  level: string,
  path: string,
  pid: number,
}

// 商品管理表格数据接口
// 商品列表
export interface GoodsListResponse {
  pagenum: number,
  total: number,
  goods: Array<GoodsTableDataInterface>
}
export interface GoodsTableDataInterface {
  add_time: number,
  cat_id: number,
  cat_one_id: number,
  cat_three_id: number,
  cat_two_id: number,
  goods_id: number,
  goods_name: string,
  goods_number: number,
  goods_price: number,
  goods_state: number,
  goods_weight: number,
  hot_mumber: number,
  is_promote: boolean,
  upd_time: number,
}
// 分类参数

export interface CategoryParamListInterface {
  cat_deleted: boolean,
  cat_id: number,
  cat_level: number,
  cat_name: string,
  cat_pid: number,
  children?: CategoryParamListInterface[]
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
