import { api } from "@/src/services/api";


export const createReport = async (data: any) => {
  const res = await api.post('/reports', data);
  return res.data;
};

export const getMyReports = async () => {
  const res = await api.get('/reports/my');
  return res.data.data;
};