'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Shield, Eye, GitBranch, Users, CheckCircle2, Zap,
  ArrowRight, ChevronRight, Heart, Lock, Globe,
} from 'lucide-react';

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

/* ─── Data ───────────────────────────────────────────────────────────────── */
const pillars = [
  {
    icon: Shield,
    label: 'Mission',
    headline: 'Safe, stigma-free reporting',
    body: 'Enable every citizen to speak up about harm with clear, verified pathways to real-world response—without fear of exposure.',
    accent: 'text-secondary',
    bg: 'bg-secondary/8',
    border: 'border-secondary/20',
    num: '01',
  },
  {
    icon: Eye,
    label: 'Vision',
    headline: 'A trusted digital bridge',
    body: 'Build the connective tissue between survivors, trained moderators, NGO partners, and support funding across Bangladesh.',
    accent: 'text-accent',
    bg: 'bg-accent/8',
    border: 'border-accent/20',
    num: '02',
  },
  {
    icon: GitBranch,
    label: 'Approach',
    headline: 'Privacy-first, role-based',
    body: 'Privacy-aware intake, structured role decisions, and transparent case progression from first report to final resolution.',
    accent: 'text-primary',
    bg: 'bg-primary/8',
    border: 'border-primary/20',
    num: '03',
  },
];

const workflow = [
  { step: '01', title: 'Submit', desc: 'Anonymous or named report filed securely through the platform.', icon: Lock },
  { step: '02', title: 'Moderate', desc: 'Trained moderators review, verify, and categorise the incident.', icon: Eye },
  { step: '03', title: 'Assign', desc: 'Case forwarded to the best-matched NGO partner in the network.', icon: Users },
  { step: '04', title: 'Resolve', desc: 'NGO takes action and reports progress back to the platform.', icon: CheckCircle2 },
];

const stats = [
  { value: '2,400+', label: 'Reports filed' },
  { value: '18', label: 'NGO partners' },
  { value: '91%', label: 'Resolution rate' },
  { value: '< 4 h', label: 'Avg. assignment' },
];

