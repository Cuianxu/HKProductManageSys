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
