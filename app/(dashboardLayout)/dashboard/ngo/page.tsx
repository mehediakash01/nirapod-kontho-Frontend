'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Link from 'next/link';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import DashboardAnalytics from '@/components/shared/DashboardAnalytics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardGridSkeleton, TableSkeleton } from '@/components/shared/LoadingSkeletons';
import CaseCard from '@/src/modules/ngo/components/CaseCard';
import { getMyCases, updateCase, type CaseStatus, type NgoCase } from '@/src/modules/ngo/services/ngo.api';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileText,
  FolderKanban,
  ListChecks,
  MapPin,
  MessageSquareText,
  ShieldCheck,
  Siren,
} from 'lucide-react';

const filterTabs = ['ALL', 'URGENT', 'UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const;
type FilterTab = (typeof filterTabs)[number];

export default function NgoDashboardPage() {
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');

  const { data, isLoading, error } = useQuery({
    queryKey: ['ngo-cases'],
    queryFn: getMyCases,
  });

  const cases = useMemo(() => data ?? [], [data]);

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
    const underReview = cases.filter((item) => item.status === 'UNDER_REVIEW').length;
    const inProgress = cases.filter((item) => item.status === 'IN_PROGRESS').length;
    const resolved = cases.filter((item) => item.status === 'RESOLVED' || item.status === 'CLOSED').length;
    const urgent = cases.filter((item) => item.report.severity === 'URGENT' || item.priority === 'HIGH').length;
    const active = cases.filter((item) => item.status === 'UNDER_REVIEW' || item.status === 'IN_PROGRESS').length;
    const notes = cases.reduce((sum, item) => sum + item.notes.length, 0);
    const evidence = cases.reduce((sum, item) => sum + item.report.evidence.length + (item.report.voiceNoteUrl ? 1 : 0), 0);
    const newToday = cases.filter((item) => isSameDay(new Date(item.createdAt), new Date())).length;

    return {
      total,
      underReview,
      inProgress,
      resolved,
      urgent,
      active,
      notes,
      evidence,
      newToday,
    };
  }, [cases]);

  const statusBreakdown = useMemo(
    () =>
      [
        { label: 'Under Review', value: metrics.underReview, tone: 'warning' as const },
        { label: 'In Progress', value: metrics.inProgress, tone: 'info' as const },
        {
          label: 'Resolved / Closed',
          value: metrics.resolved,
          tone: 'success' as const,
        },
      ],
    [metrics.inProgress, metrics.resolved, metrics.underReview]
  );

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

  const priorityCases = useMemo(
    () =>
      [...cases]
        .filter((item) => item.priority === 'HIGH' || item.report.severity === 'URGENT')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4),
    [cases]
  );

  const latestNote = useMemo(() => {
    return cases
      .flatMap((item) =>
        item.notes.map((note) => ({
          ...note,
          caseType: item.report.type,
          caseId: item.id,
        }))
      )
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }, [cases]);

  return (
    <ProtectedRoute allowedRoles={['NGO_ADMIN']}>
      <div className="space-y-8">
        <DashboardAnalytics />

        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
          <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <ShieldCheck className="size-3.5" />
                NGO Operations
              </div>
              <h1 className="text-2xl font-bold text-primary sm:text-3xl">Case Response Dashboard</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Coordinate assigned verified incidents, triage urgent requests, document response activity, and keep
                every case moving toward resolution.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild className="gap-2">
                  <Link href="/dashboard/ngo/cases">
                    Open All Cases <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <Link href="/dashboard/ngo/notifications">
                    View Notifications <MessageSquareText className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border bg-background/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Today&apos;s Focus</p>
              <div className="mt-4 space-y-3">
                <BriefingRow label="New assignments" value={metrics.newToday} />
                <BriefingRow label="Active cases" value={metrics.active} />
                <BriefingRow label="High priority" value={metrics.urgent} alert={metrics.urgent > 0} />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Assigned"
            value={metrics.total}
            description="All cases assigned to your organization"
            icon={<FolderKanban className="size-4" />}
          />
          <MetricCard
            title="In Progress"
            value={metrics.inProgress}
            description="Cases currently receiving active response"
            icon={<Clock3 className="size-4" />}
            tone="info"
          />
          <MetricCard
            title="Resolved"
            value={metrics.resolved}
            description="Cases resolved or formally closed"
            icon={<CheckCircle2 className="size-4" />}
            tone="success"
          />
          <MetricCard
            title="Urgent"
            value={metrics.urgent}
            description="High priority or urgent severity cases"
            icon={<AlertTriangle className="size-4" />}
            tone="alert"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-primary">Workload Health</h2>
                <p className="mt-1 text-sm text-muted-foreground">Current distribution across the response workflow.</p>
              </div>
              <Badge variant="outline">{metrics.active} active</Badge>
            </div>

            <div className="space-y-4">
              {statusBreakdown.map((item) => (
                <ProgressRow
                  key={item.label}
                  label={item.label}
                  value={item.value}
                  total={Math.max(metrics.total, 1)}
                  tone={item.tone}
                />
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <InsightCard
                icon={<FileText className="size-4" />}
                label="Evidence Files"
                value={metrics.evidence}
                detail="Attached media and voice notes available for review"
              />
              <InsightCard
                icon={<MessageSquareText className="size-4" />}
                label="Case Notes"
                value={metrics.notes}
                detail="Operational notes recorded by case handlers"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Siren className="size-4 text-rose-600" />
              <h2 className="text-lg font-semibold text-primary">Priority Queue</h2>
            </div>

            {isLoading ? (
              <TableSkeleton rows={4} columns={2} />
            ) : priorityCases.length ? (
              <div className="space-y-3">
                {priorityCases.map((item) => (
                  <PriorityCaseRow key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                No urgent or high priority cases are waiting right now.
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-primary">Recent Assignments</h2>
                <p className="mt-1 text-sm text-muted-foreground">Latest cases assigned to your NGO team.</p>
              </div>
              <Badge variant="outline">Last {recentCases.length}</Badge>
            </div>

            {isLoading ? (
              <TableSkeleton rows={4} columns={4} />
            ) : !error && recentCases.length ? (
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
            <div className="mb-4 flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              <div>
                <h2 className="text-lg font-semibold text-primary">Response Activity</h2>
                <p className="mt-1 text-sm text-muted-foreground">New assignments over the last seven days.</p>
              </div>
            </div>
            <SimpleTrendChart points={trendPoints} />

            <div className="mt-5 rounded-xl border bg-background/80 p-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                <ListChecks className="size-4" />
                Latest Team Note
              </p>
              {latestNote ? (
                <div>
                  <p className="line-clamp-2 text-sm text-muted-foreground">{latestNote.note}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {latestNote.caseType.replace('_', ' ')} | {new Date(latestNote.createdAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No case notes have been recorded yet.</p>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-primary">Case Board</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Review assigned incidents, update status, and add operational notes.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
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
          </div>

          {isLoading ? <CardGridSkeleton /> : null}

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
            <div className="rounded-xl border border-dashed bg-background/80 p-6 text-sm text-muted-foreground">
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
  description,
  tone = 'default',
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  tone?: 'default' | 'alert' | 'success' | 'info';
}) {
  const toneClass = {
    default: 'border-border/70 bg-card/70 text-primary',
    alert: 'border-rose-200 bg-rose-50/50 text-rose-700',
    success: 'border-emerald-200 bg-emerald-50/50 text-emerald-700',
    info: 'border-sky-200 bg-sky-50/50 text-sky-700',
  }[tone];

  return (
    <div className={`rounded-2xl border p-4 shadow-sm ${toneClass}`}>
      <div className="mb-2 flex items-center justify-between text-muted-foreground">
        <p className="text-xs font-semibold uppercase tracking-wide">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

function BriefingRow({ label, value, alert = false }: { label: string; value: number; alert?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold ${alert ? 'text-rose-700' : 'text-primary'}`}>{value}</span>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number;
  tone: 'warning' | 'info' | 'success';
}) {
  const percentage = Math.round((value / total) * 100);
  const barClass = {
    warning: 'bg-amber-500',
    info: 'bg-sky-500',
    success: 'bg-emerald-500',
  }[tone];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm text-muted-foreground">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full ${barClass}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function InsightCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-xl border bg-background/80 p-3">
      <div className="mb-2 flex items-center justify-between text-muted-foreground">
        <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
        {icon}
      </div>
      <p className="text-xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}

function PriorityCaseRow({ item }: { item: NgoCase }) {
  return (
    <div className="rounded-xl border bg-background/80 p-3">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-primary">{item.report.type.replace('_', ' ')}</p>
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.report.description}</p>
        </div>
        <Badge variant="destructive">{item.priority}</Badge>
      </div>
      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" />
          {item.report.location}
        </span>
        <span>{item.status.replace('_', ' ')}</span>
        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

function isSameDay(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
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
