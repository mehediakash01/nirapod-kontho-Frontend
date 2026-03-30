'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Activity, AlertTriangle, BarChart3, CheckCircle2 } from 'lucide-react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { getMyCases } from '@/src/modules/ngo/services/ngo.api';

export default function NgoAnalyticsPage() {
  const casesQuery = useQuery({
    queryKey: ['ngo-cases'],
    queryFn: getMyCases,
  });

  const cases = useMemo(() => casesQuery.data ?? [], [casesQuery.data]);

  const metrics = useMemo(() => {
    return {
      total: cases.length,
      urgent: cases.filter((c) => c.report.severity === 'URGENT' || c.priority === 'HIGH').length,
      resolved: cases.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length,
      inProgress: cases.filter((c) => c.status === 'IN_PROGRESS').length,
    };
  }, [cases]);

  const statusBreakdown = useMemo(() => {
    const statuses: Array<'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'> = [
      'UNDER_REVIEW',
      'IN_PROGRESS',
      'RESOLVED',
      'CLOSED',
    ];

    return statuses.map((status) => ({
      status,
      count: cases.filter((c) => c.status === status).length,
    }));
  }, [cases]);

  return (
    <ProtectedRoute allowedRoles={['NGO_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">NGO Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">Operational visibility for case throughput and urgency load.</p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Metric title="Total Cases" value={metrics.total} icon={<BarChart3 className="size-4" />} />
          <Metric title="In Progress" value={metrics.inProgress} icon={<Activity className="size-4" />} />
          <Metric title="Resolved" value={metrics.resolved} icon={<CheckCircle2 className="size-4" />} />
          <Metric title="Urgent" value={metrics.urgent} icon={<AlertTriangle className="size-4" />} />
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">Status Breakdown</h2>
          <div className="mt-3 space-y-2">
            {statusBreakdown.map((item) => {
              const percent = metrics.total ? Math.round((item.count / metrics.total) * 100) : 0;
              return (
                <div key={item.status} className="space-y-1 rounded-lg border bg-background/80 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <p className="font-medium text-primary">{item.status.replace('_', ' ')}</p>
                    <p className="text-muted-foreground">{item.count} ({percent}%)</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

function Metric({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-muted-foreground">
        <p className="text-xs font-semibold uppercase tracking-wide">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}
