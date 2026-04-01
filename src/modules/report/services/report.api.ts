import { api } from "@/src/services/api";
import type { CreateReportPayload, Report } from '../types';

export type CreateReportRequest = Omit<CreateReportPayload, 'voiceNoteFile' | 'evidenceFiles'> & {
  voiceNoteUrl?: string;
  evidenceFiles?: Array<{ fileUrl: string; fileType: string }>;
};

export const createReport = async (data: CreateReportRequest) => {
  const res = await api.post('/reports', data);
  return res.data;
};

export const getMyReports = async (): Promise<Report[]> => {
  const res = await api.get('/reports/my');
  return res.data.data;
};