'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import PendingReportCard from '@/src/modules/verification/components/PendingReportCard';
import {
  getPendingReports,
  updateReportStatus,
  type ModerationAction,
  type RejectionReason,
} from '@/src/modules/verification/services/verification.api';

export default function ModeratorPendingReportsPage() {
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
      rejectionReason,
      checklist,
    }: {
      reportId: string;
      status: ModerationAction;
      note?: string;
      rejectionReason?: RejectionReason;
      checklist?: string[];
    }) => updateReportStatus(reportId, { status, note, rejectionReason, checklist }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pending-reports'] });
      queryClient.invalidateQueries({ queryKey: ['verification-overview'] });
      queryClient.invalidateQueries({ queryKey: ['verification-recent'] });
      queryClient.invalidateQueries({ queryKey: ['pending-reports-mini'] });
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

  const handleAction = async (payload: {
    reportId: string;
    status: ModerationAction;
    note?: string;
    rejectionReason?: RejectionReason;
    checklist?: string[];
  }) => {
    await mutateAsync(payload);
  };

  if (isLoading) {
    return <p>Loading pending reports...</p>;
  }

  if (error) {
    return <p className="text-red-600">Failed to load pending reports.</p>;
  }

  return (
    <ProtectedRoute allowedRoles={['MODERATOR', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pending Verification Queue</h1>
          <p className="text-sm text-gray-600">Review evidence, complete checklist, and approve or reject submissions.</p>
        </div>

        {data?.length ? (
          <div className="grid gap-4 xl:grid-cols-2">
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
    </ProtectedRoute>
  );
}
