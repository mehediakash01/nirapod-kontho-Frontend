'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-14 sm:pt-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-secondary/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex rounded-full border border-primary/20 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary"
          >
            Safe Reporting Network
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.55 }}
            className="mt-4 text-balance text-4xl font-black leading-tight text-primary sm:text-5xl lg:text-6xl"
          >
            Speak Up Securely.
            <span className="block bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
              Get Real Help Faster.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.55 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-gray-700 sm:text-lg"
          >
            Nirapod Kontho lets people report harassment, domestic violence, threats, and corruption with identity protection,
            structured moderation, and NGO-led case follow-up.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/dashboard/user/create"
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-primary/90"
            >
              Report Incident
            </Link>
            <Link
              href="/donation"
              className="rounded-xl border border-primary/25 bg-white/80 px-6 py-3 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:border-primary/45"
            >
              Support Response Fund
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.55 }}
          className="rounded-3xl border border-white/50 bg-gradient-to-br from-white/70 to-white/35 p-6 shadow-2xl backdrop-blur"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary/80">Platform Promise</p>
          <div className="mt-4 space-y-3">
            {[
              'Anonymous reporting option with secure session flow',
              'Moderator verification before any NGO assignment',
              'Case lifecycle tracking from report to resolution',
              'Integrated donation model for sustained victim support',
            ].map((line) => (
              <div key={line} className="rounded-xl border border-primary/10 bg-white/75 px-4 py-3 text-sm text-gray-700">
                {line}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}