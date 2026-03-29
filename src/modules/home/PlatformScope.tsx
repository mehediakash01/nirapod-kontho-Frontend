'use client';

import { motion } from 'framer-motion';
import { Lock, ClipboardCheck, Handshake } from 'lucide-react';

const pillars = [
  {
    title: 'Confidential Intake',
    description:
      'Submit sensitive reports with identity protection controls and transparent status states.',
    icon: Lock,
    color: 'from-blue-500/20 to-blue-600/20',
    iconBg: 'from-blue-500 to-blue-600',
  },
  {
    title: 'Structured Verification',
    description:
      'Moderators review evidence and add notes before any escalation or assignment action.',
    icon: ClipboardCheck,
    color: 'from-emerald-500/20 to-emerald-600/20',
    iconBg: 'from-emerald-500 to-emerald-600',
  },
  {
    title: 'Intervention Coordination',
    description:
      'NGO teams receive prioritized cases and maintain follow-up records with internal notes.',
    icon: Handshake,
    color: 'from-amber-500/20 to-amber-600/20',
    iconBg: 'from-amber-500 to-amber-600',
  },
];

export default function PlatformScope() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Left Column */}
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Platform Blueprint</p>
            <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-primary sm:text-4xl">
              Built For Safety, Clarity, And Action
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-gray-600 sm:text-base">
              Nirapod Kontho is not only a form submission tool. It is a full response workflow where each report can be
              reviewed, assigned, and tracked until closure with clear accountability.
            </p>

            {/* Feature highlight */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-8 rounded-xl border border-secondary/30 bg-secondary/5 p-4"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary/80">End-to-end accountability</p>
              <p className="mt-2 text-sm text-gray-700">From initial report through resolution with transparent case status and audit trails</p>
            </motion.div>
          </motion.div>

          {/* Right Column - Pillars */}
          <div className="space-y-4">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 24, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ x: 6 }}
                  className="group relative rounded-2xl border border-primary/10 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/25 hover:shadow-md"
                >
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pillar.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className={`inline-flex rounded-lg bg-gradient-to-br ${pillar.iconBg} p-3 text-white`}
                    >
                      <Icon size={24} />
                    </motion.div>

                    {/* Title */}
                    <h3 className="mt-4 text-lg font-bold text-primary">{pillar.title}</h3>

                    {/* Description */}
                    <p className="mt-2 text-sm leading-relaxed text-gray-600">{pillar.description}</p>

                    {/* Accent line */}
                    <div className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${pillar.iconBg} opacity-0 transition-opacity group-hover:opacity-100`} />
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
