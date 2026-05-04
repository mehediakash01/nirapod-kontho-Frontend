'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, HeartHandshake, ShieldCheck, UserRound } from 'lucide-react';

const stages = [
  {
    label: 'Anonymous voice',
    stat: 'Identity hidden by default',
    icon: UserRound,
    tone: 'bg-accent text-accent-foreground',
  },
  {
    label: 'Shield verification',
    stat: 'Avg. verification: 4hrs',
    icon: ShieldCheck,
    tone: 'bg-primary text-primary-foreground',
  },
  {
    label: 'NGO handoff',
    stat: '8 standby partners',
    icon: HeartHandshake,
    tone: 'bg-secondary text-secondary-foreground',
  },
  {
    label: 'Resolved follow-up',
    stat: 'Status trail preserved',
    icon: CheckCircle2,
    tone: 'bg-white text-primary dark:bg-card',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden px-6 py-24 sm:py-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b from-primary/10 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl text-center"
      >
        <p className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          The Journey To Safety
        </p>
        <h2 className="mx-auto mt-6 max-w-3xl font-serif text-4xl font-semibold leading-tight text-accent dark:text-foreground sm:text-5xl">
          A protected route from disclosure to response.
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-[1.7] text-muted-foreground">
          The experience is designed to feel guided: a person can report anonymously, pass through verification,
          and connect to help without exposing exact identity or location.
        </p>
      </motion.div>

      <div className="mx-auto mt-16 max-w-6xl">
        <div className="relative overflow-hidden rounded-[2rem] border border-primary/10 bg-card p-6 shadow-xl shadow-primary/5 sm:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(15,118,110,0.06),transparent)]" />

          <div className="relative hidden h-64 items-center justify-between md:flex">
            <motion.svg
              className="absolute left-[8%] right-[8%] top-1/2 h-12 w-[84%] -translate-y-1/2"
              viewBox="0 0 900 90"
              fill="none"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              aria-hidden="true"
            >
              <motion.path
                d="M10 48 C130 8 210 86 320 45 S520 10 620 46 S760 85 890 40"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="10 16"
                className="text-primary/35"
                variants={{
                  hidden: { pathLength: 0 },
                  visible: { pathLength: 1 },
                }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </motion.svg>

            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ delay: index * 0.12, duration: 0.5 }}
                  className="relative z-10 flex w-1/4 flex-col items-center text-center"
                >
                  <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 border-white shadow-xl ${stage.tone}`}>
                    <Icon size={30} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-accent dark:text-foreground">{stage.label}</h3>
                  <p className="mt-2 max-w-[9rem] text-xs font-semibold leading-[1.55] text-muted-foreground">{stage.stat}</p>
                </motion.div>
              );
            })}
          </div>

          <div className="relative grid gap-4 md:hidden">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              return (
                <motion.div
                  key={stage.label}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  className="relative flex items-center gap-4 rounded-2xl border border-primary/10 bg-background/70 p-4"
                >
                  {index < stages.length - 1 ? (
                    <span className="absolute left-9 top-16 h-8 border-l-2 border-dashed border-primary/25" aria-hidden="true" />
                  ) : null}
                  <div className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${stage.tone}`}>
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-accent dark:text-foreground">{stage.label}</h3>
                    <p className="text-xs text-muted-foreground">{stage.stat}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
