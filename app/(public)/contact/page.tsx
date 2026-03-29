'use client';

import { motion } from 'framer-motion';
import { Mail, Users, Clock, ArrowRight, MessageSquare, Shield, Send } from 'lucide-react';

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

const channels = [
  {
    icon: Mail,
    label: 'General Inquiries',
    email: 'support@nirapodkontho.org',
    note: 'Response within 24 – 48 hours',
    tag: 'Support',
    accent: 'text-secondary',
    bg: 'bg-secondary/8',
    border: 'border-secondary/20',
  },
  {
    icon: Users,
    label: 'Partnership & NGO Onboarding',
    email: 'partnerships@nirapodkontho.org',
    note: 'Include your org profile and focal contact',
    tag: 'Partnerships',
    accent: 'text-accent',
    bg: 'bg-accent/8',
    border: 'border-accent/20',
  },
  {
    icon: Shield,
    label: 'Safety & Moderation',
    email: 'moderation@nirapodkontho.org',
    note: 'For escalations, policy, and review concerns',
    tag: 'Safety',
    accent: 'text-primary',
    bg: 'bg-primary/8',
    border: 'border-primary/20',
  },
];

const faqs = [
  { q: 'How quickly are reports reviewed?', a: 'Moderators aim to review within 12 hours. Urgent cases are flagged for immediate attention.' },
  { q: 'Can NGOs apply to join the network?', a: 'Yes — send your organisation profile to partnerships@nirapodkontho.org for onboarding review.' },
  { q: 'Is my identity safe when I contact you?', a: 'All communications are encrypted. You may use an anonymous email address if preferred.' },
];

export default function ContactPage() {
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
            <span className="h-px w-8 bg-secondary" />Contact
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7 }}
            className="mt-4 text-[clamp(2.4rem,6vw,4rem)] font-black leading-[0.95] tracking-[-0.03em] text-foreground">
            Connect With<br /><span className="text-primary">The Platform</span><br />Team
          </motion.h1>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.5 }} style={{ originX: 0 }}
            className="mt-5 h-[3px] w-20 rounded-full bg-gradient-to-r from-secondary to-accent" />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Use these channels for platform collaboration, NGO onboarding questions, and operational partnership discussions. Every message is read by a real team member.
          </motion.p>
        </section>

        {/* ── CONTACT CARDS ── */}
        <section>
          <FadeUp className="mb-8">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60">
              <span className="h-px w-8 bg-current" />Contact channels
            </p>
          </FadeUp>

          <div className="grid gap-5 md:grid-cols-3">
            {channels.map((c, i) => {
              const Icon = c.icon;
              return (
                <FadeUp key={c.label} delay={i * 0.1}>
                  <article className={`group relative overflow-hidden rounded-3xl border ${c.border} bg-white/80 backdrop-blur-sm p-7 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${c.bg} mb-5`}>
                      <Icon size={20} className={c.accent} />
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${c.accent} mb-2`}>{c.tag}</p>
                    <h2 className="text-base font-bold text-foreground leading-snug mb-3">{c.label}</h2>
                    <a href={`mailto:${c.email}`}
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold ${c.accent} hover:underline break-all`}>
                      <Send size={12} />{c.email}
                    </a>
                    <div className="mt-3 flex items-center gap-1.5 text-[12px] text-muted-foreground">
                      <Clock size={11} />{c.note}
                    </div>
                    <div className="absolute bottom-0 left-0 h-[3px] w-0 rounded-full bg-gradient-to-r from-secondary to-accent transition-all duration-500 group-hover:w-full" />
                  </article>
                </FadeUp>
              );
            })}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section>
          <FadeUp className="mb-8">
            <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground/60 mb-3">
              <span className="h-px w-8 bg-current" />Common questions
            </p>
            <h2 className="text-2xl font-black text-foreground tracking-tight">Before you write to us</h2>
          </FadeUp>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="group rounded-2xl border border-primary/8 bg-white/70 backdrop-blur-sm p-6 transition-all hover:border-primary/20 hover:shadow-md hover:bg-white">
                  <div className="flex items-start gap-4">
                    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-primary/8 mt-0.5">
                      <MessageSquare size={14} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{f.q}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── BOTTOM BANNER ── */}
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
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/60 mb-2">In crisis right now?</p>
                <h3 className="text-xl font-black text-white">Do not wait for a reply — call <span className="text-secondary">999</span> or <span className="text-secondary">109</span>.</h3>
                <p className="mt-1.5 text-sm text-white/65">These hotlines are live around the clock for immediate help.</p>
              </div>
              <a href="tel:999" className="group inline-flex flex-shrink-0 items-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-primary shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5">
                Call Emergency <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </FadeUp>

      </div>
    </main>
  );
}