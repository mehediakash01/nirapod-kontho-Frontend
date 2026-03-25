'use client';

import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="min-h-[90vh] flex items-center justify-center px-6">
      <div className="max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold text-primary leading-tight"
        >
          Speak Without Fear — Even Without Internet
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-gray-600"
        >
          Report harassment, violence, or corruption safely.
          Your voice matters. Your identity stays protected.
        </motion.p>

        <motion.div
          className="mt-8 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button className="bg-primary text-white px-6 py-3 rounded-lg shadow">
            Report Now
          </button>

          <button className="border border-primary text-primary px-6 py-3 rounded-lg">
            Get Help
          </button>
        </motion.div>
      </div>
    </section>
  );
}