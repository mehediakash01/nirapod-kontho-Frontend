'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getMyDonations } from '@/src/modules/payment/services/payment.api';

export default function DonationSuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'pending' | 'error'>('loading');
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    const checkDonationStatus = async () => {
      try {
        // Fetch the latest donations
        const donations = await getMyDonations();
        
        if (!donations || donations.length === 0) {
          setStatus('error');
          return;
        }

        // Find the most recent donation (typically the one we just created)
        const latestDonation = donations[0];
        setAmount(latestDonation.amount);

        // Set status based on payment status
        if (latestDonation.paymentStatus === 'SUCCESS') {
          setStatus('success');
        } else if (latestDonation.paymentStatus === 'PENDING') {
          setStatus('pending');
        } else if (latestDonation.paymentStatus === 'FAILED') {
          setStatus('error');
        }
      } catch (error) {
        console.error('Failed to fetch donation status:', error);
        setStatus('error');
      }
    };

    // Check immediately, then retry every 2 seconds for up to 20 seconds (webhook may take time)
    checkDonationStatus();
    const interval = setInterval(checkDonationStatus, 2000);
    const timeout = setTimeout(() => clearInterval(interval), 20000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section className="mx-auto max-w-2xl space-y-4 px-6 py-16 text-center">
      {status === 'loading' && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">Processing Payment</p>
          <h1 className="text-3xl font-bold text-primary">Verifying Your Donation...</h1>
          <p className="text-sm text-gray-600">Please wait while we confirm your payment status.</p>
          <div className="mt-4 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary"></div>
          </div>
        </>
      )}

      {status === 'success' && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">Payment Confirmed</p>
          <h1 className="text-3xl font-bold text-primary">Thank You For Your Support! ✅</h1>
          <p className="text-sm text-gray-600">
            Your donation of <span className="font-semibold">${amount?.toFixed(2)}</span> has been successfully received.
          </p>
        </>
      )}

      {status === 'pending' && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider text-yellow-600">Payment Processing</p>
          <h1 className="text-3xl font-bold text-primary">Payment Pending</h1>
          <p className="text-sm text-gray-600">
            Your payment is being processed. It may take a few moments to confirm. Please check your donation history shortly.
          </p>
        </>
      )}

      {status === 'error' && (
        <>
          <p className="text-xs font-semibold uppercase tracking-wider text-red-600">Payment Issue</p>
          <h1 className="text-3xl font-bold text-primary">Unable to Verify Payment</h1>
          <p className="text-sm text-gray-600">
            There was an issue verifying your payment. Please check your donation history or contact support.
          </p>
        </>
      )}

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
