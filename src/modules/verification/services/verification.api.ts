import { api } from '@/src/services/api';

export type PendingReportStatus = 'SUBMITTED';

export type ModerationAction = 'APPROVED' | 'REJECTED';

export type RejectionReason =
  | 'INSUFFICIENT_EVIDENCE'
  | 'INCONSISTENT_DETAILS'
  | 'DUPLICATE_REPORT'
  | 'OUT_OF_SCOPE'
  | 'POTENTIAL_SPAM'
  | 'OTHER';

export type SeverityLevel = 'MILD' | 'MODERATE' | 'URGENT';

export interface PendingReportEvidence {
  id: string;
  fileUrl: string;
  fileType: string;
  createdAt: string;
}

export interface ReporterInsight {
  previousReportsCount: number;
  label: string;
}

export interface PendingReport {
  id: string;
  userId: string;
  type: 'HARASSMENT' | 'DOMESTIC_VIOLENCE' | 'STALKING' | 'CORRUPTION' | 'THREAT';
  description: string;
  location: string;
  incidentDate?: string | null;
  severity?: SeverityLevel | null;
  latitude?: number | null;
  longitude?: number | null;
  voiceNoteUrl?: string | null;
  status: PendingReportStatus;
  isAnonymous: boolean;
  createdAt: string;
  evidence: PendingReportEvidence[];
  reporterInsight?: ReporterInsight;
}

export interface UpdateReportStatusPayload {
  status: ModerationAction;
  note?: string;
  rejectionReason?: RejectionReason;
  checklist?: string[];
}

export interface VerificationOverview {
  pendingCount: number;
  urgentPendingCount: number;
  approvedByMe: number;
  rejectedByMe: number;
  reviewedTodayByMe: number;
}

export interface RecentVerificationDecision {
  id: string;
  reportId: string;
  moderatorId: string;
  status: ModerationAction;
  feedback?: string | null;
  createdAt: string;
  report: {
    id: string;
    type: PendingReport['type'];
    severity?: SeverityLevel | null;
    location: string;
    createdAt: string;
  };
}

export const getPendingReports = async (): Promise<PendingReport[]> => {
  const res = await api.get('/verification/pending');
  return res.data.data;
};

export const getVerificationOverview = async (): Promise<VerificationOverview> => {
  const res = await api.get('/verification/overview');
  return res.data.data;
};

export const getRecentDecisions = async (): Promise<RecentVerificationDecision[]> => {
  const res = await api.get('/verification/recent');
  return res.data.data;
};

export const updateReportStatus = async (
  reportId: string,
  payload: UpdateReportStatusPayload
) => {
  const res = await api.post('/verification', { ...payload, reportId });
  return res.data.data;
};
