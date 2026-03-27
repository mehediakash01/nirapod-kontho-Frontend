import Link from 'next/link';

export default function DonationSuccessPage() {
  return (
    <section className="mx-auto max-w-2xl space-y-4 px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Payment Completed</p>
      <h1 className="text-3xl font-bold text-primary">Thank You For Your Support</h1>
      <p className="text-sm text-gray-600">
        Your payment has been received. Donation status will be reflected in your history shortly.
      </p>

      <div className="flex items-center justify-center gap-3">
        <Link href="/dashboard/user/donations" className="rounded bg-primary px-4 py-2 text-sm font-medium text-white">
          View Donation History
        </Link>
        <Link href="/dashboard/user" className="rounded border px-4 py-2 text-sm font-medium">
          Back to Dashboard
        </Link>
      </div>
    </section>
  );
}
