'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { getMyDonations } from '@/src/modules/payment/services/payment.api';

export default function UserDonationsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['my-donations'],
    queryFn: getMyDonations,
  });

  const summary = useMemo(() => {
    const donations = data ?? [];
    return {
      total: donations.length,
      successful: donations.filter((d) => d.paymentStatus === 'SUCCESS').length,
      pending: donations.filter((d) => d.paymentStatus === 'PENDING').length,
      totalAmount: donations
        .filter((d) => d.paymentStatus === 'SUCCESS')
        .reduce((sum, item) => sum + item.amount, 0),
    };
  }, [data]);

  return (
    <ProtectedRoute allowedRoles={['USER']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">My Donations</h1>
            <p className="text-sm text-gray-600">Track one-time and monthly donation payments.</p>
          </div>
          <Link href="/donation" className="rounded bg-secondary px-4 py-2 text-sm font-medium text-white">
            Donate Again
          </Link>
        </div>

        <div className="grid gap-3 md:grid-cols-4">
          <Metric title="Total Records" value={summary.total} />
          <Metric title="Successful" value={summary.successful} />
          <Metric title="Pending" value={summary.pending} />
          <Metric title="Amount (Success)" value={`$${summary.totalAmount.toFixed(2)}`} />
        </div>

        {isLoading ? <p>Loading donation history...</p> : null}
        {!isLoading && error ? <p className="text-red-600">Failed to load donation history.</p> : null}

        {!isLoading && !error && !data?.length ? (
          <div className="rounded-lg border bg-white p-6 text-sm text-gray-600">
            No donation records found yet.
          </div>
        ) : null}

        {!isLoading && !error && data?.length ? (
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="min-w-full text-sm">
              <thead className="border-b bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b last:border-b-0">
                    <td className="px-4 py-3">{new Date(item.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium">${item.amount.toFixed(2)}</td>
                    <td className="px-4 py-3">
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
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{item.transactionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </ProtectedRoute>
  );
}

function Metric({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-primary">{value}</p>
    </div>
  );
}
