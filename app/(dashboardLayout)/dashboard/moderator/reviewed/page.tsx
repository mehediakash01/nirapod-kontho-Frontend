'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, History, Search, ShieldCheck, XCircle } from 'lucide-react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ListSkeleton } from '@/components/shared/LoadingSkeletons';
import { Pagination } from '@/components/shared/Pagination';
import {
  getRecentDecisions,
  type ModerationAction,
  type RecentVerificationDecision,
  type SeverityLevel,
} from '@/src/modules/verification/services/verification.api';

type StatusFilter = 'ALL' | ModerationAction;
type SortOption = 'newest' | 'oldest' | 'severity';

const PAGE_SIZE = 8;
const STATUS_FILTERS: StatusFilter[] = ['ALL', 'APPROVED', 'REJECTED'];
const SEVERITY_WEIGHT: Record<SeverityLevel | 'UNSPECIFIED', number> = {
  URGENT: 4,
  MODERATE: 3,
  MILD: 2,
  UNSPECIFIED: 1,
};

export default function ModeratorReviewedReportsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['verification-recent'],
    queryFn: getRecentDecisions,
  });
  const decisions = useMemo(() => data ?? [], [data]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const summary = useMemo(() => {
    return {
      total: decisions.length,
      approved: decisions.filter((item) => item.status === 'APPROVED').length,
      rejected: decisions.filter((item) => item.status === 'REJECTED').length,
    };
  }, [decisions]);

  const filteredDecisions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return decisions
      .filter((item) => {
        const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
        const matchesSearch =
          !query ||
          `${item.report.type} ${item.report.location} ${item.report.severity ?? ''} ${item.feedback ?? ''}`
            .toLowerCase()
            .includes(query);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => sortDecisions(a, b, sortBy));
  }, [decisions, search, sortBy, statusFilter]);

  const paginatedDecisions = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredDecisions.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredDecisions]);

  const updateSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const updateStatusFilter = (value: StatusFilter) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const updateSortBy = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Reviewed Reports</h1>
          <p className="text-sm text-gray-600">Your recent moderation decisions and recorded feedback.</p>
        </div>
        <ListSkeleton />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">Failed to load reviewed reports.</p>;
  }

  return (
    <ProtectedRoute allowedRoles={['MODERATOR', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <History className="size-3.5" />
                Decision History
              </div>
              <h1 className="text-2xl font-bold text-primary sm:text-3xl">Reviewed Reports</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Audit recent verification outcomes, search feedback notes, and review approval or rejection patterns.
              </p>
            </div>
            <Badge variant="outline">{filteredDecisions.length} matching decisions</Badge>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <SummaryCard label="Total Reviewed" value={summary.total} icon={<History className="size-4" />} />
          <SummaryCard label="Approved" value={summary.approved} icon={<CheckCircle2 className="size-4" />} tone="success" />
          <SummaryCard label="Rejected" value={summary.rejected} icon={<XCircle className="size-4" />} tone="danger" />
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search by type, location, severity, or feedback"
                className="h-10 pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(event) => updateStatusFilter(event.target.value as StatusFilter)}
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none"
              aria-label="Filter reviewed reports by decision"
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All decisions' : status}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(event) => updateSortBy(event.target.value as SortOption)}
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none"
              aria-label="Sort reviewed reports"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="severity">Highest severity</option>
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {STATUS_FILTERS.map((status) => (
              <Button
                key={status}
                type="button"
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateStatusFilter(status)}
              >
                {status === 'ALL' ? 'All' : status}
              </Button>
            ))}
          </div>
        </section>

        {paginatedDecisions.length ? (
          <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm">
            <div className="grid gap-3 p-4 lg:grid-cols-2">
              {paginatedDecisions.map((item) => (
                <article key={item.id} className="rounded-xl border bg-background/80 p-4 shadow-sm">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-primary">{item.report.type.replaceAll('_', ' ')}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.report.location}</p>
                    </div>
                    <Badge variant={item.status === 'APPROVED' ? 'secondary' : 'destructive'}>
                      {item.status === 'APPROVED' ? <ShieldCheck className="size-3" /> : <XCircle className="size-3" />}
                      {item.status}
                    </Badge>
                  </div>
                  <div className="grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                    <p>Reviewed: {new Date(item.createdAt).toLocaleString()}</p>
                    <p>Severity: {item.report.severity ?? 'UNSPECIFIED'}</p>
                  </div>
                  <p className="mt-3 rounded-lg border bg-card/70 p-3 text-sm text-muted-foreground">
                    {item.feedback || 'No feedback note recorded.'}
                  </p>
                </article>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalCount={filteredDecisions.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </section>
        ) : (
          <div className="rounded-2xl border border-dashed bg-card/70 p-8 text-center text-sm text-muted-foreground">
            No reviewed reports match the current search and filters.
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}

function sortDecisions(a: RecentVerificationDecision, b: RecentVerificationDecision, sortBy: SortOption) {
  if (sortBy === 'oldest') {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }

  if (sortBy === 'severity') {
    return SEVERITY_WEIGHT[b.report.severity ?? 'UNSPECIFIED'] - SEVERITY_WEIGHT[a.report.severity ?? 'UNSPECIFIED'];
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
