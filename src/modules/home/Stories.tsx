'use client';

import { motion } from 'framer-motion';

const stories = [
  {
    title: 'Anonymous Report To Verified Action',
    quote:
      'A user submitted a harassment case anonymously, moderators verified context quickly, and an NGO started follow-up within the same week.',
  },
  {
    title: 'Transparent Case Progress',
    quote:
      'Status updates and notification flow reduced uncertainty for survivors waiting for response.',
  },
  {
    title: 'Sustained Support Through Donations',
    quote:
      'Donation flow helped keep legal and emergency support pathways active for high-priority cases.',
  },
];

export default function Stories() {
  return (
    <section className="px-6 py-20">
      <h2 className="text-center text-3xl font-bold text-primary sm:text-4xl">Platform Outcomes</h2>
      <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-gray-600 sm:text-base">
        These examples show how the workflow translates from digital intake to practical support operations.
      </p>

      <div className="mx-auto mt-10 grid max-w-6xl gap-5 md:grid-cols-3">
        {stories.map((story, index) => (
          <motion.article
            key={story.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: index * 0.08, duration: 0.45 }}
            className="rounded-2xl border border-primary/10 bg-white p-6 shadow-sm"
          >
            <h3 className="text-base font-semibold text-primary">{story.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{story.quote}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
