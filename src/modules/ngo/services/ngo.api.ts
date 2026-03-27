import { api } from '@/src/services/api';

export type CaseStatus = 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface NgoCase {
  id: string;
  reportId: string;
  assignedNgoId: string;
  status: CaseStatus;
  priority: string;
  createdAt: string;
  report: {
    id: string;
    type: 'HARASSMENT' | 'DOMESTIC_VIOLENCE' | 'STALKING' | 'CORRUPTION' | 'THREAT';
    description: string;
    location: string;
    status: 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
    isAnonymous: boolean;
    createdAt: string;
  };
}

export interface UpdateCasePayload {
  status: CaseStatus;
  note?: string;
}

export const getMyCases = async (): Promise<NgoCase[]> => {
  const res = await api.get('/cases/my');
  return res.data.data;
};

export const updateCase = async (id: string, payload: UpdateCasePayload): Promise<NgoCase> => {
  const res = await api.patch(`/cases/${id}`, payload);
  return res.data.data;
};
