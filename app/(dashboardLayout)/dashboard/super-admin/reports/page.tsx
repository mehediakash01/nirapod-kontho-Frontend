'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Badge } from '@/components/ui/badge';
import { ClipboardCheck, Flag, Handshake } from 'lucide-react';
import { getAllNgos, getVerifiedReports } from '@/src/modules/super-admin/services/super-admin.api';

const REPORT_TYPE_LABELS: Record<string, string> = {
  HARASSMENT: 'Harassment',
  DOMESTIC_VIOLENCE: 'Domestic Violence',
  STALKING: 'Stalking',
  CORRUPTION: 'Corruption',
  THREAT: 'Threat',
};

export default function SuperAdminReportsPage() {
  const reportsQuery = useQuery({
    queryKey: ['verified-reports'],
    queryFn: getVerifiedReports,
  });

  const ngosQuery = useQuery({
    queryKey: ['all-ngos'],
    queryFn: getAllNgos,
  });

  const reports = useMemo(() => reportsQuery.data ?? [], [reportsQuery.data]);
  const ngoNameById = useMemo(
    () => new Map((ngosQuery.data ?? []).map((ngo) => [ngo.id, ngo.name])),
    [ngosQuery.data]
  );

  const summary = useMemo(() => {
    const assigned = reports.filter((r) => Boolean(r.case)).length;
    const unassigned = reports.length - assigned;
    const highPriority = reports.filter((r) => r.case?.priority === 'HIGH').length;
    return { assigned, unassigned, highPriority };
  }, [reports]);

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">Verified Reports</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review all verified incidents and track NGO assignment readiness.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <SummaryCard label="Total Verified" value={reports.length} icon={<ClipboardCheck className="size-4" />} />
          <SummaryCard label="Assigned" value={summary.assigned} icon={<Handshake className="size-4" />} />
          <SummaryCard label="High Priority" value={summary.highPriority} icon={<Flag className="size-4" />} />
        </section>

        {reportsQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading verified reports...</p> : null}
        {reportsQuery.error ? <p className="text-sm text-red-600">Failed to load reports.</p> : null}

        {!reportsQuery.isLoading && !reportsQuery.error && !reports.length ? (
          <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No verified reports found.</p>
        ) : null}

        <section className="grid gap-3 lg:grid-cols-2">
          {reports.map((report) => (
            <article key={report.id} className="rounded-xl border bg-card/70 p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-2">
                <p className="font-semibold text-primary">{REPORT_TYPE_LABELS[report.type] ?? report.type}</p>
                <Badge variant={report.case ? 'default' : 'secondary'}>{report.case ? 'Assigned' : 'Unassigned'}</Badge>
              </div>

              <p className="line-clamp-2 text-sm text-muted-foreground">{report.description}</p>

              <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                <p>Location: {report.location}</p>
                <p>Submitted: {new Date(report.createdAt).toLocaleString()}</p>
                <p>
                  Case: {report.case ? `${report.case.status} (${report.case.priority} priority)` : 'Not assigned'}
                </p>
                <p>
                  Assigned NGO:{' '}
                  {report.case
                    ? ngoNameById.get(report.case.assignedNgoId) ?? report.case.assignedNgoId
                    : 'Pending super-admin assignment'}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </ProtectedRoute>
  );
}

function SummaryCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-muted-foreground">
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}
