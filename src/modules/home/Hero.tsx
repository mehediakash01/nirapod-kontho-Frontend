'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Shield, CheckCircle2, Zap, Bell, MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

// Floating notification card component
function FloatingCard({ delay, className, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const stats = [
    { value: '24/7', label: 'Always online' },
    { value: '100%', label: 'Anonymous' },
    { value: 'Verified', label: 'Expert review' },
    { value: 'Fast', label: 'NGO response' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Anonymous reporting',
      desc: 'Submit safely without revealing your identity',
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      icon: CheckCircle2,
      title: 'Verified moderation',
      desc: 'Expert review before escalation to partners',
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      icon: Zap,
      title: 'Fast NGO response',
      desc: 'Assigned to trusted organizations within hours',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
  ];

  const recentActivity = [
    { type: 'Report verified', location: 'Dhaka', time: '2 min ago', color: 'bg-secondary' },
    { type: 'NGO assigned', location: 'Chittagong', time: '8 min ago', color: 'bg-accent' },
    { type: 'Case resolved', location: 'Sylhet', time: '15 min ago', color: 'bg-primary' },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden pt-24 sm:pt-32 lg:pt-36 pb-20 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-8"
    >
      {/* Rich layered background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Base tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-primary/[0.03] to-secondary/[0.05]" />
        {/* Soft orbs */}
        <motion.div style={{ y: bgY }} className="absolute -left-56 top-10 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[100px]" />
        <motion.div style={{ y: bgY }} className="absolute right-0 -top-20 h-[450px] w-[450px] rounded-full bg-secondary/10 blur-[100px]" />
        <motion.div style={{ y: bgY }} className="absolute bottom-0 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-accent/8 blur-[100px]" />
        {/* Subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(90deg, var(--color-primary) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Decorative arcs */}
        <svg className="absolute right-0 top-0 h-full opacity-[0.04]" viewBox="0 0 400 800" fill="none">
          <circle cx="400" cy="200" r="300" stroke="var(--color-primary)" strokeWidth="1" fill="none" />
          <circle cx="400" cy="200" r="220" stroke="var(--color-secondary)" strokeWidth="1" fill="none" />
          <circle cx="400" cy="200" r="140" stroke="var(--color-accent)" strokeWidth="1" fill="none" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="lg:grid lg:grid-cols-2 lg:gap-20 lg:items-center">

          {/* ── LEFT CONTENT ── */}
          <motion.div
            style={{ opacity }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-primary/15 bg-white/80 px-4 py-2 mb-8 shadow-sm shadow-primary/5 backdrop-blur-md"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">
                Safe Reporting Platform · Bangladesh
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="text-[clamp(3rem,8vw,5rem)] font-black leading-[0.95] tracking-[-0.03em] text-foreground"
            >
              <span className="block text-primary">Speak Up</span>
              <span className="block text-foreground/90">Securely.</span>
              <span className="block mt-1 bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
                Get Real Help.
              </span>
            </motion.h1>

            {/* Divider accent */}
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="mt-6 mb-6 h-0.5 w-20 bg-gradient-to-r from-secondary to-accent lg:mx-0 mx-auto"
            />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-lg lg:mx-0 mx-auto"
            >
              <strong className="font-semibold text-foreground/80">Nirapod Kontho</strong> lets people report harassment,
              domestic violence, threats, and corruption — with full identity protection,
              expert moderation, and NGO-led follow-up.
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 flex flex-wrap gap-2 lg:justify-start justify-center"
            >
              {[
                { icon: Shield, label: 'Anonymous & Secure' },
                { icon: CheckCircle2, label: 'Moderator Verified' },
                { icon: Zap, label: 'NGO Assigned' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 + i * 0.07 }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/10 px-3 py-1.5"
                  >
                    <Icon size={13} className="text-secondary" />
                    <span className="text-xs font-semibold text-foreground/70">{item.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row gap-3 lg:justify-start justify-center"
            >
              <Link
                href="/dashboard/user/create"
                className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1"
              >
                {/* shine sweep */}
                <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                <span className="relative">Report an Incident</span>
                <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/donation"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-white/60 px-8 py-4 text-sm font-bold text-primary backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:bg-white hover:shadow-lg hover:-translate-y-0.5"
              >
                Support the Fund
                <ChevronRight size={15} className="opacity-50 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-12 grid grid-cols-4 gap-4 border-t border-primary/8 pt-8"
            >
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.06 }}
                  className="text-center lg:text-left"
                >
                  <div className="text-base font-black text-primary leading-none">{s.value}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground leading-tight">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT VISUAL ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, duration: 0.8, ease: 'easeOut' }}
            className="order-1 lg:order-2 mb-12 lg:mb-0 relative"
          >
            {/* Outer glow */}
            <div className="absolute inset-6 rounded-[2rem] bg-gradient-to-br from-secondary/25 via-primary/15 to-accent/20 blur-3xl" />

            {/* Main card */}
            <div className="relative rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-2xl shadow-2xl shadow-primary/10 overflow-hidden">

              {/* Card header bar */}
              <div className="bg-gradient-to-r from-primary/95 to-primary/85 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-3 w-3 rounded-full bg-white/30" />
                  <div className="h-3 w-3 rounded-full bg-white/30" />
                  <div className="h-3 w-3 rounded-full bg-white/30" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/70">Nirapod Kontho</span>
                <div className="flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                  <span className="text-[10px] text-white/60 font-medium">LIVE</span>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Why choose us */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-secondary mb-3 flex items-center gap-2">
                    <span className="h-px flex-1 bg-secondary/20" />
                    Why choose us?
                    <span className="h-px flex-1 bg-secondary/20" />
                  </p>
                  <div className="space-y-2.5">
                    {features.map((f, i) => {
                      const Icon = f.icon;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          whileHover={{ x: 4 }}
                          className="group flex items-start gap-3 rounded-xl border border-primary/6 bg-white/60 p-3.5 cursor-default transition-all hover:border-primary/15 hover:bg-white/90 hover:shadow-md"
                        >
                          <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${f.bg}`}>
                            <Icon size={16} className={f.color} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground leading-none">{f.title}</p>
                            <p className="text-[12px] text-muted-foreground mt-1 leading-snug">{f.desc}</p>
                          </div>
                          <ChevronRight
                            size={14}
                            className="ml-auto flex-shrink-0 text-muted-foreground/30 transition-all group-hover:text-primary/40 group-hover:translate-x-0.5 mt-0.5"
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Live activity feed */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 mb-2.5 flex items-center gap-2">
                    <Bell size={9} className="opacity-60" />
                    Live Activity
                  </p>
                  <div className="rounded-xl border border-primary/6 bg-white/40 divide-y divide-primary/5 overflow-hidden">
                    {recentActivity.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 + i * 0.12 }}
                        className="flex items-center gap-3 px-3.5 py-2.5"
                      >
                        <div className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${item.color}`} />
                        <span className="text-[12px] font-semibold text-foreground/80">{item.type}</span>
                        <div className="ml-auto flex items-center gap-2.5">
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <MapPin size={9} />
                            {item.location}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/50">
                            <Clock size={9} />
                            {item.time}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Reports filed', value: '2,400+', icon: Users },
                    { label: 'NGO partners', value: '18', icon: Shield },
                    { label: 'Cases resolved', value: '91%', icon: CheckCircle2 },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9 + i * 0.08 }}
                        className="rounded-xl border border-primary/8 bg-gradient-to-br from-white/70 to-white/40 p-3 text-center"
                      >
                        <Icon size={14} className="text-secondary mx-auto mb-1.5" />
                        <div className="text-sm font-black text-primary">{item.value}</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{item.label}</div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Floating badge — top left */}
            <FloatingCard
              delay={0.9}
              className="absolute -left-6 top-16 hidden lg:block z-10"
            >
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-xl shadow-primary/10 backdrop-blur-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-secondary/15">
                  <Shield size={15} className="text-secondary" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-foreground">Identity Protected</p>
                  <p className="text-[10px] text-muted-foreground">End-to-end encrypted</p>
                </div>
              </div>
            </FloatingCard>

            {/* Floating badge — bottom right */}
            <FloatingCard
              delay={1.0}
              className="absolute -right-6 bottom-20 hidden lg:block z-10"
            >
              <div className="flex items-center gap-2.5 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-xl shadow-primary/10 backdrop-blur-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                  <Zap size={15} className="text-primary" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-foreground">Response in &lt; 4h</p>
                  <p className="text-[10px] text-muted-foreground">Avg. NGO assignment</p>
                </div>
              </div>
            </FloatingCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}