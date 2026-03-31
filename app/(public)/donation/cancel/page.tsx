'use client';

import Link from 'next/link';

export default function DonationCancelPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-4 px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-yellow-700">Payment Canceled</p>
      <h1 className="text-3xl font-bold text-primary">Donation Checkout Was Canceled</h1>
      <p className="text-sm text-gray-600">
        No worries. You can retry anytime with one-time or monthly donation options.
      </p>

      <div className="flex items-center justify-center gap-3">
        <Link href="/donation" className="rounded bg-secondary px-4 py-2 text-sm font-medium text-white">
          Retry Donation
        </Link>
        <Link href="/dashboard/user" className="rounded border px-4 py-2 text-sm font-medium">
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
}
