export interface AxiosResponse<T> {
  data: T,
  meta: {
    status: number,
    msg: string
  }
}
export interface LoginResponse {
  email: string,
  id: number,
  mobile: string,
  rid: number,
  token: string,
  username: string,
}
export interface Menus {
  id: number,
  order: number,
  authName: string,
  path: string,
  children: Menus[]
}
