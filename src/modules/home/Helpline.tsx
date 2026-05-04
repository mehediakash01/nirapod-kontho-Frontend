'use client';

import { motion } from 'framer-motion';
import { PhoneCall } from 'lucide-react';

export default function Helpline() {
  return (
    <section className="px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-5xl rounded-[2rem] border border-secondary/20 bg-gradient-to-br from-accent via-primary to-primary p-8 text-white shadow-2xl"
      >
        <h2 className="text-center font-serif text-4xl font-semibold sm:text-5xl">Emergency Helplines</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-[1.7] text-white/85 sm:text-base">
          For immediate danger, call now. Then document here when it is safe to preserve evidence and request follow-up.
        </p>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-white/75">National Emergency</p>
            <a href="tel:999" className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary/95 px-5 py-2 text-2xl font-black text-white shadow-lg">
              <PhoneCall size={20} aria-hidden="true" />
              999
            </a>
            <p className="mt-1 text-sm text-white/80">Police, fire, and emergency medical dispatch</p>
          </div>
          <div className="rounded-3xl border border-white/20 bg-white/10 p-5 backdrop-blur">
            <p className="text-xs uppercase tracking-wider text-white/75">Women & Child Helpline</p>
            <a href="tel:109" className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary/95 px-5 py-2 text-2xl font-black text-white shadow-lg">
              <PhoneCall size={20} aria-hidden="true" />
              109
            </a>
            <p className="mt-1 text-sm text-white/80">Protection and crisis support services</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
