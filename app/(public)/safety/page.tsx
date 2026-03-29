'use client';

import { motion } from 'framer-motion';
import { Lock, UserX, GitBranch, FileText, Eye, ShieldCheck, Key, Server } from 'lucide-react';

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

const controls = [
  {
    icon: UserX,
    title: 'Anonymous reporting',
    body: 'Users can submit without linking a name, phone, or email. The platform never requires identity for a report to be processed.',
    num: '01',
  },
  {
    icon: Lock,
    title: 'Role-based access control',
    body: 'Each role — reporter, moderator, NGO worker — sees only the data it needs. No cross-role data leakage by design.',
    num: '02',
  },
  {
    icon: Eye,
    title: 'Moderation-first workflow',
    body: 'Reports pass through expert human review before being shared with external organisations. Nothing leaves unvetted.',
    num: '03',
  },
  {
    icon: FileText,
    title: 'Audit trail & case notes',
    body: 'Every status change and internal note is logged with timestamp and actor, creating full accountability from intake to resolution.',
    num: '04',
  },
];

const principles = [
  { icon: Key, title: 'Minimal data collection', desc: 'We only ask for what is operationally necessary to route and resolve a case.' },
  { icon: Server, title: 'Encrypted at rest', desc: 'All case data is stored with encryption. Sensitive fields use additional masking.' },
  { icon: ShieldCheck, title: 'Third-party audits', desc: 'The platform undergoes regular independent security reviews and policy checks.' },
  { icon: GitBranch, title: 'Staged data access', desc: 'Data is revealed incrementally as a case advances — NGOs only see what reporters consent to share.' },
];

export default function SafetyPage() {
  return (
    <main className="relative overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-primary/[0.025] to-secondary/[0.04]" />
        <div className="absolute -left-48 top-0 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[100px]" />
        <div className="absolute right-0 top-32 h-[400px] w-[400px] rounded-full bg-secondary/8 blur-[100px]" />
        <div className="absolute inset-0 opacity-[0.022]" style={{ backgroundImage: 'linear-gradient(var(--color-primary,#1a4f9c) 1px,transparent 1px),linear-gradient(90deg,var(--color-primary,#1a4f9c) 1px,transparent 1px)', backgroundSize: '72px 72px' }} />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20 space-y-24">

        {/* ── HERO ── */}
        <section className="relative">
          <div aria-hidden className="pointer-events-none absolute -right-4 -top-8 select-none text-[clamp(6rem,16vw,12rem)] font-black leading-none text-primary/[0.04] lg:block hidden">S&P</div>

          <motion.p initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">
            <span className="h-px w-8 bg-secondary" />Safety & Privacy
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-4 text-[clamp(2.4rem,6vw,4rem)] font-black leading-[0.95] tracking-[-0.03em] text-foreground">
            Designed With<br /><span className="text-primary">Protection</span><br />In Mind
          </motion.h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.5 }} style={{ originX: 0 }}
            className="mt-5 h-[3px] w-20 rounded-full bg-gradient-to-r from-secondary to-accent" />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Sensitive reports move through controlled stages with clear ownership, reduced data exposure, and meaningful update visibility. Safety is not a feature — its the architecture.
          </motion.p>

          {/* Trust badge row */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-2.5">
            {['End-to-end encrypted', 'Anonymous option', 'Human moderation', 'RBAC enforced'].map((badge) => (
              <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/5 px-3.5 py-1.5 text-xs font-semibold text-primary/80">
                <ShieldCheck size={11} className="text-secondary" />{badge}
              </span>
            ))}
          </motion.div>
        </section>

        {/* ── CORE CONTROLS ── */}
        <section>
          <FadeUp className="mb-10">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">
              <span className="h-px w-8 bg-current" />Core controls
            </p>
            <h2 className="text-2xl font-black text-foreground tracking-tight">Four layers of protection</h2>
          </FadeUp>

          <div className="grid gap-5 md:grid-cols-2">
            {controls.map((c, i) => {
              const Icon = c.icon;
              return (
                <FadeUp key={c.title} delay={i * 0.09}>
                  <article className="group relative overflow-hidden rounded-3xl border border-primary/10 bg-white/80 backdrop-blur-sm p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <span aria-hidden className="pointer-events-none absolute -right-2 -top-3 select-none text-[5.5rem] font-black leading-none text-primary/[0.06]">{c.num}</span>
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/8">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground mb-2">{c.title}</h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">{c.body}</p>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 h-[3px] w-0 rounded-full bg-gradient-to-r from-secondary to-accent transition-all duration-500 group-hover:w-full" />
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* ── PRINCIPLES ── */}
        <section>
          <FadeUp className="mb-10">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">
              <span className="h-px w-8 bg-current" />Privacy principles
            </p>
            <h2 className="text-2xl font-black text-foreground tracking-tight">How we handle your data</h2>
          </FadeUp>

          <div className="grid gap-4 sm:grid-cols-2">
            {principles.map((p, i) => {
              const Icon = p.icon;
              return (
                <FadeUp key={p.title} delay={i * 0.08}>
                  <div className="group flex gap-4 rounded-2xl border border-primary/8 bg-white/70 backdrop-blur-sm p-5 transition-all hover:border-primary/20 hover:shadow-md hover:bg-white">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary/10">
                      <Icon size={17} className="text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{p.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                    </div>
                  </div>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* ── REASSURANCE BANNER ── */}
        <FadeUp>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-10 shadow-2xl shadow-primary/25">
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-white/5 blur-2xl" />
              <svg className="absolute right-0 bottom-0 opacity-[0.08] h-48" viewBox="0 0 200 200" fill="none">
                <circle cx="200" cy="200" r="160" stroke="white" strokeWidth="1" />
                <circle cx="200" cy="200" r="90" stroke="white" strokeWidth="1" />
              </svg>
            </div>
            <div className="relative max-w-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-5">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <h3 className="text-2xl font-black text-white leading-tight">
                Your safety is the product.<br />
                <span className="text-secondary">Not an afterthought.</span>
              </h3>
              <p className="mt-3 text-sm text-white/65 leading-relaxed">
                Every architectural decision — from how we store case notes to what an NGO worker can view — was made with the protection of vulnerable people as the primary constraint.
              </p>
            </div>
          </div>
        </FadeUp>

      </div>
    </main>
  );
}