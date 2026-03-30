'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Badge } from '@/components/ui/badge';
import CaseCard from '@/src/modules/ngo/components/CaseCard';
import { getMyCases, updateCase, type CaseStatus } from '@/src/modules/ngo/services/ngo.api';
import { Activity, AlertTriangle, CheckCircle2, Clock3, FolderKanban } from 'lucide-react';

const filterTabs = ['ALL', 'URGENT', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const;
type FilterTab = (typeof filterTabs)[number];

export default function NgoDashboardPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');

  const { data, isLoading, error } = useQuery({
    queryKey: ['ngo-cases'],
    queryFn: getMyCases,
  });

  const cases = data ?? [];

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

  const metrics = useMemo(() => {
    const total = cases.length;
    const inProgress = cases.filter((item) => item.status === 'IN_PROGRESS').length;
    const resolved = cases.filter((item) => item.status === 'RESOLVED' || item.status === 'CLOSED').length;
    const urgent = cases.filter((item) => item.report.severity === 'URGENT' || item.priority === 'HIGH').length;

    return {
      total,
      inProgress,
      resolved,
      urgent,
    };
  }, [cases]);

  const trendPoints = useMemo(() => {
    const days = 7;
    const points = Array.from({ length: days }, (_, index) => {
      const day = new Date();
      day.setDate(day.getDate() - (days - 1 - index));
      day.setHours(0, 0, 0, 0);
      const nextDay = new Date(day);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = cases.filter((item) => {
        const created = new Date(item.createdAt);
        return created >= day && created < nextDay;
      }).length;

      return {
        label: day.toLocaleDateString(undefined, { weekday: 'short' }),
        value: count,
      };
    });

    return points;
  }, [cases]);

  const filteredCases = useMemo(() => {
    if (activeFilter === 'ALL') {
      return cases;
    }

    if (activeFilter === 'URGENT') {
      return cases.filter((item) => item.report.severity === 'URGENT' || item.priority === 'HIGH');
    }

    return cases.filter((item) => item.status === activeFilter);
  }, [activeFilter, cases]);

  const recentCases = useMemo(
    () => [...cases].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6),
    [cases]
  );

  return (
    <ProtectedRoute allowedRoles={['NGO_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-sm sm:p-6">
          <h1 className="text-2xl font-bold text-primary sm:text-3xl">NGO Case Command</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage assigned cases, prioritize urgent incidents, and keep case movement transparent.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Total Cases" value={metrics.total} icon={<FolderKanban className="size-4" />} />
          <MetricCard title="In Progress" value={metrics.inProgress} icon={<Clock3 className="size-4" />} />
          <MetricCard title="Resolved" value={metrics.resolved} icon={<CheckCircle2 className="size-4" />} />
          <MetricCard title="Urgent" value={metrics.urgent} icon={<AlertTriangle className="size-4" />} tone="alert" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
          <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary">Recent Cases</h2>
              <Badge variant="outline">Last {recentCases.length}</Badge>
            </div>

            {!isLoading && !error && recentCases.length ? (
              <div className="overflow-hidden rounded-xl border">
                <div className="grid grid-cols-[1.2fr_0.7fr_0.6fr_0.8fr] bg-muted/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <span>Case</span>
                  <span>Status</span>
                  <span>Priority</span>
                  <span className="text-right">Created</span>
                </div>
                <div className="divide-y">
                  {recentCases.map((item) => (
                    <div key={item.id} className="grid grid-cols-[1.2fr_0.7fr_0.6fr_0.8fr] items-center px-3 py-2 text-sm">
                      <div>
                        <p className="font-medium text-primary">{item.report.type.replace('_', ' ')}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{item.report.location}</p>
                      </div>
                      <span className="text-muted-foreground">{item.status.replace('_', ' ')}</span>
                      <span className={item.priority === 'HIGH' ? 'font-semibold text-rose-700' : 'text-muted-foreground'}>{item.priority}</span>
                      <span className="text-right text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent cases to show.</p>
            )}
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              <h2 className="text-lg font-semibold text-primary">7-Day Case Trend</h2>
            </div>
            <SimpleTrendChart points={trendPoints} />
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  activeFilter === tab
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

        {isLoading ? <p>Loading assigned cases...</p> : null}

          {!isLoading && error ? <p className="text-red-600">Failed to load assigned cases.</p> : null}

          {!isLoading && !error && filteredCases.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredCases.map((item) => (
                <div
                  key={item.id}
                  className={item.report.severity === 'URGENT' || item.priority === 'HIGH' ? 'rounded-2xl border border-rose-200 bg-rose-50/30 p-1' : ''}
                >
                  <CaseCard item={item} onUpdate={handleUpdate} isUpdating={isPending} />
                </div>
              ))}
            </div>
          ) : null}

          {!isLoading && !error && !filteredCases.length ? (
            <div className="rounded-lg border bg-white p-6 text-sm text-gray-600">
              No cases found for the selected filter.
            </div>
          ) : null}
        </section>
      </div>
    </ProtectedRoute>
  );
}

function MetricCard({
  title,
  value,
  icon,
  tone = 'default',
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  tone?: 'default' | 'alert';
}) {
  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${tone === 'alert' ? 'border-rose-200 bg-rose-50/40' : 'border-border/70 bg-card/70'}`}>
      <div className="mb-2 flex items-center justify-between text-muted-foreground">
        <p className="text-xs font-semibold uppercase tracking-wide">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}

function SimpleTrendChart({ points }: { points: Array<{ label: string; value: number }> }) {
  if (!points.length) {
    return <p className="text-sm text-muted-foreground">No trend data yet.</p>;
  }

  const maxValue = Math.max(...points.map((p) => p.value), 1);
  const width = 280;
  const height = 110;
  const stepX = width / Math.max(points.length - 1, 1);

  const path = points
    .map((point, index) => {
      const x = index * stepX;
      const y = height - (point.value / maxValue) * (height - 14) - 7;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full">
        <path d={path} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
      </svg>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-muted-foreground">
        {points.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}
