'use client';

import { motion } from 'framer-motion';

const pillars = [
  {
    title: 'Confidential Intake',
    description:
      'Submit sensitive reports with identity protection controls and transparent status states.',
  },
  {
    title: 'Structured Verification',
    description:
      'Moderators review evidence and add notes before any escalation or assignment action.',
  },
  {
    title: 'Intervention Coordination',
    description:
      'NGO teams receive prioritized cases and maintain follow-up records with internal notes.',
  },
];

export default function PlatformScope() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Platform Blueprint</p>
          <h2 className="mt-3 text-3xl font-bold text-primary sm:text-4xl">Built For Safety, Clarity, And Action</h2>
          <p className="mt-4 text-sm leading-relaxed text-gray-600 sm:text-base">
            Nirapod Kontho is not only a form submission tool. It is a full response workflow where each report can be
            reviewed, assigned, and tracked until closure with clear accountability.
          </p>
        </motion.div>

        <div className="space-y-4">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm"
            >
              <h3 className="text-lg font-semibold text-primary">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
