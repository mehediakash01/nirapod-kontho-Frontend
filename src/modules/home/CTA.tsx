'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="px-6 pb-24 pt-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-4xl rounded-[2rem] border border-primary/15 dark:bg-black  p-10 dark:text-white shadow-2xl"
      >
        <h2 className="font-serif text-4xl font-semibold sm:text-5xl">Support Victims Through Sustained Action</h2>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed dark:text-white/85 text-black/85 sm:text-base">
          Every contribution strengthens legal aid, emergency response, and follow-up capacity for high-risk cases.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/donation"
            className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary shadow transition hover:-translate-y-0.5"
          >
            Donate Now
          </Link>
          <Link
            href="/dashboard/user/create"
            className="rounded-xl border border-white/40 bg-secondary px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-secondary/95"
          >
            Submit A Report
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
