'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import PendingReportCard from '@/src/modules/verification/components/PendingReportCard';
import {
  getPendingReports,
  updateReportStatus,
  type ModerationAction,
} from '@/src/modules/verification/services/verification.api';

export default function ModeratorDashboardPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['pending-reports'],
    queryFn: getPendingReports,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({
      reportId,
      status,
      note,
    }: {
      reportId: string;
      status: ModerationAction;
      note?: string;
    }) => updateReportStatus(reportId, { status, note }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pending-reports'] });
      toast.success(
        variables.status === 'APPROVED'
          ? 'Report approved successfully'
          : 'Report rejected successfully'
      );
    },
    onError: (err: unknown) => {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message ===
          'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to update report';
      toast.error(message);
    },
  });

  const handleAction = async (reportId: string, status: ModerationAction, note?: string) => {
    await mutateAsync({ reportId, status, note });
  };

  if (isLoading) {
    return <p>Loading pending reports...</p>;
  }

  if (error) {
    return <p className="text-red-600">Failed to load pending reports.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Moderator Dashboard</h1>
        <p className="text-sm text-gray-600">Review submitted reports and approve or reject them.</p>
      </div>

      {data?.length ? (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((report) => (
            <PendingReportCard
              key={report.id}
              report={report}
              isUpdating={isPending}
              onAction={handleAction}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-white p-6 text-sm text-gray-600">
          No pending reports right now.
        </div>
      )}
    </div>
  );
}
