'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'Can I report without revealing my identity?',
    a: 'Yes. The form supports anonymous reporting so users can prioritize personal safety while documenting incidents. Anonymous sessions are session-based and do not require account creation, though you can create an account afterward to track your case.',
    category: 'Reporting',
  },
  {
    q: 'Who reviews submitted reports?',
    a: 'Moderators handle report verification first. Only verified cases move into NGO assignment workflows. Moderators are trained to assess report validity, context, and appropriate categorization before escalation.',
    category: 'Moderation',
  },
  {
    q: 'How do I track progress after submitting?',
    a: 'Users can monitor report and notification views in the dashboard to follow status and assignment updates. Each status change generates a notification, and you can view the full case timeline at any time.',
    category: 'Tracking',
  },
  {
    q: 'How does donation help?',
    a: 'Donations support response readiness, including legal, emergency, and case support continuity for affected people. All donations are tracked transparently and allocations are visible through the dashboard.',
    category: 'Support',
  },
  {
    q: 'Is my data secure and protected?',
    a: 'Yes. The platform uses encrypted sessions, role-based access control, and follows data protection best practices. Anonymous reports do not capture or store identifying information unless you voluntarily provide it.',
    category: 'Security',
  },
  {
    q: 'What happens after an NGO is assigned to my case?',
    a: 'The assigned NGO reviews your case and may contact you through the platform or by phone to discuss follow-up actions. You remain in control and can update your preferences or withdraw your case at any time.',
    category: 'NGO Process',
  },
];

const categories = ['All', 'Reporting', 'Moderation', 'Tracking', 'Support', 'Security', 'NGO Process'];

export default function FAQ() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredFaqs = activeCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section className="px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-2">
          <HelpCircle size={16} className="text-primary" />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">FAQ</span>
        </div>

        <h2 className="mt-6 text-balance text-3xl font-bold leading-tight text-primary sm:text-4xl lg:text-5xl">
          Frequently Asked Questions
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
          Everything you need to know about using Nirapod Kontho safely and effectively.
        </p>
      </motion.div>

      {/* Category filter */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mx-auto mt-10 max-w-4xl"
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((category, i) => (
            <motion.button
              key={category}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              onClick={() => {
                setActiveCategory(category);
                setExpandedIndex(null);
              }}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg'
                  : 'border border-primary/20 bg-white/80 text-primary hover:border-primary/40'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* FAQ Items */}
      <div className="mx-auto mt-12 max-w-4xl space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredFaqs.map((item, index) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group relative"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full rounded-2xl border border-primary/10 bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-left text-base font-semibold text-primary">{item.q}</h3>
                  <motion.div
                    animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-0.5 flex-shrink-0 text-primary"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </div>

                {/* Category badge */}
                <div className="mt-3 flex justify-start">
                  <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary border border-primary/20">
                    {item.category}
                  </span>
                </div>
              </button>

              {/* Answer */}
              <AnimatePresence>
                {expandedIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-2xl border border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent p-6">
                      <p className="text-sm leading-relaxed text-gray-700">{item.a}</p>

                      {/* Helpful action */}
                      <div className="mt-4 flex items-center gap-2 pt-4 border-t border-secondary/20">
                        <span className="text-xs text-gray-500">Was this helpful?</span>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="ml-auto rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
                        >
                          Yes
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="rounded-lg bg-muted px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-300 transition-colors"
                        >
                          No
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* No results message */}
      {filteredFaqs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto mt-12 max-w-4xl rounded-2xl border border-primary/10 bg-muted/50 p-8 text-center"
        >
          <p className="text-sm text-gray-600">No questions found in this category</p>
        </motion.div>
      )}

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mx-auto mt-12 max-w-4xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-6 text-center"
      >
        <p className="text-sm font-semibold text-gray-700">Didn't find what you're looking for?</p>
        <p className="mt-2 text-xs text-gray-600">Contact us at support or visit our help center for more information.</p>
      </motion.div>
    </section>
  );
}