const values = [
  { icon: Lock, title: 'Privacy by design', desc: 'Identity protection is built into every layer of the system.' },
  { icon: Heart, title: 'Survivor-centred', desc: 'Every decision prioritises the dignity and safety of the person reporting.' },
  { icon: Globe, title: 'Open accountability', desc: 'Clear audit trails ensure no case disappears without a record.' },
  { icon: Zap, title: 'Speed of response', desc: 'Fast routing gets help to those who need it before situations escalate.' },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <main className="relative overflow-hidden">

      {/* ── Global background ─────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-primary/[0.025] to-secondary/[0.04]" />
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

      <div className="mx-auto max-w-6xl px-6 py-20 space-y-32">

        {/* ══ HERO SECTION ════════════════════════════════════════════════ */}
        <section className="relative">

          {/* Large decorative number */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-4 -top-10 select-none text-[clamp(8rem,20vw,14rem)] font-black leading-none text-primary/[0.04] lg:block hidden"
          >
            NK
          </div>

          <div className="lg:grid lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">

            <div>
              <motion.p
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary"
              >
                <span className="h-px w-8 bg-secondary" />
                About the platform
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7 }}
                className="mt-4 text-[clamp(2.8rem,7vw,5rem)] font-black leading-[0.95] tracking-[-0.03em] text-foreground"
              >
                <span className="text-primary">Nirapod</span>
                <br />
                <span>Kontho</span>
                <span className="ml-3 inline-block bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                  ·
                </span>
              </motion.h1>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5, ease: 'easeOut' }}
                style={{ originX: 0 }}
                className="mt-5 h-[3px] w-24 rounded-full bg-gradient-to-r from-secondary to-accent"
              />

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                A safety-first reporting platform designed to connect citizens with a
                structured support network — transforming one report into an
                accountable workflow:{' '}
                <span className="font-semibold text-foreground/80">
                  moderation, NGO assignment, case follow-up, and user updates.
                </span>
              </motion.p>
            </div>

            {/* Stats column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-12 lg:mt-0 grid grid-cols-2 gap-3 min-w-[220px]"
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.07 }}
                  className="rounded-2xl border border-primary/8 bg-white/70 p-4 text-center backdrop-blur-sm shadow-sm"
                >
                  <div className="text-xl font-black text-primary leading-none">{s.value}</div>
                  <div className="mt-1.5 text-[11px] text-muted-foreground">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ══ PILLARS ═════════════════════════════════════════════════════ */}
        <section>
          <FadeUp>
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 mb-10">
              <span className="h-px w-8 bg-current" />
              What drives us
            </p>
          </FadeUp>

          <div className="grid gap-5 md:grid-cols-3">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <FadeUp key={p.label} delay={i * 0.1}>
                  <article
                    className={`group relative overflow-hidden rounded-3xl border ${p.border} bg-white/80 backdrop-blur-sm p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                  >
                    {/* Large faded number */}
                    <span
                      aria-hidden
                      className={`pointer-events-none absolute -right-2 -top-3 select-none text-[5.5rem] font-black leading-none ${p.accent} opacity-[0.07]`}
                    >
                      {p.num}
                    </span>

                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${p.bg} mb-5`}>
                      <Icon size={20} className={p.accent} />
                    </div>

                    <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${p.accent} mb-2`}>
                      {p.label}
                    </p>
                    <h2 className="text-lg font-bold text-foreground leading-snug mb-3">{p.headline}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>

                    {/* Hover bottom border */}
                    <div className={`absolute bottom-0 left-0 h-[3px] w-0 rounded-full bg-gradient-to-r from-secondary to-accent transition-all duration-500 group-hover:w-full`} />
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* ══ HOW IT WORKS ════════════════════════════════════════════════ */}
        <section className="relative">
          {/* bg accent block */}
          <div className="absolute inset-x-0 inset-y-8 rounded-3xl bg-gradient-to-br from-primary/[0.04] via-secondary/[0.03] to-transparent -z-10 border border-primary/5" />

          <div className="px-8 py-12">
            <FadeUp className="mb-12">
              <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">
                <span className="h-px w-8 bg-current" />
                The workflow
              </p>
              <h2 className="text-3xl font-black text-foreground tracking-tight">
                One report, four steps to resolution
              </h2>
            </FadeUp>

            {/* Steps */}
            <div className="relative grid gap-6 md:grid-cols-4">
              {/* Connecting line (desktop) */}
              <div className="hidden md:block absolute top-[2.2rem] left-[calc(12.5%+1rem)] right-[calc(12.5%+1rem)] h-px bg-gradient-to-r from-secondary/30 via-primary/30 to-accent/30" />

              {workflow.map((step, i) => {
                const Icon = step.icon;
                return (
                  <FadeUp key={step.step} delay={i * 0.1}>
                    <div className="relative flex flex-col items-center text-center md:items-start md:text-left gap-3">
                      {/* Icon circle */}
                      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary/15 bg-white shadow-md shadow-primary/8">
                        <Icon size={20} className="text-primary" />
                        {/* step number dot */}
                        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-[9px] font-black text-white">
                          {step.step}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-sm font-black text-foreground uppercase tracking-wider">{step.title}</h3>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  </FadeUp>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ VALUES ══════════════════════════════════════════════════════ */}
        <section>
          <FadeUp className="mb-10 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-end">
            <div>
              <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">
                <span className="h-px w-8 bg-current" />
                Our values
              </p>
              <h2 className="text-3xl font-black text-foreground tracking-tight leading-tight">
                Principles that guide<br />every decision
              </h2>
            </div>
            <p className="mt-4 lg:mt-0 text-sm leading-relaxed text-muted-foreground max-w-md">
              From product choices to moderation policies, these four values shape how Nirapod Kontho operates — and why people trust it.
            </p>
          </FadeUp>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <FadeUp key={v.title} delay={i * 0.08}>
                  <div className="group flex gap-4 rounded-2xl border border-primary/8 bg-white/70 backdrop-blur-sm p-5 transition-all hover:border-primary/20 hover:shadow-lg hover:bg-white">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/8 transition-colors group-hover:bg-primary/12">
                      <Icon size={18} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{v.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{v.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* ══ CTA BANNER ══════════════════════════════════════════════════ */}
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-10 shadow-2xl shadow-primary/25">
            {/* Background decoration */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
              <div className="absolute -bottom-10 left-1/3 h-48 w-48 rounded-full bg-secondary/20 blur-2xl" />
              <svg className="absolute right-0 bottom-0 opacity-10 h-48" viewBox="0 0 200 200" fill="none">
                <circle cx="200" cy="200" r="160" stroke="white" strokeWidth="0.8" />
                <circle cx="200" cy="200" r="100" stroke="white" strokeWidth="0.8" />
              </svg>
            </div>

            <div className="relative lg:flex lg:items-center lg:justify-between gap-8">
              <div className="max-w-xl">
                <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/60 mb-3">
                  <span className="h-px w-6 bg-white/40" />
                  Ready to speak up?
                </p>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight tracking-tight">
                  Your report could protect<br />
                  <span className="text-secondary">someones life today.</span>
                </h2>
                <p className="mt-3 text-sm text-white/65 leading-relaxed max-w-md">
                  It takes under two minutes. Your identity stays protected. A real person will review it.
                </p>
              </div>

              <div className="mt-8 lg:mt-0 flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link
                  href="/dashboard/user/create"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-primary shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
                >
                  Submit a Report
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/donation"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:border-white/40"
                >
                  Support the Cause
                  <ChevronRight size={15} className="opacity-60" />
                </Link>
              </div>
            </div>
          </div>
        </FadeUp>

      </div>
    </main>
  );
}