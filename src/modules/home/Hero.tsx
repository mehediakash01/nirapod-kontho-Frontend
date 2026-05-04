'use client';

import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  HeartHandshake,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import { useRef } from 'react';

const trustStats = [
  { icon: ShieldCheck, label: 'Active moderators', value: '12' },
  { icon: CheckCircle2, label: 'Verified today', value: '47' },
  { icon: HeartHandshake, label: 'NGOs on standby', value: '8' },
];

const reportRegions = [
  { label: 'Dhaka region', x: 54, y: 47, delay: 0 },
  { label: 'Rajshahi region', x: 32, y: 31, delay: 0.4 },
  { label: 'Sylhet region', x: 76, y: 29, delay: 0.8 },
  { label: 'Chattogram region', x: 68, y: 70, delay: 1.2 },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], ['0%', '8%']);

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[92vh] overflow-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-8 lg:pt-32"
    >
      <div className="absolute inset-0 -z-10 bg-teal-700 dark:bg-black" />
      <div
        className="absolute inset-0 -z-10 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(120deg, rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(30deg, rgba(15,23,42,0.45) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="max-w-3xl text-white lg:pt-8"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white shadow-sm backdrop-blur-md">
            <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white/15">
              <ShieldCheck className="h-4 w-4 text-white" aria-hidden="true" />
              <span className="absolute inset-0 animate-ping rounded-full border border-white/35" />
            </span>
            Active Protection Network
          </div>

          <h1 className="mt-8 max-w-4xl font-serif text-[clamp(3.2rem,8vw,6.5rem)] font-semibold leading-[0.92] tracking-normal text-white">
            Speak safely.
            <span className="block text-white/90">Move toward help.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-[1.7] text-white/85 sm:text-lg">
            Nirapod Kontho protects identity while routing verified reports to moderators and trusted
            response partners. Built for people who need care, evidence, and a safer next step.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/dashboard/user/create"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-secondary px-7 py-4 text-sm font-bold text-white shadow-xl shadow-secondary/25 transition hover:-translate-y-0.5 hover:bg-secondary/95 hover:shadow-2xl"
            >
              Report Anonymously
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center rounded-2xl border border-white/35 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
            >
              Explore Process
            </Link>
          </div>

          <dl className="mt-11 grid max-w-2xl grid-cols-3 gap-3 border-t border-white/20 pt-6">
            {[
              ['Anonymous option', 'Identity shielded'],
              ['Avg. verification', '4 hrs'],
              ['Generalized map', 'No exact pins'],
            ].map(([term, detail]) => (
              <div key={term}>
                <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">{term}</dt>
                <dd className="mt-1 text-sm font-bold text-white">{detail}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          style={{ y: visualY }}
          initial={{ opacity: 0, x: 34 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.7, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute -inset-5 rounded-[2rem] bg-white/25 blur-2xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/45 bg-white/90 p-5 shadow-2xl shadow-accent/20 backdrop-blur-xl dark:bg-card/90">
            <div className="flex items-center justify-between gap-4 border-b border-primary/10 pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Live Trust Dashboard</p>
                <p className="mt-1 text-sm text-muted-foreground">Privacy-safe operational pulse</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Online
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {trustStats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-primary/10 bg-white p-4 shadow-sm dark:bg-background/40">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    <p className="mt-3 text-2xl font-black leading-none text-accent dark:text-foreground">{item.value}</p>
                    <p className="mt-1 text-[11px] font-medium leading-snug text-muted-foreground">{item.label}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 overflow-hidden rounded-3xl border border-primary/10 bg-gradient-to-br from-primary/10 to-secondary/10 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-accent dark:text-foreground">Generalized Bangladesh activity</p>
                  <p className="text-xs text-muted-foreground">Regions only. No survivor-identifying location data.</p>
                </div>
                <Users className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>

              <div className="relative mx-auto mt-6 aspect-[4/3] max-w-md" aria-label="Generalized Bangladesh report activity map">
                <svg viewBox="0 0 240 180" className="h-full w-full" role="img" aria-labelledby="map-title map-desc">
                  <title id="map-title">Generalized Bangladesh report activity</title>
                  <desc id="map-desc">A non-specific map silhouette with pulsing regional activity dots.</desc>
                  <path
                    d="M115 12c18 4 22 19 36 27 14 9 34 8 41 22 8 15-7 30-1 47 6 18 26 31 18 45-8 13-31 8-48 12-17 3-29 18-46 13-16-5-15-26-29-35-14-10-38-6-45-21-7-14 11-27 13-43 2-17-11-35-1-48 10-13 42-23 62-19Z"
                    fill="currentColor"
                    className="text-primary/10"
                  />
                  <path
                    d="M108 17c15 12 27 19 36 28 10 11 25 17 28 31 4 17-9 28-5 42 4 14 19 24 12 34-7 10-25 6-38 9-13 3-23 13-35 7-12-6-9-22-20-30-10-8-28-7-32-19-4-11 12-21 13-35 1-13-10-27-3-38 7-10 29-22 44-29Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    className="text-primary/28"
                  />
                </svg>

                {reportRegions.map((region) => (
                  <div
                    key={region.label}
                    className="absolute"
                    style={{ left: `${region.x}%`, top: `${region.y}%` }}
                  >
                    <span
                      className="absolute -left-3 -top-3 h-6 w-6 animate-ping rounded-full bg-secondary/35"
                      style={{ animationDelay: `${region.delay}s` }}
                      aria-hidden="true"
                    />
                    <span className="relative flex h-3 w-3 rounded-full border-2 border-white bg-secondary shadow-md" />
                    <span className="sr-only">{region.label}</span>
                  </div>
                ))}

                <div className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-semibold text-muted-foreground shadow-sm backdrop-blur">
                  <MapPin className="mr-1 inline h-3 w-3 text-primary" aria-hidden="true" />
                  General regions only
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
