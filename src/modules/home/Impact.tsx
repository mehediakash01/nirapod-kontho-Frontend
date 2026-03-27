'use client';

import { motion } from 'framer-motion';

const metrics = [
  {
    value: '24/7',
    label: 'Reporting Access',
    description: 'Users can submit reports at any time with a guided form experience.',
  },
  {
    value: 'Role-Based',
    label: 'Safety Workflow',
    description: 'Moderator, NGO, and super-admin boundaries keep operations accountable.',
  },
  {
    value: 'Case Notes',
    label: 'Continuity Of Care',
    description: 'Internal note trails preserve context across NGO case handling teams.',
  },
  {
    value: 'Live Updates',
    label: 'User Visibility',
    description: 'Notifications inform users when reports are reviewed or assigned.',
  },
];

export default function Impact() {
  return (
    <section className="px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5 }}
        className="text-center text-3xl font-bold text-primary sm:text-4xl"
      >
        Real Impact
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-gray-600 sm:text-base"
      >
        Nirapod Kontho combines secure reporting, operational transparency, and resource mobilization to strengthen real-world
        response capacity for vulnerable people.
      </motion.p>

      <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            className="rounded-2xl border border-primary/10 bg-gradient-to-b from-white to-muted/40 p-5 shadow-sm"
          >
            <p className="text-xl font-bold text-primary">{item.value}</p>
            <p className="mt-1 text-sm font-semibold text-gray-800">{item.label}</p>
            <p className="mt-3 text-xs leading-relaxed text-gray-600">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}