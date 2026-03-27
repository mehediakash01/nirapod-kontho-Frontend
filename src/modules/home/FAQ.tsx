'use client';

import { motion } from 'framer-motion';

const faqs = [
  {
    q: 'Can I report without revealing my identity?',
    a: 'Yes. The form supports anonymous reporting so users can prioritize personal safety while documenting incidents.',
  },
  {
    q: 'Who reviews submitted reports?',
    a: 'Moderators handle report verification first. Only verified cases move into NGO assignment workflows.',
  },
  {
    q: 'How do I track progress after submitting?',
    a: 'Users can monitor report and notification views in the dashboard to follow status and assignment updates.',
  },
  {
    q: 'How does donation help?',
    a: 'Donations support response readiness, including legal, emergency, and case support continuity for affected people.',
  },
];

export default function FAQ() {
  return (
    <section className="px-6 py-20">
      <h2 className="text-center text-3xl font-bold text-primary sm:text-4xl">Frequently Asked Questions</h2>
      <div className="mx-auto mt-8 grid max-w-4xl gap-3">
        {faqs.map((item, index) => (
          <motion.div
            key={item.q}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
            className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-primary sm:text-base">{item.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.a}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
