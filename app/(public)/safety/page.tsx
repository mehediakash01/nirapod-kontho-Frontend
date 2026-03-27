'use client';

import { motion } from 'framer-motion';

const controls = [
  'Role-based access control across all dashboards and sensitive operations',
  'Anonymous reporting option to reduce exposure risk for vulnerable users',
  'Moderation-first workflow before assignment to external support organizations',
  'Case-note and status trail for operational accountability and continuity',
];

export default function SafetyPage() {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-primary/10 bg-gradient-to-r from-primary to-secondary p-8 text-white"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">Safety & Privacy</p>
          <h1 className="mt-2 text-4xl font-bold">Designed With Protection In Mind</h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/85 sm:text-base">
            The platform is structured so sensitive reports move through controlled stages with clear ownership, reduced data exposure,
            and meaningful update visibility.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          {controls.map((line, index) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              className="rounded-2xl border border-primary/10 bg-white p-5"
            >
              <p className="text-sm leading-relaxed text-gray-700">{line}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
