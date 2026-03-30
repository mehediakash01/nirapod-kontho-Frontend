'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import CaseCard from '@/src/modules/ngo/components/CaseCard';
import { getMyCases, updateCase, type CaseStatus } from '@/src/modules/ngo/services/ngo.api';

export default function NgoMyCasesPage() {
  const queryClient = useQueryClient();

  const casesQuery = useQuery({
    queryKey: ['ngo-cases'],
    queryFn: getMyCases,
  });

  const updateMutation = useMutation({
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
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to update case';
      toast.error(message);
    },
  });

  const handleUpdate = async (id: string, status: CaseStatus, note?: string) => {
    await updateMutation.mutateAsync({ id, status, note });
  };

  return (
    <ProtectedRoute allowedRoles={['NGO_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">My Cases</h1>
          <p className="mt-1 text-sm text-muted-foreground">Detailed view of all assigned cases for active handling.</p>
        </section>

        {casesQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading cases...</p> : null}
        {casesQuery.error ? <p className="text-sm text-red-600">Failed to load cases.</p> : null}

        {!casesQuery.isLoading && !casesQuery.error && !casesQuery.data?.length ? (
          <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No cases assigned yet.</p>
        ) : null}

        <section className="grid gap-4 md:grid-cols-2">
          {(casesQuery.data ?? []).map((item) => (
            <CaseCard key={item.id} item={item} onUpdate={handleUpdate} isUpdating={updateMutation.isPending} />
          ))}
        </section>
      </div>
    </ProtectedRoute>
  );
}
