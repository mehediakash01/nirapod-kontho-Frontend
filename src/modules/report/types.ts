export type ReportType =
  | 'HARASSMENT'
  | 'DOMESTIC_VIOLENCE'
  | 'STALKING'
  | 'CORRUPTION'
  | 'THREAT';

export type ReportStatus = 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';

export interface Report {
  id: string;
  userId: string;
  type: ReportType;
  description: string;
  location: string;
  status: ReportStatus;
  isAnonymous: boolean;
  createdAt: string;
}

export interface CreateReportPayload {
  type: ReportType;
  description: string;
  location: string;
  isAnonymous?: boolean;
}
