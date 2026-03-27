'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyReports } from '../services/report.api';

export const useReports = () => {
  return useQuery({
    queryKey: ['my-reports'],
    queryFn: getMyReports,
  });
};