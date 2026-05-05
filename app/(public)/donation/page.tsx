'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  Heart, 
  CreditCard, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  DollarSign
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/src/hooks/useAuth';
import {
  createMonthlySubscription,
  createOneTimeCheckout,
} from '@/src/modules/payment/services/payment.api';

type DonationMode = 'one-time' | 'monthly';

const PRESET_AMOUNTS = [10, 25, 50, 100];

/* ─── Reusable fade-up wrapper ───────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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
    return (
      <main className="relative flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Heart className="h-8 w-8 animate-pulse text-secondary" />
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative overflow-hidden min-h-screen">
      {/* ── Global background ─────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0" />
        <div className="absolute -left-60 top-0 h-[600px] w-[600px] rounded-full bg-primary/8 blur-[120px]" />
        <div className="absolute right-0 top-40 h-[500px] w-[500px] rounded-full bg-secondary/8 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-primary,#1a4f9c) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary,#1a4f9c) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
        
        {/* ══ HEADER SECTION ════════════════════════════════════════════════ */}
        <section className="relative text-center max-w-3xl mx-auto mb-20">
          <FadeUp>
            <p className="inline-flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">
              <span className="h-px w-8 bg-secondary" />
              Support Our Mission
              <span className="h-px w-8 bg-secondary" />
            </p>

            <h1 className="mt-6 text-[clamp(2.5rem,5vw,4rem)] font-black leading-[1.05] tracking-tight text-foreground">
              Fuel the fight for <br className="hidden sm:block" />
              <span className="text-primary">justice & safety</span>
            </h1>

            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Your donation ensures Nirapod Kontho remains a free, secure, and always-accessible platform for those who need it most.
            </p>
          </FadeUp>
        </section>

        <div className="lg:grid lg:grid-cols-[1.2fr_1fr] lg:gap-16 items-start">
          
          {/* ══ INFO & STEPS ══════════════════════════════════════════════════ */}
          <div className="space-y-12 lg:sticky lg:top-24 mb-12 lg:mb-0">
            <FadeUp delay={0.1}>
              <div className="rounded-3xl border border-primary/10 bg-white p-8 backdrop-blur-xl shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 mb-6">
                  <ShieldCheck size={24} className="text-secondary" />
                </div>
                <h2 className="text-xl font-bold text-black mb-3">Why your support matters</h2>
                <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                  Every contribution directly funds platform security, server infrastructure, and moderator training — scaling our ability to protect citizen identities and ensure rapid responses to incidents.
                </p>
                <ul className="space-y-3">
                  {[
                    'End-to-end encrypted infrastructure',
                    '24/7 moderator availability & training',
                    'Awareness campaigns for marginalized areas'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={16} className="text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground/80 dark:text-black/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-primary/5 bg-white p-5 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 mb-3">
                    <span className="text-sm font-black text-primary">01</span>
                  </div>
                  <h3 className="text-xs font-bold text-foreground dark:text-black uppercase tracking-wider mb-1">Select Type</h3>
                  <p className="text-[11px] text-muted-foreground">One-time or monthly commitment.</p>
                </div>
                <div className="rounded-2xl border border-primary/5 bg-white p-5 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 mb-3">
                    <span className="text-sm font-black text-primary">02</span>
                  </div>
                  <h3 className="text-xs font-bold text-foreground dark:text-black uppercase tracking-wider mb-1">Choose Amount</h3>
                  <p className="text-[11px] text-muted-foreground">Pick a preset or custom value.</p>
                </div>
                <div className="rounded-2xl border border-primary/5 bg-white p-5 text-center shadow-sm">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 mb-3">
                    <span className="text-sm font-black text-primary">03</span>
                  </div>
                  <h3 className="text-xs font-bold text-foreground dark:text-black uppercase tracking-wider mb-1">Pay Securely</h3>
                  <p className="text-[11px] text-muted-foreground">Processed safely via Stripe.</p>
                </div>
              </div>
            </FadeUp>
          </div>

          {/* ══ DONATION WIDGET ═══════════════════════════════════════════════ */}
          <FadeUp delay={0.3}>
            <div className="relative rounded-3xl border border-primary/10 bg-white p-6 sm:p-10 shadow-2xl shadow-primary/5">
              
              {!user ? (
                <div className="text-center py-10">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 mb-6">
                    <Lock size={28} className="text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-3">Authentication Required</h2>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-8 leading-relaxed">
                    To ensure secure payment processing and to allow you to track your donation history, please sign in to your account.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                      href="/login"
                      className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-md transition-all hover:bg-primary/90 hover:-translate-y-0.5"
                    >
                      Login securely
                    </Link>
                    <Link
                      href="/register"
                      className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-primary/20 bg-transparent px-8 py-3.5 text-sm font-bold text-primary transition-all hover:bg-primary/5"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  
                  {/* Mode Toggle */}
                  <div className="rounded-xl border border-primary/10 bg-primary/5 p-1.5 flex box-border">
                    <button
                      onClick={() => setMode('one-time')}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all ${
                        mode === 'one-time'
                          ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <CreditCard size={16} />
                      One-time
                    </button>
                    <button
                      onClick={() => setMode('monthly')}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all ${
                        mode === 'monthly'
                          ? 'bg-white text-primary shadow-sm ring-1 ring-black/5'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Calendar size={16} />
                      Monthly
                    </button>
                  </div>

                  {/* Presets */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Select Amount</label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {PRESET_AMOUNTS.map((preset) => {
                        const isSelected = amountInput === String(preset);
                        return (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setAmountInput(String(preset))}
                            className={`flex flex-col items-center justify-center rounded-xl border p-4 transition-all ${
                              isSelected
                                ? 'border-secondary bg-secondary/10 text-secondary'
                                : 'border-primary/10 bg-white text-foreground hover:border-primary/30 hover:bg-primary/5'
                            }`}
                          >
                            <span className="text-xl font-black">${preset}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Custom Amount</label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <DollarSign size={18} className="text-muted-foreground" />
                      </div>
                      <Input
                        id="amount"
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                        placeholder="Enter amount"
                        inputMode="decimal"
                        className="pl-10 h-14 rounded-xl text-lg font-semibold border-primary/20 focus-visible:ring-secondary/50 focus-visible:border-secondary"
                      />
                    </div>
                  </div>

                  {/* Summary / Disclaimer */}
                  <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-4 flex gap-4 items-start">
                    <ShieldCheck className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-secondary-foreground mb-1">
                        Secure Stripe Checkout
                      </p>
                      <p className="text-xs leading-relaxed text-secondary-foreground/80">
                        {mode === 'one-time'
                          ? `You are preparing to make a one-time donation of $${amount || 0}. You will be redirected to Stripe's secure portal to complete the transaction.`
                          : `You are preparing to start a monthly recurring donation of $${amount || 0}/mo. You will be redirected to Stripe's secure portal to complete the setup.`}
                      </p>
                    </div>
                  </div>

                  {/* Submit Area */}
                  <div className="pt-4 border-t border-primary/10 flex flex-col gap-4">
                    <Button 
                      type="button" 
                      onClick={onCheckout} 
                      disabled={checkoutMutation.isPending}
                      className="w-full h-14 rounded-xl text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-lg transition-transform hover:-translate-y-0.5"
                    >
                      {checkoutMutation.isPending ? (
                        'Processing Redirect...'
                      ) : (
                        <span className="flex items-center gap-2">
                          Continue to Checkout <ArrowRight size={18} />
                        </span>
                      )}
                    </Button>
                    <div className="text-center">
                      <Link 
                        href="/dashboard/user/donations" 
                        className="text-xs font-bold text-muted-foreground hover:text-secondary transition-colors inline-flex items-center gap-1.5"
                      >
                        <Heart size={12} />
                        View your donation history
                      </Link>
                    </div>
                  </div>

                </div>
              )}
            </div>
          </FadeUp>
          
        </div>
      </div>
    </main>
  );
}
