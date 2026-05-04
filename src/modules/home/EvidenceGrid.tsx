'use client';

import { motion } from 'framer-motion';
import { Building2, FileCheck2, HandCoins, Home, type LucideIcon } from 'lucide-react';

type ImpactCard = {
  title: string;
  result: string;
  icon: LucideIcon;
};

const impacts: ImpactCard[] = [
  {
    title: 'Harassment case',
    result: 'Workplace policy changed',
    icon: Building2,
  },
  {
    title: 'Domestic violence',
    result: 'Emergency shelter in 6 hrs',
    icon: Home,
  },
  {
    title: 'Corruption tip',
    result: 'Government audit triggered',
    icon: FileCheck2,
  },
  {
    title: 'Donation $50',
    result: 'Legal aid for 3 cases',
    icon: HandCoins,
  },
];

function RedactedEvidenceVisual() {
  return (
    <div
      className="relative min-h-[340px] overflow-hidden rounded-[2rem] border border-primary/10 bg-gradient-to-br from-accent via-primary to-primary p-6 text-white shadow-xl"
      aria-label="Decorative anonymized evidence visual showing redacted records and voice waves"
      role="img"
    >
      <div className="absolute inset-0 opacity-20 blur-sm">
        <div className="absolute left-8 top-8 h-44 w-56 rotate-[-7deg] rounded-2xl bg-white/85 p-5">
          <div className="h-3 w-24 rounded bg-accent" />
          <div className="mt-5 space-y-3">
            <div className="h-2 w-44 rounded bg-slate-300" />
            <div className="h-2 w-32 rounded bg-slate-300" />
            <div className="h-3 w-48 rounded bg-slate-900" />
            <div className="h-2 w-40 rounded bg-slate-300" />
            <div className="h-3 w-36 rounded bg-slate-900" />
          </div>
        </div>
        <div className="absolute bottom-10 right-8 h-40 w-60 rotate-[8deg] rounded-2xl bg-white/80 p-5">
          <div className="flex h-20 items-end gap-2">
            {[28, 52, 36, 72, 44, 64, 34, 50, 30].map((height, index) => (
              <span key={index} className="w-3 rounded-full bg-primary" style={{ height }} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 flex h-full min-h-[288px] flex-col justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">Protected Identities</p>
          <h3 className="mt-4 max-w-sm font-serif text-3xl font-semibold leading-tight">
            Evidence can be credible without being identifiable.
          </h3>
        </div>
        <p className="max-w-sm text-sm leading-[1.7] text-white/75">
          Case details shown here are anonymized examples. Exact names, addresses, and locations stay outside public display.
        </p>
      </div>
    </div>
  );
}

export default function EvidenceGrid() {
  return (
    <section className="px-6 py-24 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5 }}
          className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              Real Impact. Protected Identities.
            </p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl font-semibold leading-tight text-accent dark:text-foreground sm:text-5xl">
              Proof of response, without exposing survivors.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-[1.7] text-muted-foreground">
              Impact examples are shown as outcomes, not identities. This helps donors and partners understand the
              response value while keeping affected people private.
            </p>
          </div>

          <RedactedEvidenceVisual />
        </motion.div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {impacts.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="rounded-3xl border border-primary/10 bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <p className="mt-6 text-sm font-bold text-muted-foreground">{item.title}</p>
                <p className="mt-2 text-lg font-black leading-snug text-accent dark:text-foreground">{item.result}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
