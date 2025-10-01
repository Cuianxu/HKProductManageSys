import { $get } from '@/utils/request'
import type { AxiosResponse, RightTableDataInterface } from '@/interface'

export const getRightList = () => {
  return $get<AxiosResponse<RightTableDataInterface[]>>('/rights/list',)
}
