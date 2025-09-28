import { $post } from "../utils/request";
import type { AxiosResponse, LoginResponse } from '@/interface';

export const loginReq = async (data: Object) => {
  return await $post<AxiosResponse<LoginResponse>>('/login', data)
}