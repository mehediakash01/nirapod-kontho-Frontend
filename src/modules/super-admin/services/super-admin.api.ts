import { api } from '@/src/services/api';

export type ReportPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type ReportType =
  | 'HARASSMENT'
  | 'DOMESTIC_VIOLENCE'
  | 'STALKING'
  | 'CORRUPTION'
  | 'THREAT';

export interface SuperAdminAnalytics {
  totalNgos: number;
  totalReports: number;
  submittedReports: number;
  verifiedReports: number;
  rejectedReports: number;
  totalCases: number;
  activeCases: number;
  resolvedCases: number;
  totalSuccessfulDonations: number;
}

export interface NgoItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  supportedReportTypes: ReportType[];
  coverageAreas: string[];
  maxActiveCases: number;
  priorityEscalationHours: number;
  createdAt: string;
  cases: Array<{
    id: string;
    status: 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  }>;
}

export interface CreateNgoPayload {
  name: string;
  email: string;
  phone: string;
  address: string;
  supportedReportTypes?: ReportType[];
  coverageAreas?: string[];
  maxActiveCases?: number;
  priorityEscalationHours?: number;
  admin: {
    name: string;
    email: string;
    password: string;
  };
}

export interface VerifiedReport {
  id: string;
  type: ReportType;
  description: string;
  location: string;
  severity: 'MILD' | 'MODERATE' | 'URGENT' | null;
  status: 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
  case: {
    id: string;
    assignedNgoId: string;
    priority: ReportPriority;
    status: 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  } | null;
}

export interface AssignNgoPayload {
  ngoId: string;
  priority?: ReportPriority;
  assignmentRationale: string;
  confirmAssignment: true;
}

export interface AssignmentRecommendation {
  ngoId: string;
  ngoName: string;
  score: number;
  reasons: string[];
  activeCases: number;
  maxActiveCases: number;
  priorityEscalationHours: number;
  typeMatched: boolean;
  coverageMatched: boolean;
}

export interface AssignmentAuditLog {
  id: string;
  actorUserId: string | null;
  category: string;
  action: string;
  entityType: string;
  entityId: string | null;
  severity: 'INFO' | 'WARN' | 'ALERT' | string;
  message: string;
  rationale: string | null;
  metadata: {
    ngoId?: string;
    caseId?: string;
    priority?: ReportPriority;
  } | null;
  createdAt: string;
}

export const getSuperAdminAnalytics = async (): Promise<SuperAdminAnalytics> => {
  const res = await api.get('/ngos/analytics/summary');
  return res.data.data;
};

export const getAllNgos = async (): Promise<NgoItem[]> => {
  const res = await api.get('/ngos');
  return res.data.data;
};

export const createNgoWithAdmin = async (payload: CreateNgoPayload) => {
  const res = await api.post('/ngos/create-with-admin', payload);
  return res.data.data;
};

export const getVerifiedReports = async (): Promise<VerifiedReport[]> => {
  const res = await api.get('/reports', {
    params: { status: 'VERIFIED', limit: 100 },
  });
  return res.data.data;
};

export const assignNgoToReport = async (reportId: string, payload: AssignNgoPayload) => {
  const res = await api.patch(`/reports/${reportId}/assign`, payload);
  return res.data.data;
};

export const getAssignmentRecommendations = async (
  reportId: string
): Promise<AssignmentRecommendation[]> => {
  const res = await api.get(`/reports/${reportId}/recommendations`);
  return res.data.data;
};

export const getAssignmentAuditLogs = async (): Promise<AssignmentAuditLog[]> => {
  const res = await api.get('/reports/audit-logs/assignments');
  return res.data.data;
};
