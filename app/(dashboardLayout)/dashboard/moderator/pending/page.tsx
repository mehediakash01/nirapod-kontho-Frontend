'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertTriangle, CheckCircle2, ClipboardList, Search, ShieldAlert } from 'lucide-react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { CardGridSkeleton } from '@/components/shared/LoadingSkeletons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Pagination } from '@/components/shared/Pagination';
import PendingReportCard from '@/src/modules/verification/components/PendingReportCard';
import {
  getPendingReports,
  updateReportStatus,
  type ModerationAction,
  type PendingReport,
  type RejectionReason,
  type SeverityLevel,
} from '@/src/modules/verification/services/verification.api';

type SeverityFilter = 'ALL' | SeverityLevel | 'UNSPECIFIED';
type SortOption = 'newest' | 'oldest' | 'severity' | 'evidence';

const PAGE_SIZE = 4;
const SEVERITY_FILTERS: SeverityFilter[] = ['ALL', 'URGENT', 'MODERATE', 'MILD', 'UNSPECIFIED'];
const SEVERITY_WEIGHT: Record<SeverityLevel | 'UNSPECIFIED', number> = {
  URGENT: 4,
  MODERATE: 3,
  MILD: 2,
  UNSPECIFIED: 1,
};

export default function ModeratorPendingReportsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['pending-reports'],
    queryFn: getPendingReports,
  });

  const reports = useMemo(() => data ?? [], [data]);

  const summary = useMemo(() => {
    return {
      total: reports.length,
      urgent: reports.filter((report) => report.severity === 'URGENT').length,
      withEvidence: reports.filter((report) => report.evidence.length || report.voiceNoteUrl).length,
      anonymous: reports.filter((report) => report.isAnonymous).length,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reports
      .filter((report) => {
        const severity = report.severity ?? 'UNSPECIFIED';
        const matchesSeverity = severityFilter === 'ALL' || severity === severityFilter;
        const matchesSearch =
          !query ||
          `${report.type} ${report.description} ${report.location} ${report.reporterInsight?.label ?? ''}`
            .toLowerCase()
            .includes(query);

        return matchesSeverity && matchesSearch;
      })
      .sort((a, b) => sortReports(a, b, sortBy));
  }, [reports, search, severityFilter, sortBy]);

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredReports.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredReports]);

  const updateSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const updateSeverityFilter = (value: SeverityFilter) => {
    setSeverityFilter(value);
    setCurrentPage(1);
  };

  const updateSortBy = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

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
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Pending Verification Queue</h1>
          <p className="text-sm text-gray-600">Review evidence, complete checklist, and approve or reject submissions.</p>
        </div>
        <CardGridSkeleton />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">Failed to load pending reports.</p>;
  }

  return (
    <ProtectedRoute allowedRoles={['MODERATOR', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <ClipboardList className="size-3.5" />
                Verification Queue
              </div>
              <h1 className="text-2xl font-bold text-primary sm:text-3xl">Pending Reports</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Search, prioritize, and verify submitted reports with evidence review and audit notes.
              </p>
            </div>
            <Badge variant="outline">{filteredReports.length} matching reports</Badge>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Pending" value={summary.total} icon={<ClipboardList className="size-4" />} />
          <SummaryCard label="Urgent" value={summary.urgent} icon={<AlertTriangle className="size-4" />} tone="danger" />
          <SummaryCard label="With Evidence" value={summary.withEvidence} icon={<CheckCircle2 className="size-4" />} tone="success" />
          <SummaryCard label="Anonymous" value={summary.anonymous} icon={<ShieldAlert className="size-4" />} />
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search by type, location, reporter profile, or description"
                className="h-10 pl-9"
              />
            </div>
            <select
              value={severityFilter}
              onChange={(event) => updateSeverityFilter(event.target.value as SeverityFilter)}
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none"
              aria-label="Filter pending reports by severity"
            >
              {SEVERITY_FILTERS.map((severity) => (
                <option key={severity} value={severity}>
                  {severity === 'ALL' ? 'All severities' : severity}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(event) => updateSortBy(event.target.value as SortOption)}
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none"
              aria-label="Sort pending reports"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="severity">Highest severity</option>
              <option value="evidence">Most evidence</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {SEVERITY_FILTERS.map((severity) => (
              <Button
                key={severity}
                type="button"
                variant={severityFilter === severity ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSeverityFilter(severity)}
              >
                {severity === 'ALL' ? 'All' : severity}
              </Button>
            ))}
          </div>
        </section>

        {paginatedReports.length ? (
          <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm">
            <div className="grid gap-4 p-4 xl:grid-cols-2">
              {paginatedReports.map((report) => (
                <PendingReportCard
                  key={report.id}
                  report={report}
                  isUpdating={isPending}
                  onAction={handleAction}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalCount={filteredReports.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </section>
        ) : (
          <div className="rounded-2xl border border-dashed bg-card/70 p-8 text-center text-sm text-muted-foreground">
            No pending reports match the current search and filters.
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

function sortReports(a: PendingReport, b: PendingReport, sortBy: SortOption) {
  if (sortBy === 'oldest') {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }

  if (sortBy === 'severity') {
    return SEVERITY_WEIGHT[b.severity ?? 'UNSPECIFIED'] - SEVERITY_WEIGHT[a.severity ?? 'UNSPECIFIED'];
  }

  if (sortBy === 'evidence') {
    const bEvidence = b.evidence.length + (b.voiceNoteUrl ? 1 : 0);
    const aEvidence = a.evidence.length + (a.voiceNoteUrl ? 1 : 0);
    return bEvidence - aEvidence;
  }

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function SummaryCard({
  label,
  value,
  icon,
  tone = 'default',
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: 'default' | 'danger' | 'success';
}) {
  const toneClass = {
    default: 'text-primary',
    danger: 'text-rose-700',
    success: 'text-emerald-700',
  }[tone];

  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-muted-foreground">
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
        {icon}
      </div>
      <p className={`text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}
