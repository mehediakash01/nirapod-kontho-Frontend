'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Badge } from '@/components/ui/badge';
import { Building2, ShieldCheck, UserCog, UserRound } from 'lucide-react';
import { getAllNgos, getSuperAdminAnalytics } from '@/src/modules/super-admin/services/super-admin.api';

export default function SuperAdminUsersPage() {
  const analyticsQuery = useQuery({
    queryKey: ['super-admin-analytics'],
    queryFn: getSuperAdminAnalytics,
  });

  const ngosQuery = useQuery({
    queryKey: ['all-ngos'],
    queryFn: getAllNgos,
  });

  const stats = useMemo(() => {
    const ngos = ngosQuery.data ?? [];
    const openCases = ngos.reduce(
      (sum, ngo) => sum + ngo.cases.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length,
      0
    );

    return {
      ngoAdmins: ngos.length,
      avgCasesPerNgo: ngos.length ? (openCases / ngos.length).toFixed(1) : '0.0',
      verifiedReports: analyticsQuery.data?.verifiedReports ?? 0,
    };
  }, [analyticsQuery.data, ngosQuery.data]);

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">User & Role Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Operational overview of role ownership and workload distribution across the platform.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <RoleCard title="Super Admin" value="1" icon={<UserCog className="size-4" />} />
          <RoleCard title="NGO Admins" value={String(stats.ngoAdmins)} icon={<Building2 className="size-4" />} />
          <RoleCard title="Moderation Throughput" value={String(stats.verifiedReports)} icon={<ShieldCheck className="size-4" />} />
          <RoleCard title="Avg Cases / NGO" value={stats.avgCasesPerNgo} icon={<UserRound className="size-4" />} />
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">Role Access Matrix</h2>
          <p className="mt-1 text-sm text-muted-foreground">Current functional access by platform role.</p>

          <div className="mt-4 space-y-3">
            <AccessRow role="SUPER_ADMIN" scopes={['NGO provisioning', 'Report assignment', 'Donation analytics', 'Platform settings']} />
            <AccessRow role="MODERATOR" scopes={['Report review', 'Verification decisions', 'Content moderation']} />
            <AccessRow role="NGO_ADMIN" scopes={['Case management', 'Status transitions', 'Case notes']} />
            <AccessRow role="USER" scopes={['Report submission', 'Donation checkout', 'Notifications']} />
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

function RoleCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
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

function AccessRow({ role, scopes }: { role: string; scopes: string[] }) {
  return (
    <div className="rounded-lg border bg-background/80 p-3">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-primary">{role}</p>
        <Badge variant="outline">Active</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{scopes.join(' | ')}</p>
    </div>
  );
}
