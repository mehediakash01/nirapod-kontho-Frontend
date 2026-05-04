'use client';

import { motion } from 'framer-motion';
import { Clock, Users, FileText, Bell } from 'lucide-react';

const metrics = [
  {
    icon: Clock,
    value: '24/7',
    label: 'Reporting Access',
    description: 'Users can submit reports at any time with a guided form experience.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Users,
    value: 'Role-Based',
    label: 'Safety Workflow',
    description: 'Moderator, NGO, and super-admin boundaries keep operations accountable.',
    color: 'bg-accent text-accent-foreground',
  },
  {
    icon: FileText,
    value: 'Case Notes',
    label: 'Continuity Of Care',
    description: 'Internal note trails preserve context across NGO case handling teams.',
    color: 'bg-secondary/10 text-secondary',
  },
  {
    icon: Bell,
    value: 'Live Updates',
    label: 'User Visibility',
    description: 'Notifications inform users when reports are reviewed or assigned.',
    color: 'bg-primary text-primary-foreground',
  },
];

export default function Impact() {
  return (
    <section className="px-6 py-24 sm:py-28">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl text-center"
      >
        <p className="inline-flex rounded-full border border-secondary/20 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
          Platform Outcomes
        </p>

        <h2 className="mt-6 text-balance font-serif text-4xl font-semibold leading-tight text-accent dark:text-foreground sm:text-5xl">
          Signals that help teams act, not just read.
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="mx-auto mt-5 max-w-3xl text-base leading-[1.7] text-muted-foreground"
        >
          Nirapod Kontho combines secure reporting, operational transparency, and resource mobilization to strengthen real-world
          response capacity for vulnerable people.
        </motion.p>
      </motion.div>

      <div className="mx-auto mt-16 max-w-6xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 32, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-3xl border border-primary/10 bg-card p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent opacity-70" />

                <div className="relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 4 }}
                    className={`inline-flex rounded-2xl p-4 shadow-sm ${item.color}`}
                  >
                    <Icon size={28} />
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 + 0.1, duration: 0.5 }}
                    className="mt-6 text-2xl font-black text-accent dark:text-foreground"
                  >
                    {item.value}
                  </motion.p>

                  <p className="mt-1 text-sm font-bold text-accent dark:text-foreground">{item.label}</p>

                  <p className="mt-3 text-xs leading-[1.7] text-muted-foreground">{item.description}</p>

                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 + 0.2, duration: 0.6 }}
                    className="mt-4 h-1 w-8 origin-left rounded-full bg-secondary"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
