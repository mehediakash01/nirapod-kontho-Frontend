'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    title: '1. Secure Report Intake',
    desc: 'Users submit incidents with category, location, and description. Anonymous mode is available when identity safety is critical.',
  },
  {
    title: '2. Moderator Verification',
    desc: 'Moderators review submitted cases, add decision notes, and mark valid reports for trusted intervention workflows.',
  },
  {
    title: '3. NGO Case Assignment',
    desc: 'Verified reports are assigned to NGOs with priority levels so teams can start support action in a structured timeline.',
  },
  {
    title: '4. Ongoing Follow-up',
    desc: 'NGO admins update case status and notes, while users receive notifications about every meaningful case movement.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="text-center text-3xl font-bold text-primary sm:text-4xl"
      >
        How It Works
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ delay: 0.08, duration: 0.5 }}
        className="mx-auto mt-4 max-w-3xl text-center text-sm leading-relaxed text-gray-600 sm:text-base"
      >
        The platform is designed to reduce confusion: each report follows a visible path from submission to verification,
        assignment, and ongoing support updates.
      </motion.p>

      <div className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm transition"
          >
            <h3 className="text-lg font-semibold text-primary">{step.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}