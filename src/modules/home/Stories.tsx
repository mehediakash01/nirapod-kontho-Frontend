'use client';

import { motion } from 'framer-motion';
import { Quote, CheckCircle2 } from 'lucide-react';

const stories = [
  {
    outcome: 'From Anonymous to Action',
    quote:
      'A user submitted a harassment case anonymously. Moderators verified context quickly, and an NGO started follow-up within the same week.',
    impact: 'Immediate Response',
    metrics: ['Anonymous submission', 'Fast verification', 'NGO engagement'],
  },
  {
    outcome: 'Transparency Reduces Waiting',
    quote:
      'Status updates and notification flow reduced uncertainty for survivors waiting for response, increasing trust in the platform.',
    impact: 'Clear Communication',
    metrics: ['Real-time updates', 'Case tracking', 'User confidence'],
  },
  {
    outcome: 'Donations Enable Support',
    quote:
      'Donation flow helped keep legal and emergency support pathways active for high-priority cases requiring specialized intervention.',
    impact: 'Sustained support',
    metrics: ['Direct funding', 'Resource continuity', 'Case resolution'],
  },
];

export default function Stories() {
  return (
    <section className="px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-6xl text-center"
      >
        <p className="inline-flex rounded-full border border-secondary/20 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
          Real outcomes
        </p>

        <h2 className="mt-6 text-balance text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
          Platform Outcomes
        </h2>
        <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
          These examples show how the workflow translates from digital intake to practical support operations.
        </p>
      </motion.div>

      <div className="mx-auto mt-16 max-w-6xl">
        <div className="grid gap-8 md:grid-cols-3">
          {stories.map((story, index) => (
            <motion.article
              key={story.outcome}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl border border-primary/10 bg-white p-8 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg overflow-hidden"
            >
              {/* Gradient bg on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative z-10">
                {/* Quote icon */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.1, duration: 0.4 }}
                  className="text-primary/20"
                >
                  <Quote size={32} />
                </motion.div>

                {/* Outcome title */}
                <h3 className="mt-4 text-xl font-bold text-primary leading-tight">{story.outcome}</h3>

                {/* Quote / Story */}
                <blockquote className="mt-5 text-sm leading-relaxed text-gray-700 italic border-l-4 border-secondary/30 pl-4">
                  "{story.quote}"
                </blockquote>

                {/* Impact badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.15, duration: 0.4 }}
                  className="mt-6 flex items-center gap-2 rounded-lg bg-secondary/10 px-3 py-2 w-fit"
                >
                  <CheckCircle2 size={18} className="text-secondary" />
                  <span className="text-xs font-semibold text-secondary">{story.impact}</span>
                </motion.div>

                {/* Metrics/results */}
                <div className="mt-6 space-y-2 border-t border-primary/10 pt-6">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">How it happened</p>
                  <ul className="space-y-2">
                    {story.metrics.map((metric, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 + 0.2 + i * 0.05, duration: 0.4 }}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                        {metric}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
