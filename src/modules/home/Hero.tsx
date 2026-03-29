'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, CheckCircle2, Zap } from 'lucide-react';

export default function Hero() {
  const features = [
    { icon: Shield, text: 'Secure & anonymous' },
    { icon: CheckCircle2, text: 'Verified by moderators' },
    { icon: Zap, text: 'Assigned to NGOs' },
  ];

  return (
    <section className="relative overflow-hidden pt-24 sm:pt-32 lg:pt-40 pb-20 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8">
      {/* Background elements */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-0 top-0 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center lg:text-left lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center"
        >
          {/* Left Content */}
          <div className="lg:order-1">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-4 py-2 mb-6 backdrop-blur-sm"
            >
              <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">
                Safe Reporting Platform
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight text-foreground"
            >
              <span className="block text-primary">Speak Up</span>
              <span className="block">Securely.</span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="block bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent"
              >
                Get Real Help Faster.
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mt-8 text-lg leading-relaxed text-muted-foreground max-w-xl"
            >
              Nirapod Kontho lets people report harassment, domestic violence, threats, and corruption with identity protection, moderation, and NGO-led follow-up.
            </motion.p>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 space-y-3 flex flex-col"
            >
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.08, duration: 0.5 }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary/20">
                      <Icon size={16} className="text-secondary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">{feature.text}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/dashboard/user/create"
                className="group relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-2xl hover:-translate-y-1"
              >
                <span>Report Incident Now</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/donation"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/25 bg-white/70 px-8 py-4 text-sm font-semibold text-primary backdrop-blur-sm transition-all hover:border-primary/40 hover:bg-white/90"
              >
                Support Response Fund
              </Link>
            </motion.div>

            {/* Social proof / Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-12 flex flex-wrap gap-6 text-sm text-muted-foreground border-t border-primary/10 pt-8"
            >
              <div>
                <div className="font-bold text-primary">24/7</div>
                <div>Always available</div>
              </div>
              <div>
                <div className="font-bold text-primary">Anonymous</div>
                <div>Optional identity</div>
              </div>
              <div>
                <div className="font-bold text-primary">Verified</div>
                <div>Moderated reports</div>
              </div>
            </motion.div>
          </div>

          {/* Right Visual Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 32 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="lg:order-2 mt-12 lg:mt-0"
          >
            <div className="relative">
              {/* Gradient border box */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-secondary/20 to-primary/10 blur-2xl" />
              
              <div className="relative rounded-3xl border border-white/30 bg-gradient-to-br from-white/80 to-white/40 backdrop-blur-xl p-8 shadow-2xl">
                {/* Content inside the card */}
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary mb-3">
                      Why Choose Us?
                    </p>
                    <div className="space-y-3">
                      <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="flex items-start gap-3 rounded-lg bg-white/50 p-3"
                      >
                        <CheckCircle2 size={20} className="text-secondary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">Anonymous reporting</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Submit safely without revealing identity</p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.45 }}
                        className="flex items-start gap-3 rounded-lg bg-white/50 p-3"
                      >
                        <Shield size={20} className="text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">Verified moderation</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Expert review before escalation</p>
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                        className="flex items-start gap-3 rounded-lg bg-white/50 p-3"
                      >
                        <Zap size={20} className="text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">Fast NGO response</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Assigned to trusted organizations</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}