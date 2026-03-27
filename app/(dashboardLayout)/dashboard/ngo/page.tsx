'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import CaseCard from '@/src/modules/ngo/components/CaseCard';
import { getMyCases, updateCase, type CaseStatus } from '@/src/modules/ngo/services/ngo.api';

export default function NgoDashboardPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['ngo-cases'],
    queryFn: getMyCases,
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: CaseStatus; note?: string }) =>
      updateCase(id, { status, note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ngo-cases'] });
      toast.success('Case updated successfully');
    },
    onError: (err: unknown) => {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message ===
          'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to update case';
      toast.error(message);
    },
  });

  const handleUpdate = async (id: string, status: CaseStatus, note?: string) => {
    await mutateAsync({ id, status, note });
  };

  return (
    <ProtectedRoute allowedRoles={['NGO_ADMIN']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">NGO Case Management</h1>
          <p className="text-sm text-gray-600">Track assigned cases and update case status.</p>
        </div>

        {isLoading ? <p>Loading assigned cases...</p> : null}

        {!isLoading && error ? <p className="text-red-600">Failed to load assigned cases.</p> : null}

        {!isLoading && !error && data?.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {data.map((item) => (
              <CaseCard key={item.id} item={item} onUpdate={handleUpdate} isUpdating={isPending} />
            ))}
          </div>
        ) : null}

        {!isLoading && !error && !data?.length ? (
          <div className="rounded-lg border bg-white p-6 text-sm text-gray-600">
            No assigned cases yet.
          </div>
        ) : null}
      </div>
    </ProtectedRoute>
  );
}
