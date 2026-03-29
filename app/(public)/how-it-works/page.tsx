'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Eye, Users, CheckCircle2, ArrowRight, ChevronRight, Bell } from 'lucide-react';

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

const phases = [
  {
    step: '01',
    icon: Lock,
    title: 'Report Submission',
    detail: 'Users provide incident type, location, and description. Identity is optional — every report is encrypted from the first keystroke.',
    who: 'Reporter',
    whoColor: 'bg-secondary/10 text-secondary',
    accent: 'border-secondary/30',
    accentBg: 'bg-secondary/8',
    accentText: 'text-secondary',
    bullets: ['Anonymous or named submission', 'Incident type & location input', 'Supporting evidence upload', 'Encrypted end-to-end'],
  },
  {
    step: '02',
    icon: Eye,
    title: 'Verification Review',
    detail: 'Trained moderators evaluate each submission. Reports are approved with category tags, or declined with a note explaining why.',
    who: 'Moderator',
    whoColor: 'bg-accent/10 text-accent',
    accent: 'border-accent/30',
    accentBg: 'bg-accent/8',
    accentText: 'text-accent',
    bullets: ['Human-led review process', 'Category classification', 'Approval or rejection with notes', 'Escalation for urgent cases'],
  },
  {
    step: '03',
    icon: Users,
    title: 'NGO Assignment',
    detail: 'Approved reports are matched to the best-fit NGO partner based on type, region, and capacity. The NGO receives ownership of the case.',
    who: 'NGO',
    whoColor: 'bg-primary/10 text-primary',
    accent: 'border-primary/30',
    accentBg: 'bg-primary/8',
    accentText: 'text-primary',
    bullets: ['Region & type-based matching', 'Priority level assigned', 'NGO notified instantly', 'Operational ownership transferred'],
  },
  {
    step: '04',
    icon: CheckCircle2,
    title: 'Case Updates & Resolution',
    detail: 'NGO teams update case status and internal notes at each milestone. Reporters receive push notifications at key progress points.',
    who: 'All Parties',
    whoColor: 'bg-green-100 text-green-700',
    accent: 'border-green-200',
    accentBg: 'bg-green-50',
    accentText: 'text-green-600',
    bullets: ['NGO posts progress updates', 'Reporter receives notifications', 'Case notes preserved for audit', 'Resolution flagged and closed'],
  },
];

const roles = [
  { title: 'Reporter', desc: 'Anyone facing harassment, abuse, or injustice. Can report anonymously or with an account.', dot: 'bg-secondary' },
  { title: 'Moderator', desc: 'Trained platform staff who review, verify, and categorise all incoming reports before escalation.', dot: 'bg-accent' },
  { title: 'NGO Partner', desc: 'Verified organisations that take ownership of approved cases and provide real-world intervention.', dot: 'bg-primary' },
];

