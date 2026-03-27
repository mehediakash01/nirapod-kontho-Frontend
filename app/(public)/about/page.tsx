'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <main className="px-6 py-16">
      <div className="mx-auto max-w-6xl space-y-10">
        <motion.section
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-primary/10 bg-gradient-to-br from-white to-muted/50 p-8 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">About The Platform</p>
          <h1 className="mt-3 text-4xl font-bold text-primary">Nirapod Kontho</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-600 sm:text-base">
            Nirapod Kontho is a safety-first reporting platform designed to connect citizens with a structured support network.
            It transforms one report into an accountable workflow: moderation, NGO assignment, case follow-up, and user updates.
          </p>
        </motion.section>

        <section className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: 'Mission',
              body: 'Enable safe, stigma-free reporting with clear pathways to verified response.',
            },
            {
              title: 'Vision',
              body: 'Build a trusted digital bridge between survivors, moderators, NGOs, and support funding.',
            },
            {
              title: 'Approach',
              body: 'Privacy-aware intake, role-based decisions, and transparent case progression.',
            },
          ].map((item, index) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.45 }}
              className="rounded-2xl border border-primary/10 bg-white p-6"
            >
              <h2 className="text-lg font-semibold text-primary">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{item.body}</p>
            </motion.article>
          ))}
        </section>

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/user/create" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">
            Submit A Report
          </Link>
          <Link href="/donation" className="rounded-xl border border-primary/20 px-5 py-2.5 text-sm font-semibold text-primary">
            Support The Cause
          </Link>
        </div>
      </div>
    </main>
  );
}
