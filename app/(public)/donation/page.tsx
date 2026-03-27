'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/src/hooks/useAuth';
import {
  createMonthlySubscription,
  createOneTimeCheckout,
} from '@/src/modules/payment/services/payment.api';

type DonationMode = 'one-time' | 'monthly';

const PRESET_AMOUNTS = [10, 25, 50, 100];

export default function DonationPage() {
  const { data: user, isLoading } = useAuth();
  const [mode, setMode] = useState<DonationMode>('one-time');
  const [amountInput, setAmountInput] = useState('25');

  const amount = useMemo(() => Number(amountInput), [amountInput]);

  const checkoutMutation = useMutation({
    mutationFn: async ({ donationMode, donationAmount }: { donationMode: DonationMode; donationAmount: number }) => {
      if (donationMode === 'one-time') {
        return createOneTimeCheckout(donationAmount);
      }

      return createMonthlySubscription(donationAmount);
    },
    onSuccess: (data) => {
      if (!data.checkoutUrl) {
        toast.error('Checkout URL not found. Please try again.');
        return;
      }

      window.location.assign(data.checkoutUrl);
    },
    onError: (err: unknown) => {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message ===
          'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Unable to start checkout. Please try again.';
      toast.error(message);
    },
  });

  const onCheckout = async () => {
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Please enter a valid amount greater than 0.');
      return;
    }

    await checkoutMutation.mutateAsync({
      donationMode: mode,
      donationAmount: amount,
    });
  };

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-6 py-16">Loading...</div>;
  }

  return (
    <section className="mx-auto max-w-4xl space-y-8 px-6 py-12">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-secondary">Support Program</p>
        <h1 className="text-3xl font-bold text-primary">Donate In 3 Simple Steps</h1>
        <p className="text-sm text-gray-600">
          Choose donation type, pick amount, and complete secure Stripe checkout.
        </p>
      </header>

      <div className="grid gap-3 rounded-lg border bg-white p-4 md:grid-cols-3">
        <StepCard index="1" title="Select Type" description="One-time support or monthly commitment." />
        <StepCard index="2" title="Choose Amount" description="Pick preset values or enter custom amount." />
        <StepCard index="3" title="Pay Securely" description="Complete payment on Stripe checkout." />
      </div>

      {!user ? (
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold text-primary">Login Required</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to start donation checkout and track your donation history.
          </p>
          <div className="mt-4 flex gap-3">
            <Link href="/login" className="rounded bg-primary px-4 py-2 text-sm font-medium text-white">
              Go to Login
            </Link>
            <Link href="/register" className="rounded border px-4 py-2 text-sm font-medium">
              Create Account
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 rounded-lg border bg-white p-6">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === 'one-time' ? 'default' : 'outline'}
              onClick={() => setMode('one-time')}
            >
              One-time Donation
            </Button>
            <Button
              type="button"
              variant={mode === 'monthly' ? 'default' : 'outline'}
              onClick={() => setMode('monthly')}
            >
              Monthly Subscription
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                className="rounded border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                onClick={() => setAmountInput(String(preset))}
              >
                ${preset}
              </button>
            ))}
          </div>

          <div className="max-w-xs space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="amount">
              Amount (USD)
            </label>
            <Input
              id="amount"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              placeholder="Enter amount"
              inputMode="decimal"
            />
          </div>

          <div className="rounded border bg-gray-50 p-3 text-sm text-gray-700">
            {mode === 'one-time'
              ? 'You will complete a one-time payment in Stripe checkout.'
              : 'You will start a monthly recurring donation in Stripe checkout.'}
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" onClick={onCheckout} disabled={checkoutMutation.isPending}>
              {checkoutMutation.isPending ? 'Redirecting to Checkout...' : 'Continue to Secure Checkout'}
            </Button>
            <Link href="/dashboard/user/donations" className="text-sm font-medium text-secondary hover:underline">
              View My Donations
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

function StepCard({ index, title, description }: { index: string; title: string; description: string }) {
  return (
    <div className="rounded border bg-gray-50 p-3">
      <p className="text-xs font-semibold text-secondary">Step {index}</p>
      <h3 className="mt-1 text-sm font-semibold text-primary">{title}</h3>
      <p className="mt-1 text-xs text-gray-600">{description}</p>
    </div>
  );
}
