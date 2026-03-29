'use client';

import { motion } from 'framer-motion';
import { Lock, Users, Shield, Heart } from 'lucide-react';

const items = [
  { 
    title: 'Anonymous Option', 
    value: 'Enabled',
    description: 'Protect your identity',
    icon: Lock 
  },
  { 
    title: 'Moderation Layer', 
    value: 'Role-Gated',
    description: 'Verified workflows',
    icon: Users 
  },
  { 
    title: 'Case Ownership', 
    value: 'NGO Assigned',
    description: 'Professional handling',
    icon: Shield 
  },
  { 
    title: 'Donation Support', 
    value: 'Stripe-Based',
    description: 'Fund real support',
    icon: Heart 
  },
];

export default function TrustBar() {
  return (
    <section className="px-6 pb-12 pt-2">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                whileHover={{ y: -6 }}
                className="group relative rounded-2xl border border-primary/10 bg-gradient-to-br from-white via-white to-muted/30 p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition group-hover:opacity-100" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="inline-flex rounded-xl bg-primary/10 p-3 text-primary"
                    >
                      <Icon size={24} />
                    </motion.div>
                  </div>
                  
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{item.title}</p>
                  <p className="mt-2 text-2xl font-bold text-primary">{item.value}</p>
                  <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
