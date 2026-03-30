'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
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
  ArrowUpNarrowWide,
  Building2,
  ClipboardCheck,
  Handshake,
  Layers,
  Plus,
  Search,
  Wallet,
} from 'lucide-react';
import CreateNgoForm, { type CreateNgoFormValues } from '@/src/modules/super-admin/components/CreateNgoForm';
import {
  assignNgoToReport,
  createNgoWithAdmin,
  getAllNgos,
  getSuperAdminAnalytics,
  getVerifiedReports,
  type ReportPriority,
} from '@/src/modules/super-admin/services/super-admin.api';

const PRIORITIES: ReportPriority[] = ['LOW', 'MEDIUM', 'HIGH'];

type AssignmentDraft = {
  ngoId: string;
  priority: ReportPriority;
};

type NgoSortKey = 'name' | 'createdAt' | 'openCases';

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
    mutationFn: ({ reportId, ngoId, priority }: { reportId: string; ngoId: string; priority: ReportPriority }) =>
      assignNgoToReport(reportId, { ngoId, priority }),
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

  const toggleSort = (nextKey: NgoSortKey) => {
    if (nextKey === sortKey) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(nextKey);
    setSortDirection(nextKey === 'name' ? 'asc' : 'desc');
  };

  const updateDraft = (reportId: string, patch: Partial<AssignmentDraft>) => {
    setAssignmentDrafts((prev) => {
      const current = prev[reportId] ?? { ngoId: '', priority: 'HIGH' as const };
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

    await assignMutation.mutateAsync({
      reportId,
      ngoId: draft.ngoId,
      priority: draft.priority,
    });
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-8">
        <section className="rounded-2xl border border-border/70 bg-card/60 p-5 shadow-sm backdrop-blur-xl sm:p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-primary sm:text-3xl">Super Admin Command Center</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage NGOs, assign verified incidents, and oversee platform trust operations.
              </p>
            </div>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
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
        </section>

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

        <section className="grid gap-6 xl:grid-cols-[1.25fr_1fr]">
          <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur-md sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-primary">NGO Registry</h2>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={ngoSearch}
                    onChange={(event) => setNgoSearch(event.target.value)}
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
                  {filteredAndSortedNgos.map((ngo) => {
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
              <p className="mt-4 text-sm text-muted-foreground">Loading analytics...</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur-md sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-primary">Assign Verified Reports to NGO</h2>
              <p className="text-sm text-muted-foreground">
                Match verified incidents to the most appropriate NGO with a priority level.
              </p>
            </div>
            <Badge variant="outline">{unassignedReports.length} unassigned</Badge>
          </div>

          {reportsQuery.isLoading ? <p>Loading verified reports...</p> : null}
          {reportsQuery.error ? <p className="text-sm text-red-600">Failed to load reports.</p> : null}

          {!reportsQuery.isLoading && !reportsQuery.error && !unassignedReports.length ? (
            <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
              No unassigned verified reports found.
            </p>
          ) : null}

          <div className="grid gap-4 lg:grid-cols-2">
            {unassignedReports.map((report) => {
              const draft = assignmentDrafts[report.id] ?? { ngoId: '', priority: 'HIGH' as const };

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
                    {report.location} | {new Date(report.createdAt).toLocaleString()}
                  </p>

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
                </article>
              );
            })}
          </div>
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

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-background/80 px-3 py-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-primary">{value}</p>
    </div>
  );
}
