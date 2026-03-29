'use client';

import { motion } from 'framer-motion';
import { FileText, CheckCircle2, Zap, Bell } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Secure Report Intake',
    desc: 'Users submit incidents with category, location, and description. Anonymous mode is available when identity safety is critical.',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
  },
  {
    number: 2,
    title: 'Moderator Verification',
    desc: 'Moderators review submitted cases, add decision notes, and mark valid reports for trusted intervention workflows.',
    icon: CheckCircle2,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    number: 3,
    title: 'NGO Case Assignment',
    desc: 'Verified reports are assigned to NGOs with priority levels so teams can start support action in a structured timeline.',
    icon: Zap,
    color: 'from-amber-500 to-amber-600',
  },
  {
    number: 4,
    title: 'Ongoing Follow-up',
    desc: 'NGO admins update case status and notes, while users receive notifications about every meaningful case movement.',
    icon: Bell,
    color: 'from-purple-500 to-purple-600',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl text-center"
      >
        <p className="inline-flex rounded-full border border-primary/20 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          The Process
        </p>

        <h2 className="mt-6 text-balance text-3xl font-bold text-primary sm:text-4xl lg:text-5xl">
          How It Works
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base"
        >
          The platform is designed to reduce confusion: each report follows a visible path from submission to verification,
          assignment, and ongoing support updates.
        </motion.p>
      </motion.div>

      <div className="mx-auto mt-16 max-w-6xl">
        <div className="grid gap-6 md:gap-8 lg:grid-cols-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isLast = i === steps.length - 1;
            
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative"
              >
                {/* Connector line */}
                {!isLast && (
                  <div className="absolute -right-3 top-20 hidden w-6 origin-left lg:block">
                    <motion.svg
                      viewBox="0 0 100 8"
                      className="h-2 w-full stroke-primary/20"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.3, duration: 0.6 }}
                    >
                      <line x1="0" y1="4" x2="100" y2="4" strokeWidth="2" strokeDasharray="8 4" />
                    </motion.svg>
                  </div>
                )}

                {/* Step card */}
                <div className="relative rounded-2xl border border-primary/10 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg">
                  {/* Hover gradient background */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative z-10">
                    {/* Step number circle */}
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-white font-bold text-lg shadow-lg`}
                    >
                      {step.number}
                    </motion.div>

                    {/* Icon indicator */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 + 0.2, duration: 0.5 }}
                      className="mt-4 text-primary/60"
                    >
                      <Icon size={28} />
                    </motion.div>

                    {/* Title */}
                    <h3 className="mt-4 text-lg font-bold text-primary">{step.title}</h3>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.desc}</p>

                    {/* Step indicator bar */}
                    <div className="mt-5 h-1 w-full rounded-full bg-primary/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + 0.4, duration: 0.8 }}
                        className={`h-full rounded-full bg-gradient-to-r ${step.color}`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}