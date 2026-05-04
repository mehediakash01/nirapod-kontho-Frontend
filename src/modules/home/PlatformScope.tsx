'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, Handshake, Lock } from 'lucide-react';

const pillars = [
  {
    title: 'Anonymous Reporting',
    description: 'Identity controls help people document harm without exposing themselves first.',
    example: 'Recent pattern: most sensitive reports were submitted with identity hidden.',
    icon: Lock,
  },
  {
    title: 'Verified Escalation',
    description: 'Moderators review evidence before any case moves to operational partners.',
    example: 'Example: duplicate entries are filtered before a partner receives a case.',
    icon: ClipboardCheck,
  },
  {
    title: 'Partner Response',
    description: 'Trusted NGO teams receive structured cases with priority and follow-up context.',
    example: 'Example: urgent shelter requests are separated from lower-risk documentation.',
    icon: Handshake,
  },
];

export default function PlatformScope() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:py-28">
      <div
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(30deg, var(--color-primary) 12%, transparent 12.5%, transparent 87%, var(--color-primary) 87.5%, var(--color-primary)), linear-gradient(150deg, var(--color-primary) 12%, transparent 12.5%, transparent 87%, var(--color-primary) 87.5%, var(--color-primary))',
          backgroundSize: '42px 72px',
        }}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-muted/45 to-background" />

      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5 }}
          className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-end"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Platform Blueprint</p>
            <h2 className="mt-4 max-w-xl font-serif text-4xl font-semibold leading-tight text-accent dark:text-foreground sm:text-5xl">
              Built like a security layer, not a form.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-[1.7] text-muted-foreground">
            The workflow separates disclosure, verification, and intervention so a vulnerable person can move forward
            without losing control of their identity or evidence.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={pillar.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="group min-h-[280px] overflow-hidden rounded-3xl border border-primary/10 bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="mt-7 text-xl font-bold text-accent dark:text-foreground">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-[1.7] text-muted-foreground">{pillar.description}</p>

                <div className="mt-7 translate-y-2 rounded-2xl border border-secondary/20 bg-secondary/10 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-secondary">Real example</p>
                  <p className="mt-2 text-sm leading-[1.6] text-accent dark:text-foreground">{pillar.example}</p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
