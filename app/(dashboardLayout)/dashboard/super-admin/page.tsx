'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { CardGridSkeleton, ListSkeleton, MetricGridSkeleton } from '@/components/shared/LoadingSkeletons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  ArrowDownWideNarrow,
  ArrowRight,
  ArrowUpNarrowWide,
  Building2,
  ClipboardCheck,
  Handshake,
  Layers,
  ListChecks,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Wallet,
} from 'lucide-react';
import { Pagination } from '@/components/shared/Pagination';
import CreateNgoForm, { type CreateNgoFormValues } from '@/src/modules/super-admin/components/CreateNgoForm';
import DashboardAnalytics from '@/components/shared/DashboardAnalytics';
import {
  assignNgoToReport,
  getAssignmentRecommendations,
  createNgoWithAdmin,
  getAllNgos,
  getSuperAdminAnalytics,
  getVerifiedReports,
  type AssignmentRecommendation,
  type ReportPriority,
  type VerifiedReport,
} from '@/src/modules/super-admin/services/super-admin.api';

const PRIORITIES: ReportPriority[] = ['LOW', 'MEDIUM', 'HIGH'];
const NGO_PAGE_SIZE = 6;
const REPORT_PAGE_SIZE = 4;
const SEVERITY_WEIGHT = {
  URGENT: 4,
  MODERATE: 3,
  MILD: 2,
  UNSPECIFIED: 1,
};

type AssignmentDraft = {
  ngoId: string;
  priority: ReportPriority;
  assignmentRationale: string;
  confirmAssignment: boolean;
};

type NgoSortKey = 'name' | 'createdAt' | 'openCases';
type ReportSortKey = 'newest' | 'oldest' | 'severity';
type ReportSeverityFilter = 'ALL' | 'URGENT' | 'MODERATE' | 'MILD' | 'UNSPECIFIED';

const REPORT_TYPE_LABELS: Record<string, string> = {
  HARASSMENT: 'Harassment',
  DOMESTIC_VIOLENCE: 'Domestic Violence',
  STALKING: 'Stalking',
  CORRUPTION: 'Corruption',
  THREAT: 'Threat',
};

