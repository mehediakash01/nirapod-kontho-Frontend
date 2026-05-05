'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { FileText, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ReportCard from '@/src/modules/report/components/ReportCard';
import { useReports } from '@/src/modules/report/hooks/useReports';
import type { ReportStatus } from '@/src/modules/report/types';
import { CardGridSkeleton } from '@/components/shared/LoadingSkeletons';
import { Pagination } from '@/components/shared/Pagination';

type StatusFilter = 'ALL' | ReportStatus;
type SortOption = 'newest' | 'oldest' | 'severity';

const PAGE_SIZE = 6;
const STATUS_FILTERS: StatusFilter[] = ['ALL', 'SUBMITTED', 'VERIFIED', 'REJECTED', 'DRAFT'];
const SEVERITY_WEIGHT = {
  URGENT: 3,
  MODERATE: 2,
  MILD: 1,
};

export default function UserReportsPage() {
  const { data, isLoading } = useReports();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const reports = useMemo(() => data ?? [], [data]);

  const summary = useMemo(() => {
    return {
      total: reports.length,
      submitted: reports.filter((report) => report.status === 'SUBMITTED').length,
      verified: reports.filter((report) => report.status === 'VERIFIED').length,
      rejected: reports.filter((report) => report.status === 'REJECTED').length,
    };
  }, [reports]);

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase();

    return reports
      .filter((report) => {
        const matchesStatus = statusFilter === 'ALL' || report.status === statusFilter;
        const matchesSearch =
          !query ||
          `${report.type} ${report.description} ${report.location} ${report.severity}`
            .toLowerCase()
            .includes(query);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }

        if (sortBy === 'severity') {
          return SEVERITY_WEIGHT[b.severity] - SEVERITY_WEIGHT[a.severity];
        }

        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [reports, search, sortBy, statusFilter]);

  const paginatedReports = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredReports.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredReports]);

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
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold dark:text-white">My Reports</h1>
        </div>
        <CardGridSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              <FileText className="size-3.5" />
              Report History
            </div>
            <h1 className="text-2xl font-bold text-primary sm:text-3xl">My Reports</h1>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              Search, sort, and track your submitted incident reports from one workspace.
            </p>
          </div>

          <Button asChild className="h-10 gap-2">
            <Link href="/dashboard/user/create">
              <Plus className="size-4" />
              Create Report
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total" value={summary.total} />
        <SummaryCard label="Submitted" value={summary.submitted} tone="warning" />
        <SummaryCard label="Verified" value={summary.verified} tone="success" />
        <SummaryCard label="Rejected" value={summary.rejected} tone="danger" />
      </section>

      <section className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search by type, location, severity, or description"
              className="h-10 pl-9"
            />
          </div>

          <label className="flex items-center gap-2 rounded-lg border bg-background px-3">
            <SlidersHorizontal className="size-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(event) => updateStatusFilter(event.target.value as StatusFilter)}
              className="h-10 bg-transparent text-sm outline-none"
              aria-label="Filter reports by status"
            >
              {STATUS_FILTERS.map((status) => (
                <option key={status} value={status}>
                  {status === 'ALL' ? 'All statuses' : status}
                </option>
              ))}
            </select>
          </label>

          <select
            value={sortBy}
            onChange={(event) => updateSortBy(event.target.value as SortOption)}
            className="h-10 rounded-lg border bg-background px-3 text-sm outline-none"
            aria-label="Sort reports"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="severity">Highest severity</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
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
          <Badge variant="outline">{filteredReports.length} results</Badge>
        </div>
      </section>

      {paginatedReports.length ? (
        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm">
          <div className="grid gap-4 p-4 md:grid-cols-2">
            {paginatedReports.map((report) => (
              <ReportCard key={report.id} report={report} />
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
        <section className="rounded-2xl border border-dashed bg-card/70 p-8 text-center">
          <h2 className="text-lg font-semibold text-primary">No reports found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search or filter, or create a new report when you need to submit an incident.
          </p>
        </section>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number;
  tone?: 'default' | 'warning' | 'success' | 'danger';
}) {
  const toneClass = {
    default: 'text-primary',
    warning: 'text-amber-700',
    success: 'text-emerald-700',
    danger: 'text-rose-700',
  }[tone];

  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}
