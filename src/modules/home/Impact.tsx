'use client';

import { motion } from 'framer-motion';
import { Clock, Users, FileText, Bell } from 'lucide-react';

const metrics = [
  {
    icon: Clock,
    value: '24/7',
    label: 'Reporting Access',
    description: 'Users can submit reports at any time with a guided form experience.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Users,
    value: 'Role-Based',
    label: 'Safety Workflow',
    description: 'Moderator, NGO, and super-admin boundaries keep operations accountable.',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    icon: FileText,
    value: 'Case Notes',
    label: 'Continuity Of Care',
    description: 'Internal note trails preserve context across NGO case handling teams.',
    color: 'from-amber-500 to-amber-600',
  },
  {
    icon: Bell,
    value: 'Live Updates',
    label: 'User Visibility',
    description: 'Notifications inform users when reports are reviewed or assigned.',
    color: 'from-purple-500 to-purple-600',
  },
];

export default function Impact() {
  return (
    <section className="px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl text-center"
      >
        <p className="inline-flex rounded-full border border-secondary/20 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
          Platform Capabilities
        </p>

        <h2 className="mt-6 text-balance text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
          Real Impact
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ delay: 0.08, duration: 0.5 }}
          className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base"
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
                className="group relative rounded-2xl bg-white p-6 shadow-sm border border-primary/10 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                {/* Gradient background overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="relative z-10">
                  {/* Icon circle */}
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 10 }}
                    className={`inline-flex rounded-2xl bg-gradient-to-br ${item.color} p-4 text-white shadow-lg`}
                  >
                    <Icon size={28} />
                  </motion.div>

                  {/* Main value */}
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 + 0.1, duration: 0.5 }}
                    className={`mt-6 text-2xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                  >
                    {item.value}
                  </motion.p>

                  {/* Label */}
                  <p className="mt-1 text-sm font-bold text-gray-900">{item.label}</p>

                  {/* Description */}
                  <p className="mt-3 text-xs leading-relaxed text-gray-600">{item.description}</p>

                  {/* Decorative line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 + 0.2, duration: 0.6 }}
                    className={`mt-4 h-1 w-8 rounded-full origin-left bg-gradient-to-r ${item.color}`}
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