export default function HowItWorksPage() {
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
            <span className="h-px w-8 bg-secondary" />Workflow
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-4 text-[clamp(2.4rem,6vw,4rem)] font-black leading-[0.95] tracking-[-0.03em] text-foreground">
            How The<br /><span className="text-primary">Response</span><br />System Works
          </motion.h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.5 }} style={{ originX: 0 }}
            className="mt-5 h-[3px] w-20 rounded-full bg-gradient-to-r from-secondary to-accent" />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Every incident follows a structured operational lifecycle so reporters are never left in the dark — from the first submission to final resolution.
          </motion.p>

          {/* Phase quick-nav pills */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-2">
            {phases.map((p) => (
              <span key={p.step} className={`inline-flex items-center gap-1.5 rounded-full border ${p.accent} ${p.accentBg} px-3 py-1.5 text-xs font-bold ${p.accentText}`}>
                <span className="font-black">{p.step}</span>{p.title}
              </span>
            ))}
          </motion.div>
        </section>

        {/* ── PHASE CARDS ── */}
        <section>
          <FadeUp className="mb-10">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">
              <span className="h-px w-8 bg-current" />The four phases
            </p>
            <h2 className="text-2xl font-black text-foreground tracking-tight">One report, four stages to resolution</h2>
          </FadeUp>

          <div className="relative space-y-5">
            {/* Vertical timeline line */}
            <div className="absolute left-[2.15rem] top-12 bottom-12 w-px bg-gradient-to-b from-secondary/40 via-primary/20 to-green-300/40 hidden md:block" />

            {phases.map((phase, i) => {
              const Icon = phase.icon;
              return (
                <FadeUp key={phase.step} delay={i * 0.1}>
                  <article className={`group relative overflow-hidden rounded-3xl border ${phase.accent} bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5`}>
                    <div className="flex flex-col md:flex-row">
                      {/* Left accent strip */}
                      <div className={`md:w-1.5 h-1.5 md:h-auto rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none ${phase.accentBg} flex-shrink-0 transition-all`} />

                      <div className="p-7 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            {/* Step icon circle */}
                            <div className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border-2 ${phase.accent} bg-white shadow-sm`}>
                              <Icon size={20} className={phase.accentText} />
                              <span className={`absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black text-white ${phase.accentBg.replace('/8', '')} ${phase.accentText.replace('text-', 'bg-')}`}
                                style={{ backgroundColor: 'currentcolor' }}>
                                <span className="text-white">{phase.step.replace('0', '')}</span>
                              </span>
                            </div>
                            <div>
                              <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${phase.accentText} mb-0.5`}>Phase {phase.step}</p>
                              <h3 className="text-lg font-black text-foreground tracking-tight">{phase.title}</h3>
                            </div>
                          </div>
                          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${phase.whoColor}`}>{phase.who}</span>
                        </div>

                        <p className="mt-4 text-sm leading-relaxed text-muted-foreground max-w-2xl">{phase.detail}</p>

                        {/* Bullet checklist */}
                        <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2">
                          {phase.bullets.map((b) => (
                            <div key={b} className="flex items-center gap-2 text-xs text-foreground/70">
                              <CheckCircle2 size={12} className={phase.accentText} />
                              {b}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-[3px] w-0 rounded-full bg-gradient-to-r from-secondary to-accent transition-all duration-500 group-hover:w-full" />
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* ── ROLES ── */}
        <section>
          <FadeUp className="mb-8">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">
              <span className="h-px w-8 bg-current" />Who is involved
            </p>
            <h2 className="text-2xl font-black text-foreground tracking-tight">Three roles, one goal</h2>
          </FadeUp>

          <div className="grid gap-4 md:grid-cols-3">
            {roles.map((r, i) => (
              <FadeUp key={r.title} delay={i * 0.09}>
                <div className="group rounded-2xl border border-primary/8 bg-white/70 backdrop-blur-sm p-6 transition-all hover:border-primary/20 hover:shadow-lg hover:bg-white">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${r.dot}`} />
                    <h3 className="font-black text-foreground text-sm uppercase tracking-wider">{r.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{r.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-10 shadow-2xl shadow-primary/25">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
              <svg className="absolute right-0 bottom-0 opacity-[0.08] h-48" viewBox="0 0 200 200" fill="none">
                <circle cx="200" cy="200" r="160" stroke="white" strokeWidth="1" />
                <circle cx="200" cy="200" r="100" stroke="white" strokeWidth="1" />
              </svg>
            </div>
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Bell size={14} className="text-secondary" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/60">Step one takes 2 minutes</p>
                </div>
                <h3 className="text-2xl font-black text-white leading-tight">
                  Ready to start the process?
                </h3>
                <p className="mt-2 text-sm text-white/65 max-w-md">Your report sets the entire workflow in motion. Identity is always your choice.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                <Link href="/dashboard/user/create"
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-primary shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
                  File a Report <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="/resources"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20">
                  View Resources <ChevronRight size={14} className="opacity-60" />
                </Link>
              </div>
            </div>
          </div>
        </FadeUp>

      </div>
    </main>
  );
}