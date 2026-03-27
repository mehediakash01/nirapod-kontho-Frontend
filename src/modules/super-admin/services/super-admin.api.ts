import { api } from '@/src/services/api';

export type ReportPriority = 'LOW' | 'MEDIUM' | 'HIGH';

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
  admin: {
    name: string;
    email: string;
    password: string;
  };
}

export interface VerifiedReport {
  id: string;
  type: 'HARASSMENT' | 'DOMESTIC_VIOLENCE' | 'STALKING' | 'CORRUPTION' | 'THREAT';
  description: string;
  location: string;
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
