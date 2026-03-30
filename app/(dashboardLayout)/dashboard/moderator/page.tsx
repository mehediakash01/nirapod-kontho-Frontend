'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ClipboardCheck, Clock3, ShieldCheck, Siren, XCircle } from 'lucide-react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
    return <p>Loading moderator overview...</p>;
  }

  if (overviewError || !overview) {
    return <p className="text-red-600">Failed to load moderator overview.</p>;
  }

  return (
    <ProtectedRoute allowedRoles={['MODERATOR', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Moderator Overview</h1>
          <p className="text-sm text-gray-600">Monitor verification workload, urgency, and your latest decisions.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader><CardTitle className="text-sm">Pending Reports</CardTitle></CardHeader>
            <CardContent className="pt-0 text-2xl font-bold text-primary">{overview.pendingCount}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Urgent Pending</CardTitle></CardHeader>
            <CardContent className="pt-0 text-2xl font-bold text-red-600">{overview.urgentPendingCount}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Approved By You</CardTitle></CardHeader>
            <CardContent className="pt-0 text-2xl font-bold text-emerald-600">{overview.approvedByMe}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Rejected By You</CardTitle></CardHeader>
            <CardContent className="pt-0 text-2xl font-bold text-amber-700">{overview.rejectedByMe}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-sm">Reviewed Today</CardTitle></CardHeader>
            <CardContent className="pt-0 text-2xl font-bold text-indigo-600">{overview.reviewedTodayByMe}</CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Priority Queue Snapshot</CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/moderator/pending">
                  Open Queue <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {pending?.length ? (
                pending.map((item) => (
                  <div key={item.id} className="rounded-lg border p-3">
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

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Decisions</CardTitle>
              <Button asChild size="sm" variant="outline">
                <Link href="/dashboard/moderator/reviewed">
                  View All <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {isRecentLoading ? (
                <p className="text-sm text-muted-foreground">Loading decisions...</p>
              ) : recent?.length ? (
                recent.slice(0, 6).map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 rounded-lg border p-3">
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
          <Card className="bg-muted/30">
            <CardContent className="flex items-center gap-3 pt-4">
              <ClipboardCheck className="size-5 text-primary" />
              <p className="text-sm text-muted-foreground">Use checklist before every decision.</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
            <CardContent className="flex items-center gap-3 pt-4">
              <Siren className="size-5 text-red-600" />
              <p className="text-sm text-muted-foreground">Prioritize urgent reports first.</p>
            </CardContent>
          </Card>
          <Card className="bg-muted/30">
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
