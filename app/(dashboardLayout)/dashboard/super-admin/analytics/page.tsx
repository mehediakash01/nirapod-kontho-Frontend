'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { BarChart3, HeartHandshake, Layers3, ShieldCheck } from 'lucide-react';
import { getDonationDashboard } from '@/src/modules/payment/services/payment.api';
import { getSuperAdminAnalytics } from '@/src/modules/super-admin/services/super-admin.api';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export default function SuperAdminAnalyticsPage() {
  const analyticsQuery = useQuery({
    queryKey: ['super-admin-analytics'],
    queryFn: getSuperAdminAnalytics,
  });

  const donationQuery = useQuery({
    queryKey: ['donation-dashboard'],
    queryFn: getDonationDashboard,
  });

  const trend = useMemo(() => {
    return (donationQuery.data?.monthlyTrend ?? []).slice(-6);
  }, [donationQuery.data]);

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">Platform Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cross-section of safety operations, NGO activity, and donor performance.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <AnalyticsCard
            title="NGO Network"
            value={analyticsQuery.data ? String(analyticsQuery.data.totalNgos) : '--'}
            icon={<ShieldCheck className="size-4" />}
            caption="Active NGO organizations"
          />
          <AnalyticsCard
            title="Reports Verified"
            value={analyticsQuery.data ? String(analyticsQuery.data.verifiedReports) : '--'}
            icon={<BarChart3 className="size-4" />}
            caption="Moderator-approved incidents"
          />
          <AnalyticsCard
            title="Active Cases"
            value={analyticsQuery.data ? String(analyticsQuery.data.activeCases) : '--'}
            icon={<Layers3 className="size-4" />}
            caption="Under review and in progress"
          />
          <AnalyticsCard
            title="Donation Volume"
            value={donationQuery.data ? currency.format(donationQuery.data.summary.totalAmount) : '--'}
            icon={<HeartHandshake className="size-4" />}
            caption="All recorded donations"
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">Monthly Donation Trend</h2>
            <p className="mt-1 text-sm text-muted-foreground">Latest six periods from payment analytics.</p>

            {!trend.length ? (
              <p className="mt-4 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                No trend data available.
              </p>
            ) : (
              <div className="mt-4 space-y-2">
                {trend.map((item) => (
                  <div key={item.period} className="flex items-center justify-between rounded-lg border bg-background/80 px-3 py-2">
                    <p className="text-sm text-muted-foreground">{item.period}</p>
                    <p className="text-sm font-semibold text-primary">{currency.format(item.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">Moderation Health</h2>
            <p className="mt-1 text-sm text-muted-foreground">Status mix from current super-admin analytics.</p>

            <div className="mt-4 space-y-2">
              <HealthRow label="Submitted" value={analyticsQuery.data?.submittedReports ?? 0} />
              <HealthRow label="Verified" value={analyticsQuery.data?.verifiedReports ?? 0} />
              <HealthRow label="Rejected" value={analyticsQuery.data?.rejectedReports ?? 0} />
              <HealthRow label="Resolved Cases" value={analyticsQuery.data?.resolvedCases ?? 0} />
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

function AnalyticsCard({
  title,
  value,
  icon,
  caption,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  caption: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between text-muted-foreground">
        <p className="text-xs font-semibold uppercase tracking-wide">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold text-primary">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}

function HealthRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-background/80 px-3 py-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-primary">{value}</p>
    </div>
  );
}
