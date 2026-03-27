'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const resources = [
  {
    title: 'Emergency Response',
    details: 'Immediate assistance channels for urgent threats and violence situations.',
    contact: '999',
  },
  {
    title: 'Women & Child Helpline',
    details: 'Dedicated support access for women and child protection concerns.',
    contact: '109',
  },
  {
    title: 'Platform Support',
    details: 'Guidance on reporting, dashboard tracking, and NGO case follow-up.',
    contact: 'dashboard notifications',
  },
];

export default function ResourcesPage() {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Support Resources</p>
          <h1 className="mt-2 text-4xl font-bold text-primary">Help Channels And Practical Guidance</h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-gray-600 sm:text-base">
            Use these channels for urgent response and coordinated support.
          </p>
        </motion.header>

        <div className="grid gap-4 md:grid-cols-3">
          {resources.map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="rounded-2xl border border-primary/10 bg-white p-6"
            >
              <h2 className="text-lg font-semibold text-primary">{item.title}</h2>
              <p className="mt-2 text-sm text-gray-600">{item.details}</p>
              <p className="mt-4 text-sm font-semibold text-secondary">{item.contact}</p>
            </motion.article>
          ))}
        </div>

        <div className="rounded-2xl border border-primary/10 bg-white p-6 text-sm text-gray-700">
          Need to start now? Go directly to the secure report form and begin documentation.
          <div className="mt-3">
            <Link href="/dashboard/user/create" className="font-semibold text-primary hover:underline">
              Open Report Form
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
