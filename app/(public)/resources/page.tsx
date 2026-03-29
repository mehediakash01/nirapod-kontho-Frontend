'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, Bell, LayoutDashboard, ArrowRight, ChevronRight, AlertTriangle, Shield, Info } from 'lucide-react';

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

const resources = [
  {
    icon: AlertTriangle,
    title: 'Emergency Response',
    number: '999',
    numberLabel: 'Police & Emergency',
    details: 'Immediate assistance for active threats, violence in progress, and life-threatening situations.',
    tag: 'Urgent',
    accent: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-100',
    tagBg: 'bg-red-100 text-red-600',
  },
  {
    icon: Shield,
    title: 'Women & Child Helpline',
    number: '109',
    numberLabel: 'National Helpline',
    details: 'Dedicated 24/7 support for women and child protection concerns, abuse, and domestic violence.',
    tag: 'Protection',
    accent: 'text-secondary',
    bg: 'bg-secondary/8',
    border: 'border-secondary/20',
    tagBg: 'bg-secondary/10 text-secondary',
  },
  {
    icon: LayoutDashboard,
    title: 'Platform Support',
    number: null,
    numberLabel: 'Dashboard Notifications',
    details: 'Track your report status, receive NGO updates, and follow up on assigned cases from your dashboard.',
    tag: 'In-Platform',
    accent: 'text-primary',
    bg: 'bg-primary/8',
    border: 'border-primary/20',
    tagBg: 'bg-primary/10 text-primary',
  },
];

const tips = [
  { icon: Bell, tip: 'Enable notifications in your dashboard to get real-time case updates from your assigned NGO.' },
  { icon: Shield, tip: 'Use the anonymous reporting option if you are concerned about identity exposure at any point.' },
  { icon: Info, tip: 'If your case hasn\'t moved in 48 hours, use the in-dashboard escalation button or email support.' },
];

export default function ResourcesPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-primary/[0.025] to-secondary/[0.04]" />
        <div className="absolute -left-48 top-0 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute right-0 top-32 h-[400px] w-[400px] rounded-full bg-secondary/8 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: 'linear-gradient(var(--color-primary,#1a4f9c) 1px,transparent 1px),linear-gradient(90deg,var(--color-primary,#1a4f9c) 1px,transparent 1px)', backgroundSize: '72px 72px' }} />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-20 space-y-24">

        {/* ── HERO ── */}
        <section>
          <motion.p initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">
            <span className="h-px w-8 bg-secondary" />Support Resources
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-4 text-[clamp(2.4rem,6vw,4rem)] font-black leading-[0.95] tracking-[-0.03em] text-foreground">
            Help Channels<br /><span className="text-primary">& Practical</span><br />Guidance
          </motion.h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.5 }} style={{ originX: 0 }}
            className="mt-5 h-[3px] w-20 rounded-full bg-gradient-to-r from-secondary to-accent" />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Whether the situation is urgent or ongoing, these channels connect you to the right support — from national hotlines to the platforms own case-tracking tools.
          </motion.p>
        </section>

        {/* ── RESOURCE CARDS ── */}
        <section>
          <FadeUp className="mb-8">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
              <span className="h-px w-8 bg-current" />Available channels
            </p>
          </FadeUp>

          <div className="grid gap-5 md:grid-cols-3">
            {resources.map((r, i) => {
              const Icon = r.icon;
              return (
                <FadeUp key={r.title} delay={i * 0.1}>
                  <article className={`group relative overflow-hidden rounded-3xl border ${r.border} bg-white/80 backdrop-blur-sm p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full`}>
                    <div className="flex items-start justify-between mb-5">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${r.bg}`}>
                        <Icon size={20} className={r.accent} />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full ${r.tagBg}`}>{r.tag}</span>
                    </div>

                    <h2 className="text-base font-bold text-foreground mb-2">{r.title}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground flex-1">{r.details}</p>

                    <div className={`mt-5 pt-4 border-t ${r.border} flex items-center justify-between`}>
                      {r.number ? (
                        <a href={`tel:${r.number}`} className={`text-2xl font-black ${r.accent} tracking-tight hover:underline`}>{r.number}</a>
                      ) : (
                        <span className={`text-sm font-bold ${r.accent}`}>Via Dashboard</span>
                      )}
                      <span className="text-[11px] text-muted-foreground">{r.numberLabel}</span>
                    </div>

                    <div className="absolute bottom-0 left-0 h-[3px] w-0 rounded-full bg-gradient-to-r from-secondary to-accent transition-all duration-500 group-hover:w-full" />
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* ── TIPS ── */}
        <section>
          <FadeUp className="mb-8">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">
              <span className="h-px w-8 bg-current" />Practical tips
            </p>
            <h2 className="text-2xl font-black text-foreground tracking-tight">Get the most from the platform</h2>
          </FadeUp>

          <div className="space-y-3">
            {tips.map((t, i) => {
              const Icon = t.icon;
              return (
                <FadeUp key={i} delay={i * 0.08}>
                  <div className="flex items-start gap-4 rounded-2xl border border-primary/8 bg-white/70 backdrop-blur-sm p-5 transition-all hover:border-primary/20 hover:shadow-md">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-primary/8 mt-0.5">
                      <Icon size={15} className="text-primary" />
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80">{t.tip}</p>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* ── CTA ROW ── */}
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl border border-primary/10 bg-white/80 backdrop-blur-sm p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary mb-2">Ready to act?</p>
                <h3 className="text-xl font-black text-foreground">Start documenting your incident right now.</h3>
                <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
                  The secure form takes under 2 minutes. Your details are encrypted from the first keystroke.
                </p>
              </div>
              <Link href="/dashboard/user/create"
                className="group inline-flex flex-shrink-0 items-center gap-2.5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:-translate-y-0.5">
                Open Report Form <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </FadeUp>

      </div>
    </main>
  );
}