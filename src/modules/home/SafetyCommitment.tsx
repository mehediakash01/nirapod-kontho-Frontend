'use client';

import { motion } from 'framer-motion';

const practices = [
  'Role-based access boundaries for user, moderator, NGO, and super-admin dashboards',
  'Clear report state transitions with moderation notes and case auditability',
  'Donation traceability through status-aware payment records and dashboard visibility',
];

export default function SafetyCommitment() {
  return (
    <section className="px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl rounded-3xl border border-primary/15 bg-gradient-to-r from-white to-muted/50 p-8 shadow-sm"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Safety Commitment</p>
        <h2 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">Operational Trust By Design</h2>
        <div className="mt-6 grid gap-3">
          {practices.map((line, index) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="rounded-xl border border-primary/10 bg-white/80 px-4 py-3 text-sm leading-relaxed text-gray-700"
            >
              {line}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
