import type { ReportResponse, AxiosResponse } from "@/interface";
import { $get } from "@/utils/request";

export const getReport = (params = {}) => {
  return $get<AxiosResponse<ReportResponse>>('/reports/type/1', params)
}