export default function SuperAdminDashboardPage() {
  const queryClient = useQueryClient();
  const [assignmentDrafts, setAssignmentDrafts] = useState<Record<string, AssignmentDraft>>({});
  const [ngoSearch, setNgoSearch] = useState('');
  const [sortKey, setSortKey] = useState<NgoSortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [ngoPage, setNgoPage] = useState(1);
  const [reportSearch, setReportSearch] = useState('');
  const [reportSeverity, setReportSeverity] = useState<ReportSeverityFilter>('ALL');
  const [reportSort, setReportSort] = useState<ReportSortKey>('newest');
  const [reportPage, setReportPage] = useState(1);

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
        supportedReportTypes: values.supportedReportTypes,
        coverageAreas: (values.coverageAreasCsv ?? '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        maxActiveCases: values.maxActiveCases,
        priorityEscalationHours: values.priorityEscalationHours,
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
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to create NGO';
      toast.error(message);
    },
  });

  const assignMutation = useMutation({
    mutationFn: ({
      reportId,
      ngoId,
      priority,
      assignmentRationale,
    }: {
      reportId: string;
      ngoId: string;
      priority: ReportPriority;
      assignmentRationale: string;
    }) =>
      assignNgoToReport(reportId, {
        ngoId,
        priority,
        assignmentRationale,
        confirmAssignment: true,
      }),
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
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Failed to assign NGO';
      toast.error(message);
    },
  });

  const unassignedReports = useMemo(
    () => (reportsQuery.data ?? []).filter((report) => !report.case),
    [reportsQuery.data]
  );

  const operationsSummary = useMemo(() => {
    const reports = reportsQuery.data ?? [];
    const assigned = reports.filter((report) => Boolean(report.case)).length;
    const highPriority = reports.filter((report) => report.case?.priority === 'HIGH').length;
    const ngoCount = ngosQuery.data?.length ?? 0;
    const openCases = (ngosQuery.data ?? []).reduce(
      (sum, ngo) =>
        sum + ngo.cases.filter((item) => item.status === 'UNDER_REVIEW' || item.status === 'IN_PROGRESS').length,
      0
    );

    return {
      assigned,
      unassigned: unassignedReports.length,
      highPriority,
      openCases,
      averageLoad: ngoCount ? (openCases / ngoCount).toFixed(1) : '0.0',
    };
  }, [ngosQuery.data, reportsQuery.data, unassignedReports.length]);

  const recommendationsQuery = useQuery({
    queryKey: ['assignment-recommendations', unassignedReports.map((report) => report.id).join(',')],
    queryFn: async () => {
      const rows = await Promise.all(
        unassignedReports.map(async (report) => {
          const recommendations = await getAssignmentRecommendations(report.id);
          return { reportId: report.id, recommendations };
        })
      );

      return rows.reduce<Record<string, AssignmentRecommendation[]>>((acc, row) => {
        acc[row.reportId] = row.recommendations;
        return acc;
      }, {});
    },
    enabled: unassignedReports.length > 0,
  });

  const filteredAndSortedNgos = useMemo(() => {
    const filtered = (ngosQuery.data ?? []).filter((ngo) => {
      const haystack = `${ngo.name} ${ngo.email} ${ngo.phone}`.toLowerCase();
      return haystack.includes(ngoSearch.toLowerCase().trim());
    });

    return [...filtered].sort((a, b) => {
      const aOpenCases = a.cases.filter(
        (item) => item.status === 'UNDER_REVIEW' || item.status === 'IN_PROGRESS'
      ).length;
      const bOpenCases = b.cases.filter(
        (item) => item.status === 'UNDER_REVIEW' || item.status === 'IN_PROGRESS'
      ).length;

      const direction = sortDirection === 'asc' ? 1 : -1;

      if (sortKey === 'name') {
        return a.name.localeCompare(b.name) * direction;
      }

      if (sortKey === 'openCases') {
        return (aOpenCases - bOpenCases) * direction;
      }

      return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction;
    });
  }, [ngosQuery.data, ngoSearch, sortDirection, sortKey]);

  const paginatedNgos = useMemo(() => {
    const start = (ngoPage - 1) * NGO_PAGE_SIZE;
    return filteredAndSortedNgos.slice(start, start + NGO_PAGE_SIZE);
  }, [filteredAndSortedNgos, ngoPage]);

  const filteredAndSortedReports = useMemo(() => {
    const query = reportSearch.trim().toLowerCase();

    return unassignedReports
      .filter((report) => {
        const severity = report.severity ?? 'UNSPECIFIED';
        const matchesSeverity = reportSeverity === 'ALL' || severity === reportSeverity;
        const matchesSearch =
          !query ||
          `${report.type} ${report.description} ${report.location} ${severity}`.toLowerCase().includes(query);

        return matchesSeverity && matchesSearch;
      })
      .sort((a, b) => sortReports(a, b, reportSort));
  }, [reportSearch, reportSeverity, reportSort, unassignedReports]);

  const paginatedReports = useMemo(() => {
    const start = (reportPage - 1) * REPORT_PAGE_SIZE;
    return filteredAndSortedReports.slice(start, start + REPORT_PAGE_SIZE);
  }, [filteredAndSortedReports, reportPage]);

  const updateNgoSearch = (value: string) => {
    setNgoSearch(value);
    setNgoPage(1);
  };

  const updateReportSearch = (value: string) => {
    setReportSearch(value);
    setReportPage(1);
  };

  const updateReportSeverity = (value: ReportSeverityFilter) => {
    setReportSeverity(value);
    setReportPage(1);
  };

  const updateReportSort = (value: ReportSortKey) => {
    setReportSort(value);
    setReportPage(1);
  };

  const toggleSort = (nextKey: NgoSortKey) => {
    if (nextKey === sortKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(nextKey);
    setSortDirection(nextKey === 'name' ? 'asc' : 'desc');
    setNgoPage(1);
  };

  const updateDraft = (reportId: string, patch: Partial<AssignmentDraft>) => {
    setAssignmentDrafts((prev) => {
      const current = prev[reportId] ?? {
        ngoId: '',
        priority: 'HIGH' as const,
        assignmentRationale: '',
        confirmAssignment: false,
      };
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

    if (!draft.assignmentRationale || draft.assignmentRationale.trim().length < 10) {
      toast.error('Provide assignment rationale (at least 10 characters)');
      return;
    }

    if (!draft.confirmAssignment) {
      toast.error('Confirm assignment before submitting');
      return;
    }

    await assignMutation.mutateAsync({
      reportId,
      ngoId: draft.ngoId,
      priority: draft.priority,
      assignmentRationale: draft.assignmentRationale.trim(),
    });
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-8">
        <DashboardAnalytics />

        <section className="overflow-hidden rounded-2xl border border-border/70 bg-card/70 shadow-sm backdrop-blur-xl">
          <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <ShieldCheck className="size-3.5" />
                Platform Governance
              </div>
              <h1 className="text-2xl font-bold text-primary sm:text-3xl">Super Admin Command Center</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage NGO capacity, assign verified incidents, monitor risk, and keep platform operations accountable.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild variant="outline" className="gap-2">
                  <a href="#ngo-registry">
                    NGO Registry <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="gap-2">
                  <a href="#assignment-queue">
                    Assignment Queue <Handshake className="size-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="rounded-xl border bg-background/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Operations Focus</p>
              <div className="mt-4 space-y-3">
                <MiniStat label="Unassigned verified reports" value={operationsSummary.unassigned} />
                <MiniStat label="High priority assignments" value={operationsSummary.highPriority} />
                <MiniStat label="Average active load / NGO" value={operationsSummary.averageLoad} />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="mt-4 w-full gap-2">
                    <Plus className="size-4" /> Create NGO & Admin
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create NGO + Admin</DialogTitle>
                    <DialogDescription>
                      Create an NGO organization and provision its admin account in one workflow.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateNgoForm
                    onSubmit={(values) => createNgoMutation.mutateAsync(values)}
                    isSubmitting={createNgoMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </section>

        {analyticsQuery.isLoading ? <MetricGridSkeleton /> : null}

        {analyticsQuery.data ? (
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Total NGOs"
              value={analyticsQuery.data.totalNgos}
              icon={<Building2 className="size-5" />}
              hint="Registered partner organizations"
            />
            <MetricCard
              label="Total Reports"
              value={analyticsQuery.data.totalReports}
              icon={<ClipboardCheck className="size-5" />}
              hint="All-time submitted incidents"
            />
            <MetricCard
              label="Active Cases"
              value={analyticsQuery.data.activeCases}
              icon={<Layers className="size-5" />}
              hint="Under review or in progress"
            />
            <MetricCard
              label="Total Donations"
              value={`$${analyticsQuery.data.totalSuccessfulDonations.toFixed(2)}`}
              icon={<Wallet className="size-5" />}
              hint="Successful payment volume"
            />
          </section>
        ) : null}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <InsightCard label="Assigned Reports" value={operationsSummary.assigned} icon={<Handshake className="size-4" />} />
          <InsightCard label="Unassigned Reports" value={operationsSummary.unassigned} icon={<ListChecks className="size-4" />} tone="warning" />
          <InsightCard label="Open NGO Cases" value={operationsSummary.openCases} icon={<Layers className="size-4" />} />
          <InsightCard label="High Priority" value={operationsSummary.highPriority} icon={<ClipboardCheck className="size-4" />} tone="danger" />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
          <div id="ngo-registry" className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur-md sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-primary">NGO Registry</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search partner organizations and sort by capacity or onboarding date.
                </p>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={ngoSearch}
                    onChange={(event) => updateNgoSearch(event.target.value)}
                    placeholder="Search NGO by name, email, phone"
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            {!filteredAndSortedNgos.length ? (
              <div className="rounded-xl border border-dashed bg-background/70 p-6 text-sm text-muted-foreground">
                No NGOs found.
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border">
                <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.7fr] items-center bg-muted/40 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <button type="button" onClick={() => toggleSort('name')} className="flex items-center gap-1 text-left">
                    Name {sortKey === 'name' ? (sortDirection === 'asc' ? <ArrowUpNarrowWide className="size-3" /> : <ArrowDownWideNarrow className="size-3" />) : null}
                  </button>
                  <span>Email</span>
                  <button type="button" onClick={() => toggleSort('openCases')} className="mx-auto flex items-center gap-1">
                    Open Cases {sortKey === 'openCases' ? (sortDirection === 'asc' ? <ArrowUpNarrowWide className="size-3" /> : <ArrowDownWideNarrow className="size-3" />) : null}
                  </button>
                  <button type="button" onClick={() => toggleSort('createdAt')} className="mx-auto flex items-center gap-1">
                    Added {sortKey === 'createdAt' ? (sortDirection === 'asc' ? <ArrowUpNarrowWide className="size-3" /> : <ArrowDownWideNarrow className="size-3" />) : null}
                  </button>
                  <span className="text-right">Action</span>
                </div>

                <div className="divide-y">
                  {paginatedNgos.map((ngo) => {
                    const openCases = ngo.cases.filter(
                      (item) => item.status === 'UNDER_REVIEW' || item.status === 'IN_PROGRESS'
                    ).length;
                    const loadTone = openCases >= 7 ? 'destructive' : openCases >= 3 ? 'secondary' : 'outline';

                    return (
                      <div key={ngo.id} className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.7fr] items-center gap-2 px-3 py-3 text-sm transition hover:bg-muted/20">
                        <div>
                          <p className="font-medium text-primary">{ngo.name}</p>
                          <p className="text-xs text-muted-foreground">{ngo.phone}</p>
                        </div>
                        <p className="truncate text-muted-foreground">{ngo.email}</p>
                        <div className="flex justify-center">
                          <Badge variant={loadTone}>{openCases}</Badge>
                        </div>
                        <p className="text-center text-xs text-muted-foreground">
                          {new Date(ngo.createdAt).toLocaleDateString()}
                        </p>
                        <div className="flex justify-end">
                          <Button type="button" variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Pagination
                  currentPage={ngoPage}
                  totalCount={filteredAndSortedNgos.length}
                  pageSize={NGO_PAGE_SIZE}
                  onPageChange={setNgoPage}
                />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-md">
            <h2 className="text-lg font-semibold text-primary">Quick Overview</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Current moderation and NGO response snapshot.
            </p>

            {analyticsQuery.data ? (
              <div className="mt-4 space-y-3">
                <MiniStat label="Submitted Reports" value={analyticsQuery.data.submittedReports} />
                <MiniStat label="Verified Reports" value={analyticsQuery.data.verifiedReports} />
                <MiniStat label="Rejected Reports" value={analyticsQuery.data.rejectedReports} />
                <MiniStat label="Resolved Cases" value={analyticsQuery.data.resolvedCases} />
              </div>
            ) : (
              <div className="mt-4">
                <ListSkeleton count={4} />
              </div>
            )}
          </div>
        </section>

        <section id="assignment-queue" className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur-md sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-primary">Assign Verified Reports to NGO</h2>
              <p className="text-sm text-muted-foreground">
                Match verified incidents to the most appropriate NGO with a priority level.
              </p>
            </div>
            <Badge variant="outline">{filteredAndSortedReports.length} matching</Badge>
          </div>

          <div className="mb-4 grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={reportSearch}
                onChange={(event) => updateReportSearch(event.target.value)}
                placeholder="Search verified reports by type, location, severity, or description"
                className="h-10 pl-9"
              />
            </div>
            <label className="flex items-center gap-2 rounded-lg border bg-background px-3">
              <SlidersHorizontal className="size-4 text-muted-foreground" />
              <select
                value={reportSeverity}
                onChange={(event) => updateReportSeverity(event.target.value as ReportSeverityFilter)}
                className="h-10 bg-transparent text-sm outline-none"
                aria-label="Filter assignment queue by severity"
              >
                <option value="ALL">All severities</option>
                <option value="URGENT">Urgent</option>
                <option value="MODERATE">Moderate</option>
                <option value="MILD">Mild</option>
                <option value="UNSPECIFIED">Unspecified</option>
              </select>
            </label>
            <select
              value={reportSort}
              onChange={(event) => updateReportSort(event.target.value as ReportSortKey)}
              className="h-10 rounded-lg border bg-background px-3 text-sm outline-none"
              aria-label="Sort assignment queue"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="severity">Highest severity</option>
            </select>
          </div>

          {reportsQuery.isLoading ? <CardGridSkeleton /> : null}
          {reportsQuery.error ? <p className="text-sm text-red-600">Failed to load reports.</p> : null}
          {recommendationsQuery.isLoading ? (
            <ListSkeleton count={2} />
          ) : null}

          {!reportsQuery.isLoading && !reportsQuery.error && !filteredAndSortedReports.length ? (
            <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
              No unassigned verified reports match the current search and filters.
            </p>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            {paginatedReports.map((report) => {
              const draft = assignmentDrafts[report.id] ?? {
                ngoId: '',
                priority: 'HIGH' as const,
                assignmentRationale: '',
                confirmAssignment: false,
              };
              const recommendations = recommendationsQuery.data?.[report.id] ?? [];

              return (
                <article
                  key={report.id}
                  className="rounded-xl border bg-background/70 p-4 transition hover:border-primary/40 hover:shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-primary">
                        {REPORT_TYPE_LABELS[report.type] ?? report.type}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    <Badge variant="outline">Verified</Badge>
                  </div>

                  <p className="mb-3 text-xs text-muted-foreground">
                    {report.location} | Severity: {report.severity ?? 'N/A'} | {new Date(report.createdAt).toLocaleString()}
                  </p>

                  {recommendations.length ? (
                    <div className="mb-3 space-y-2 rounded-md border bg-muted/20 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Top NGO Recommendations
                      </p>

                      {recommendations.slice(0, 3).map((item, index) => (
                        <button
                          key={item.ngoId}
                          type="button"
                          onClick={() =>
                            updateDraft(report.id, {
                              ngoId: item.ngoId,
                              assignmentRationale: `Recommended rank #${index + 1}: ${item.reasons.join('; ')}`,
                            })
                          }
                          className="flex w-full items-start justify-between rounded-md border bg-background px-3 py-2 text-left text-xs transition hover:border-primary/50"
                        >
                          <div>
                            <p className="font-semibold text-primary">{item.ngoName}</p>
                            <p className="mt-1 text-muted-foreground">{item.reasons[0]}</p>
                            <p className="text-muted-foreground">{item.reasons[2]}</p>
                          </div>
                          <Badge variant={index === 0 ? 'default' : 'outline'}>Score {item.score}</Badge>
                        </button>
                      ))}
                    </div>
                  ) : null}

                  <div className="grid gap-2 sm:grid-cols-[1.2fr_0.8fr_auto]">
                    <select
                      className="h-10 rounded-md border bg-background px-3 text-sm"
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
                      className="h-10 rounded-md border bg-background px-3 text-sm"
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
                      className="gap-1"
                      onClick={() => handleAssign(report.id)}
                      disabled={assignMutation.isPending}
                    >
                      <Handshake className="size-4" /> Assign
                    </Button>
                  </div>

                  <textarea
                    className="mt-2 min-h-20 w-full rounded-md border bg-background px-3 py-2 text-sm"
                    placeholder="Assignment rationale (required): why this NGO is chosen for this report"
                    value={draft.assignmentRationale}
                    onChange={(event) =>
                      updateDraft(report.id, { assignmentRationale: event.target.value })
                    }
                  />

                  <label className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={draft.confirmAssignment}
                      onChange={(event) =>
                        updateDraft(report.id, { confirmAssignment: event.target.checked })
                      }
                    />
                    I confirm this assignment is reviewed against type fit, urgency, and NGO capacity.
                  </label>
                </article>
              );
            })}
          </div>
          <Pagination
            currentPage={reportPage}
            totalCount={filteredAndSortedReports.length}
            pageSize={REPORT_PAGE_SIZE}
            onPageChange={setReportPage}
          />
        </section>
      </div>
    </ProtectedRoute>
  );
}

function MetricCard({
  label,
  value,
  icon,
  hint,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  hint: string;
}) {
  return (
    <div className="group rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className="rounded-lg border bg-primary/10 p-2 text-primary">{icon}</div>
      </div>
      <p className="mt-2 text-2xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function InsightCard({
  label,
  value,
  icon,
  tone = 'default',
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  tone?: 'default' | 'warning' | 'danger';
}) {
  const toneClass = {
    default: 'text-primary',
    warning: 'text-amber-700',
    danger: 'text-rose-700',
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

function MiniStat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-background/80 px-3 py-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-primary">{value}</p>
    </div>
  );
}

function sortReports(a: VerifiedReport, b: VerifiedReport, sortKey: ReportSortKey) {
  if (sortKey === 'oldest') {
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  }

  if (sortKey === 'severity') {
    return SEVERITY_WEIGHT[b.severity ?? 'UNSPECIFIED'] - SEVERITY_WEIGHT[a.severity ?? 'UNSPECIFIED'];
  }

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}
