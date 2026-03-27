'use client';

import { motion } from 'framer-motion';

export default function Helpline() {
  return (
    <section className="px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 text-white shadow-2xl"
      >
        <h2 className="text-center text-3xl font-bold sm:text-4xl">Emergency Helplines</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-white/85 sm:text-base">
          For immediate risk, contact emergency services first. Use Nirapod Kontho for secure documentation and support follow-up.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-white/75">National Emergency</p>
            <p className="mt-1 text-2xl font-bold">999</p>
            <p className="mt-1 text-sm text-white/80">Police, fire, and emergency medical dispatch</p>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-white/75">Women & Child Helpline</p>
            <p className="mt-1 text-2xl font-bold">109</p>
            <p className="mt-1 text-sm text-white/80">Protection and crisis support services</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}