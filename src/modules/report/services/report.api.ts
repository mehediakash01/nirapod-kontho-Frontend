import { api } from "@/src/services/api";
import type { CreateReportPayload, Report } from '../types';


export const createReport = async (data: CreateReportPayload) => {
  const res = await api.post('/reports', data);
  return res.data;
};

export const getMyReports = async (): Promise<Report[]> => {
  const res = await api.get('/reports/my');
  return res.data.data;
};