import { api } from '@/src/services/api';

export type PendingReportStatus = 'SUBMITTED';

export type ModerationAction = 'APPROVED' | 'REJECTED';

export interface PendingReport {
  id: string;
  userId: string;
  type: 'HARASSMENT' | 'DOMESTIC_VIOLENCE' | 'STALKING' | 'CORRUPTION' | 'THREAT';
  description: string;
  location: string;
  status: PendingReportStatus;
  isAnonymous: boolean;
  createdAt: string;
}

export interface UpdateReportStatusPayload {
  status: ModerationAction;
  note?: string;
}

export const getPendingReports = async (): Promise<PendingReport[]> => {
  const res = await api.get('/reports/pending');
  return res.data.data;
};

export const updateReportStatus = async (
  reportId: string,
  payload: UpdateReportStatusPayload
) => {
  const res = await api.patch(`/reports/${reportId}/status`, payload);
  return res.data.data;
};
