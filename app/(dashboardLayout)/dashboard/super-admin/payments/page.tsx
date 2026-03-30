'use client';

import { type ReactNode, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  CircleDollarSign,
  CreditCard,
  Download,
} from 'lucide-react';
import { getDonationDashboard, type DonationDashboardData } from '@/src/modules/payment/services/payment.api';

const numberFormatter = new Intl.NumberFormat('en-US');
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});

export default function SuperAdminPaymentsPage() {
  const paymentQuery = useQuery({
    queryKey: ['donation-dashboard'],
    queryFn: getDonationDashboard,
  });

  const dashboard = paymentQuery.data;

  const latestTransactions = useMemo(
    () => (dashboard?.recentTransactions ?? []).slice(0, 8),
    [dashboard?.recentTransactions]
  );

  const { previousMonthAmount, monthlyGrowthRate } = useMemo(() => {
    if (!dashboard) {
      return { previousMonthAmount: 0, monthlyGrowthRate: 0 };
    }

    const currentMonthAmount = dashboard.summary.thisMonthAmount;
    const trendItems = dashboard.monthlyTrend;
    const previous = trendItems.length > 1 ? trendItems[trendItems.length - 2].amount : 0;

    if (previous === 0) {
      return {
        previousMonthAmount: previous,
        monthlyGrowthRate: currentMonthAmount > 0 ? 100 : 0,
      };
    }

    return {
      previousMonthAmount: previous,
      monthlyGrowthRate: ((currentMonthAmount - previous) / previous) * 100,
    };
  }, [dashboard]);

  const handleExportCsv = (data: DonationDashboardData) => {
    const header = ['id', 'amount', 'paymentStatus', 'transactionId', 'createdAt', 'userEmail', 'userName'];
    const rows = data.recentTransactions.map((transaction) => [
      transaction.id,
      transaction.amount,
      transaction.paymentStatus,
      transaction.transactionId,
      transaction.createdAt,
      transaction.user.email,
      transaction.user.name ?? '',
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => {
            const str = String(value ?? '');
            return str.includes(',') || str.includes('"') || str.includes('\n')
              ? `"${str.replace(/"/g, '""')}"`
              : str;
          })
          .join(',')
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-8">
        <section className="rounded-2xl border border-border/70 bg-card/60 p-5 shadow-sm backdrop-blur-xl sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-primary sm:text-3xl">Payment & Donations</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Track transaction health, monitor growth, and export donation activity.
              </p>
            </div>

            {dashboard ? (
              <Button type="button" variant="outline" className="gap-2" onClick={() => handleExportCsv(dashboard)}>
                <Download className="size-4" /> Export CSV
              </Button>
            ) : null}
          </div>
        </section>

        {dashboard ? (
          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              title="Total Volume"
              value={currencyFormatter.format(dashboard.summary.totalAmount)}
              icon={<CircleDollarSign className="size-5" />}
              trend={{
                positive: monthlyGrowthRate >= 0,
                text: `${monthlyGrowthRate >= 0 ? '+' : ''}${monthlyGrowthRate.toFixed(1)}% this month`,
              }}
            />
            <MetricCard
              title="Successful Txn"
              value={numberFormatter.format(dashboard.summary.totalSuccessfulDonations)}
              icon={<CreditCard className="size-5" />}
              trend={{
                positive: true,
                text: `${numberFormatter.format(dashboard.summary.totalSuccessfulDonations)} confirmed`,
              }}
            />
            <MetricCard
              title="Pending Txn"
              value={numberFormatter.format(dashboard.summary.totalPendingDonations)}
              icon={<Banknote className="size-5" />}
              trend={{
                positive: false,
                text: `${numberFormatter.format(dashboard.summary.totalPendingDonations)} awaiting settlement`,
              }}
            />
            <MetricCard
              title="Failed Txn"
              value={numberFormatter.format(dashboard.summary.totalFailedDonations)}
              icon={<ArrowDownRight className="size-5" />}
              trend={{
                positive: false,
                text: `${numberFormatter.format(dashboard.summary.totalFailedDonations)} require attention`,
              }}
            />
          </section>
        ) : null}

        {paymentQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading payment analytics...</p> : null}
        {paymentQuery.error ? (
          <p className="text-sm text-red-600">Failed to load payment dashboard data.</p>
        ) : null}

        {dashboard ? (
          <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
            <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-md">
              <h2 className="text-lg font-semibold text-primary">Recent Transactions</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Latest donation attempts with status and funding trail.
              </p>

              {!latestTransactions.length ? (
                <p className="mt-4 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                  No transactions found.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {latestTransactions.map((transaction) => (
                    <article
                      key={transaction.id}
                      className="rounded-xl border bg-background/80 p-4 transition hover:border-primary/40"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-primary">{transaction.user.email}</p>
                          <p className="text-xs text-muted-foreground">Transaction ID: {transaction.transactionId}</p>
                        </div>
                        <Badge
                          variant={
                            transaction.paymentStatus === 'SUCCESS'
                              ? 'default'
                              : transaction.paymentStatus === 'PENDING'
                                ? 'secondary'
                                : 'destructive'
                          }
                        >
                          {transaction.paymentStatus}
                        </Badge>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                        <p className="font-medium text-primary">
                          {currencyFormatter.format(transaction.amount)}
                        </p>
                        <p className="text-muted-foreground">{new Date(transaction.createdAt).toLocaleString()}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm backdrop-blur-md">
              <h2 className="text-lg font-semibold text-primary">Trend Snapshot</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Compare current month performance against previous period.
              </p>

              <div className="mt-4 space-y-3">
                <TrendRow
                  label="Current Month"
                  value={currencyFormatter.format(dashboard.summary.thisMonthAmount)}
                  positive
                />
                <TrendRow
                  label="Previous Month"
                  value={currencyFormatter.format(previousMonthAmount)}
                  positive={previousMonthAmount <= dashboard.summary.thisMonthAmount}
                />
                <TrendRow
                  label="Growth Rate"
                  value={`${monthlyGrowthRate >= 0 ? '+' : ''}${monthlyGrowthRate.toFixed(2)}%`}
                  positive={monthlyGrowthRate >= 0}
                />
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </ProtectedRoute>
  );
}

function MetricCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: ReactNode;
  trend: {
    positive: boolean;
    text: string;
  };
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur-md transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
        <div className="rounded-lg border bg-primary/10 p-2 text-primary">{icon}</div>
      </div>

      <p className="mt-2 text-2xl font-bold text-primary">{value}</p>

      <div className={`mt-2 inline-flex items-center gap-1 text-xs ${trend.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {trend.positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
        <span>{trend.text}</span>
      </div>
    </div>
  );
}

function TrendRow({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-background/80 px-3 py-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>{value}</p>
    </div>
  );
}
