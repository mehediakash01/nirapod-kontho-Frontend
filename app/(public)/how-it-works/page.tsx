'use client';

import { motion } from 'framer-motion';

const phases = [
  {
    title: 'Report Submission',
    detail: 'Users provide incident type, location, and description with optional anonymity.',
  },
  {
    title: 'Verification Review',
    detail: 'Moderators evaluate reports and classify them as approved or rejected with notes.',
  },
  {
    title: 'NGO Assignment',
    detail: 'Approved reports are assigned to NGOs with case priority and operational ownership.',
  },
  {
    title: 'Case Updates',
    detail: 'NGO teams update status and internal notes while users receive notification updates.',
  },
];

export default function HowItWorksPage() {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Workflow</p>
          <h1 className="mt-2 text-4xl font-bold text-primary">How The Response System Works</h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-gray-600 sm:text-base">
            Every incident follows an operational lifecycle so users are not left in uncertainty.
          </p>
        </motion.header>

        <div className="space-y-4">
          {phases.map((phase, index) => (
            <motion.section
              key={phase.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
              className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">Phase {index + 1}</p>
              <h2 className="mt-1 text-xl font-semibold text-primary">{phase.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{phase.detail}</p>
            </motion.section>
          ))}
        </div>
      </div>
    </main>
  );
}
