'use client';

import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-primary/10 bg-white p-8 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">Contact</p>
          <h1 className="mt-2 text-4xl font-bold text-primary">Connect With The Platform Team</h1>
          <p className="mx-auto mt-3 max-w-3xl text-sm text-gray-600 sm:text-base">
            Use this channel for platform collaboration, NGO onboarding questions, and operational partnership discussions.
          </p>
        </motion.header>

        <div className="grid gap-4 md:grid-cols-2">
          <motion.section
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-primary/10 bg-white p-6"
          >
            <h2 className="text-lg font-semibold text-primary">General Inquiries</h2>
            <p className="mt-3 text-sm text-gray-600">support@nirapodkontho.org</p>
            <p className="mt-1 text-sm text-gray-600">Response window: within 24-48 hours</p>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-primary/10 bg-white p-6"
          >
            <h2 className="text-lg font-semibold text-primary">Partnership & NGO Onboarding</h2>
            <p className="mt-3 text-sm text-gray-600">partnerships@nirapodkontho.org</p>
            <p className="mt-1 text-sm text-gray-600">Please include organization profile and contact focal point.</p>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
