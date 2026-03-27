'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyReports } from '../services/report.api';
import type { Report } from '../types';

export const useReports = () => {
  return useQuery<Report[]>({
    queryKey: ['my-reports'],
    queryFn: getMyReports,
  });
};