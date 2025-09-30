export interface AxiosResponse<T> {
  data: T,
  meta: {
    status: number,
    msg: string
  }
}
export interface User {


  pagenum: number,
  total: number,
  users: UserInfo[]


}
export interface UserInfo {
  id: number;               // 用户的唯一标识符
  role_name: string;        // 用户角色名称
  username: string;         // 用户名
  create_time: number;      // 创建时间（时间戳）
  mobile: string;           // 手机号
  email: string;            // 邮箱
  mg_state: boolean;        // 管理员状态（true/false）
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
