'use client';

import { motion } from 'framer-motion';
import { Shield, BarChart3, Zap } from 'lucide-react';

const practices = [
  {
    number: '01',
    icon: Shield,
    title: 'Role-based Access',
    desc: 'Role-based access boundaries for user, moderator, NGO, and super-admin dashboards with clear permission scoping.',
    highlights: ['User reports', 'Moderator verification', 'NGO case handling', 'Admin oversight'],
  },
  {
    number: '02',
    icon: BarChart3,
    title: 'Clear Accountability',
    desc: 'Clear report state transitions with moderation notes and case auditability across all workflow stages.',
    highlights: ['State tracking', 'Decision notes', 'Audit logs', 'Status updates'],
  },
  {
    number: '03',
    icon: Zap,
    title: 'Donation Traceability',
    desc: 'Donation traceability through status-aware payment records and dashboard visibility for donors.',
    highlights: ['Payment records', 'Usage reporting', 'Impact tracking', 'Transparency'],
  },
];

export default function SafetyCommitment() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Safety Commitment</p>
          <h2 className="mt-4 text-balance text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
            Operational Trust By Design
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Three foundational principles ensure your reports are managed with accountability and transparency at every step.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {practices.map((practice, index) => {
            const Icon = practice.icon;
            return (
              <motion.div
                key={practice.number}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative"
              >
                {/* Card background */}
                <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/5 to-primary/0 opacity-0 blur-xl transition-all duration-300 group-hover:opacity-100" />

                <div className="relative rounded-3xl border border-primary/10 bg-white p-8 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg">
                  {/* Number and icon container */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-5xl font-black text-primary/10">{practice.number}</p>
                      <p className="text-sm font-semibold uppercase tracking-wider text-secondary -mt-2">Principle</p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 8 }}
                      className="inline-flex rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-4 text-white shadow-lg"
                    >
                      <Icon size={28} />
                    </motion.div>
                  </div>

                  {/* Title and description */}
                  <h3 className="mt-6 text-xl font-bold text-primary">{practice.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{practice.desc}</p>

                  {/* Highlights */}
                  <div className="mt-6 space-y-2 border-t border-primary/10 pt-6">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Key Features</p>
                    <div className="flex flex-wrap gap-2">
                      {practice.highlights.map((highlight, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1 + i * 0.05, duration: 0.4 }}
                          className="inline-flex items-center rounded-full bg-primary/5 px-3 py-1 text-xs font-medium text-primary border border-primary/15"
                        >
                          {highlight}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 group-hover:w-8" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
