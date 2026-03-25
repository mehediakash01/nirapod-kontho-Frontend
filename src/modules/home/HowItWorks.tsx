'use client';

import { motion } from 'framer-motion';

const steps = [
  { title: 'Report', desc: 'Submit safely even offline' },
  { title: 'Verify', desc: 'Moderators review your report' },
  { title: 'NGO Support', desc: 'Get help from verified NGOs' },
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-6 bg-white">
      <h2 className="text-3xl font-bold text-center text-primary">
        How It Works
      </h2>

      <div className="mt-12 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className="p-6 rounded-xl shadow bg-neutral"
          >
            <h3 className="text-xl font-semibold text-primary">
              {step.title}
            </h3>
            <p className="mt-2 text-gray-600">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}