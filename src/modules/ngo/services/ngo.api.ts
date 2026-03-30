import { api } from '@/src/services/api';

export type CaseStatus = 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface NgoCase {
  id: string;
  reportId: string;
  assignedNgoId: string;
  status: CaseStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
  report: {
    id: string;
    type: 'HARASSMENT' | 'DOMESTIC_VIOLENCE' | 'STALKING' | 'CORRUPTION' | 'THREAT';
    description: string;
    location: string;
    incidentDate: string | null;
    severity: 'MILD' | 'MODERATE' | 'URGENT' | null;
    voiceNoteUrl: string | null;
    status: 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
    isAnonymous: boolean;
    createdAt: string;
    evidence: Array<{
      id: string;
      fileUrl: string;
      fileType: string;
      createdAt: string;
    }>;
  };
  notes: Array<{
    id: string;
    note: string;
    createdAt: string;
    author: {
      id: string;
      name: string | null;
      email: string;
    };
  }>;
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
