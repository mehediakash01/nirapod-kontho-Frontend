'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { getDonationDashboard } from '@/src/modules/payment/services/payment.api';

export default function SuperAdminPaymentsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['donation-dashboard'],
    queryFn: getDonationDashboard,
  });

  const maxTrend = useMemo(() => {
    if (!data?.monthlyTrend?.length) {
      return 0;
    }

    return Math.max(...data.monthlyTrend.map((item) => item.amount));
  }, [data]);

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Payment Dashboard</h1>
          <p className="text-sm text-gray-600">Monitor donations, subscription payments, and recent transactions.</p>
        </div>

        {isLoading ? <p>Loading payment dashboard...</p> : null}
        {!isLoading && error ? <p className="text-red-600">Failed to load payment dashboard.</p> : null}

        {!isLoading && !error && data ? (
          <>
            <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
              <Metric title="Total Amount" value={`$${data.summary.totalAmount.toFixed(2)}`} />
              <Metric title="Success" value={data.summary.totalSuccessfulDonations} />
              <Metric title="Pending" value={data.summary.totalPendingDonations} />
              <Metric title="Failed" value={data.summary.totalFailedDonations} />
              <Metric title="This Month" value={`$${data.summary.thisMonthAmount.toFixed(2)}`} />
              <Metric title="Monthly Subs" value={data.summary.monthlySubscriptionPayments} />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold text-primary">12-Month Donation Trend</h2>
                <div className="space-y-2">
                  {data.monthlyTrend.map((item) => (
                    <div key={item.period} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{item.period}</span>
                        <span>${item.amount.toFixed(2)}</span>
                      </div>
                      <div className="h-2 rounded bg-gray-100">
                        <div
                          className="h-2 rounded bg-secondary"
                          style={{
                            width: maxTrend > 0 ? `${Math.max((item.amount / maxTrend) * 100, 2)}%` : '2%',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border bg-white p-4">
                <h2 className="mb-3 text-lg font-semibold text-primary">Recent Transactions</h2>
                {!data.recentTransactions.length ? (
                  <p className="text-sm text-gray-600">No transactions found.</p>
                ) : (
                  <div className="space-y-2">
                    {data.recentTransactions.map((item) => (
                      <div key={item.id} className="rounded border p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-primary">
                              {item.user.name || 'Unknown User'} ({item.user.email})
                            </p>
                            <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleString()}</p>
                            <p className="mt-1 text-xs text-gray-500">{item.transactionId}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold">${item.amount.toFixed(2)}</p>
                            <span
                              className={`rounded px-2 py-1 text-xs font-medium ${
                                item.paymentStatus === 'SUCCESS'
                                  ? 'bg-green-100 text-green-700'
                                  : item.paymentStatus === 'FAILED'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {item.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </>
        ) : null}
      </div>
    </ProtectedRoute>
  );
}

function Metric({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
      <p className="mt-1 text-xl font-semibold text-primary">{value}</p>
    </div>
  );
}
