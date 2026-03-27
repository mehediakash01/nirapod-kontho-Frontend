'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import CreateNgoForm, {
  type CreateNgoFormValues,
} from '@/src/modules/super-admin/components/CreateNgoForm';
import NgoTable from '@/src/modules/super-admin/components/NgoTable';
import {
  assignNgoToReport,
  createNgoWithAdmin,
  getAllNgos,
  getSuperAdminAnalytics,
  getVerifiedReports,
  type ReportPriority,
} from '@/src/modules/super-admin/services/super-admin.api';

const PRIORITIES: ReportPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

type AssignmentDraft = {
  ngoId: string;
  priority: ReportPriority;
};

export default function SuperAdminDashboardPage() {
  const queryClient = useQueryClient();
  const [assignmentDrafts, setAssignmentDrafts] = useState<Record<string, AssignmentDraft>>({});

  const analyticsQuery = useQuery({
    queryKey: ['super-admin-analytics'],
    queryFn: getSuperAdminAnalytics,
  });

  const ngosQuery = useQuery({
    queryKey: ['all-ngos'],
    queryFn: getAllNgos,
  });

  const reportsQuery = useQuery({
    queryKey: ['verified-reports'],
    queryFn: getVerifiedReports,
  });

  const createNgoMutation = useMutation({
    mutationFn: (values: CreateNgoFormValues) =>
      createNgoWithAdmin({
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
        admin: {
          name: values.adminName,
          email: values.adminEmail,
          password: values.adminPassword,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-ngos'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin-analytics'] });
      toast.success('NGO created successfully');
    },
    onError: (err: unknown) => {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message ===
          'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to create NGO';
      toast.error(message);
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({ reportId, ngoId, priority }: { reportId: string; ngoId: string; priority: ReportPriority }) =>
      assignNgoToReport(reportId, { ngoId, priority }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verified-reports'] });
      queryClient.invalidateQueries({ queryKey: ['all-ngos'] });
      queryClient.invalidateQueries({ queryKey: ['super-admin-analytics'] });
      toast.success('NGO assigned to report successfully');
    },
    onError: (err: unknown) => {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message ===
          'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to assign NGO';
      toast.error(message);
    },
  });

  const unassignedReports = useMemo(
    () => (reportsQuery.data ?? []).filter((report) => !report.case),
    [reportsQuery.data]
  );

  const updateDraft = (reportId: string, patch: Partial<AssignmentDraft>) => {
    setAssignmentDrafts((prev) => {
      const current = prev[reportId] ?? { ngoId: '', priority: 'HIGH' as const };
      return {
        ...prev,
        [reportId]: {
          ...current,
          ...patch,
        },
      };
    });
  };

  const handleAssign = async (reportId: string) => {
    const draft = assignmentDrafts[reportId];

    if (!draft?.ngoId) {
      toast.error('Please select an NGO before assignment');
      return;
    }

    await assignMutation.mutateAsync({
      reportId,
      ngoId: draft.ngoId,
      priority: draft.priority,
    });
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Super Admin Dashboard</h1>
          <p className="text-sm text-gray-600">Manage NGOs, assign verified reports, and monitor platform activity.</p>
        </div>

        {analyticsQuery.data ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Total NGOs" value={analyticsQuery.data.totalNgos} />
            <MetricCard label="Total Reports" value={analyticsQuery.data.totalReports} />
            <MetricCard label="Active Cases" value={analyticsQuery.data.activeCases} />
            <MetricCard
              label="Successful Donations"
              value={`$${analyticsQuery.data.totalSuccessfulDonations.toFixed(2)}`}
            />
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <CreateNgoForm
            onSubmit={(values) => createNgoMutation.mutateAsync(values)}
            isSubmitting={createNgoMutation.isPending}
          />
          <NgoTable ngos={ngosQuery.data ?? []} />
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold text-primary">Assign NGO To Verified Reports</h2>

          {reportsQuery.isLoading ? <p>Loading verified reports...</p> : null}
          {reportsQuery.error ? <p className="text-sm text-red-600">Failed to load reports.</p> : null}

          {!reportsQuery.isLoading && !reportsQuery.error && !unassignedReports.length ? (
            <p className="text-sm text-gray-600">No unassigned verified reports found.</p>
          ) : null}

          <div className="space-y-3">
            {unassignedReports.map((report) => {
              const draft = assignmentDrafts[report.id] ?? { ngoId: '', priority: 'HIGH' as const };

              return (
                <div key={report.id} className="rounded-md border p-3">
                  <div className="mb-3">
                    <h3 className="font-medium text-primary">{report.type}</h3>
                    <p className="text-sm text-gray-700">{report.description}</p>
                    <p className="text-xs text-gray-500">
                      {report.location} | {new Date(report.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="grid gap-2 md:grid-cols-[1.4fr_1fr_auto]">
                    <select
                      className="h-10 rounded border px-3 text-sm"
                      value={draft.ngoId}
                      onChange={(event) => updateDraft(report.id, { ngoId: event.target.value })}
                    >
                      <option value="">Select NGO</option>
                      {(ngosQuery.data ?? []).map((ngo) => (
                        <option key={ngo.id} value={ngo.id}>
                          {ngo.name}
                        </option>
                      ))}
                    </select>

                    <select
                      className="h-10 rounded border px-3 text-sm"
                      value={draft.priority}
                      onChange={(event) =>
                        updateDraft(report.id, { priority: event.target.value as ReportPriority })
                      }
                    >
                      {PRIORITIES.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>

                    <Button
                      type="button"
                      onClick={() => handleAssign(report.id)}
                      disabled={assignMutation.isPending}
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-primary">{value}</p>
    </div>
  );
}
