export type ReportType =
  | 'HARASSMENT'
  | 'DOMESTIC_VIOLENCE'
  | 'STALKING'
  | 'CORRUPTION'
  | 'THREAT';

export type ReportSeverity = 'MILD' | 'MODERATE' | 'URGENT';

export type ReportStatus = 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

export interface Report {
  id: string;
  userId: string;
  type: ReportType;
  description: string;
  location: string;
  incidentDate: string;
  severity: ReportSeverity;
  latitude?: number | null;
  longitude?: number | null;
  voiceNoteUrl?: string | null;
  status: ReportStatus;
  isAnonymous: boolean;
  createdAt: string;
}

export interface CreateReportPayload {
  type: ReportType;
  description: string;
  location: string;
  incidentDate: string;
  severity: ReportSeverity;
  latitude?: number;
  longitude?: number;
  voiceNoteFile?: File | null;
  evidenceFiles?: File[];
  isAnonymous?: boolean;
}
