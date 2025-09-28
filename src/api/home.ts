import { $get } from '../utils/request'
import type { AxiosResponse, Menus } from '@/interface';
// 首页菜单获取
export const getMenu = async () => {
  const res = await $get<AxiosResponse<Menus[]>>('/menus');
  return res
}
