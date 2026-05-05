'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileSearch,
  ShieldCheck,
  Siren,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DashboardAnalytics from '@/components/shared/DashboardAnalytics';
import { Badge } from '@/components/ui/badge';
import { ListSkeleton, PageSkeleton } from '@/components/shared/LoadingSkeletons';
import {
  getRecentDecisions,
  getVerificationOverview,
  getPendingReports,
} from '@/src/modules/verification/services/verification.api';

export default function ModeratorDashboardPage() {
  const { data: overview, isLoading: isOverviewLoading, error: overviewError } = useQuery({
    queryKey: ['verification-overview'],
    queryFn: getVerificationOverview,
  });

  const { data: recent, isLoading: isRecentLoading } = useQuery({
    queryKey: ['verification-recent'],
    queryFn: getRecentDecisions,
  });

  const { data: pending } = useQuery({
    queryKey: ['pending-reports-mini'],
    queryFn: getPendingReports,
    select: (items) => items.slice(0, 5),
  });

  if (isOverviewLoading) {
    return <PageSkeleton />;
  }

  if (overviewError || !overview) {
    return <p className="text-red-600">Failed to load moderator overview.</p>;
  }

  return (
    <ProtectedRoute allowedRoles={['MODERATOR', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <DashboardAnalytics />

        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <FileSearch className="size-3.5" />
                Moderator Workspace
              </div>
              <h1 className="text-2xl font-bold text-primary sm:text-3xl">Verification Command Center</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Monitor incoming reports, prioritize urgent incidents, and keep verification decisions traceable.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild className="gap-2">
                <Link href="/dashboard/moderator/pending">
                  Review Queue <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <Link href="/dashboard/moderator/reviewed">
                  Decision History <ClipboardCheck className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <MetricCard title="Pending" value={overview.pendingCount} icon={<FileSearch className="size-4" />} />
          <MetricCard title="Urgent" value={overview.urgentPendingCount} icon={<Siren className="size-4" />} tone="danger" />
          <MetricCard title="Approved" value={overview.approvedByMe} icon={<CheckCircle2 className="size-4" />} tone="success" />
          <MetricCard title="Rejected" value={overview.rejectedByMe} icon={<XCircle className="size-4" />} tone="warning" />
          <MetricCard title="Today" value={overview.reviewedTodayByMe} icon={<TrendingUp className="size-4" />} tone="info" />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="border-border/70 bg-card/70 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Priority Queue Snapshot</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Latest reports waiting for verification review.</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/moderator/pending">
                  Open Queue <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {pending?.length ? (
                pending.map((item) => (
                  <div key={item.id} className="rounded-xl border bg-background/80 p-3">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="font-medium text-primary">{item.type.replaceAll('_', ' ')}</p>
                      <Badge variant={item.severity === 'URGENT' ? 'destructive' : 'outline'}>
                        {item.severity ?? 'UNSPECIFIED'}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No pending reports in the queue.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/70 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Decisions</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">Your latest approval and rejection outcomes.</p>
              </div>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/moderator/reviewed">
                  View All <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {isRecentLoading ? (
                <ListSkeleton count={4} />
              ) : recent?.length ? (
                recent.slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 rounded-xl border bg-background/80 p-3">
                    <div>
                      <p className="text-sm font-medium text-primary">{item.report.type.replaceAll('_', ' ')}</p>
                      <p className="text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                    <Badge variant={item.status === 'APPROVED' ? 'secondary' : 'destructive'}>
                      {item.status === 'APPROVED' ? <ShieldCheck className="size-3" /> : <XCircle className="size-3" />}
                      {item.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No decisions recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="border-border/70 bg-card/70">
            <CardContent className="flex items-center gap-3 pt-4">
              <ClipboardCheck className="size-5 text-primary" />
              <p className="text-sm text-muted-foreground">Use checklist before every decision.</p>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/70">
            <CardContent className="flex items-center gap-3 pt-4">
              <Siren className="size-5 text-red-600" />
              <p className="text-sm text-muted-foreground">Prioritize urgent reports first.</p>
            </CardContent>
          </Card>
          <Card className="border-border/70 bg-card/70">
            <CardContent className="flex items-center gap-3 pt-4">
              <Clock3 className="size-5 text-amber-600" />
              <p className="text-sm text-muted-foreground">Add clear notes for downstream NGO action.</p>
            </CardContent>
          </Card>
        </div>
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
  tone?: 'default' | 'danger' | 'success' | 'warning' | 'info';
}) {
  const toneClass = {
    default: 'text-primary',
    danger: 'text-rose-700',
    success: 'text-emerald-700',
    warning: 'text-amber-700',
    info: 'text-indigo-700',
  }[tone];

  return (
    <Card className="border-border/70 bg-card/70 shadow-sm">
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between text-muted-foreground">
          <p className="text-xs font-semibold uppercase tracking-wide">{title}</p>
          {icon}
        </div>
        <p className={`text-2xl font-bold ${toneClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
