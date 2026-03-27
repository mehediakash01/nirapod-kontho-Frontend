'use client';

import { motion } from 'framer-motion';

const items = [
  { title: 'Anonymous Option', value: 'Enabled' },
  { title: 'Moderation Layer', value: 'Role-Gated' },
  { title: 'Case Ownership', value: 'NGO Assigned' },
  { title: 'Donation Support', value: 'Stripe-Based' },
];

export default function TrustBar() {
  return (
    <section className="px-6 pb-8">
      <div className="mx-auto grid max-w-6xl gap-3 rounded-2xl border border-primary/10 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.45 }}
            transition={{ delay: index * 0.06, duration: 0.4 }}
            className="rounded-xl border border-primary/10 bg-muted/40 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-gray-500">{item.title}</p>
            <p className="mt-1 text-lg font-bold text-primary">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
