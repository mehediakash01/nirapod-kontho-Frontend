'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight, Shield, CheckCircle2, Lock } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Submit Report', href: '/dashboard/user/create' },
  { label: 'Resources', href: '/resources' },
  { label: 'FAQ', href: '/faq' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Safety Guide', href: '/safety' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'Cookies', href: '/cookies' },
];

const trustBadges = [
  { icon: Lock, label: 'End-to-end encrypted' },
  { icon: CheckCircle2, label: '100% anonymous option' },
  { icon: Shield, label: 'Moderated & verified' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-primary text-white">

      {/* ── Decorative background ────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        {/* Orbs */}
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-secondary/15 blur-[80px]" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-accent/10 blur-[80px]" />
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        {/* Arc */}
        <svg className="absolute right-0 top-0 h-full opacity-[0.05]" viewBox="0 0 400 700" fill="none">
          <circle cx="400" cy="350" r="320" stroke="white" strokeWidth="1" />
          <circle cx="400" cy="350" r="220" stroke="white" strokeWidth="1" />
          <circle cx="400" cy="350" r="120" stroke="white" strokeWidth="1" />
        </svg>
      </div>

      {/* ── Top CTA strip ────────────────────────────────────── */}
      <div className="relative border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary mb-1">Speak up. Stay safe.</p>
              <h2 className="text-xl font-black text-white tracking-tight">
                Need to report an incident?
              </h2>
            </div>
            <Link
              href="/dashboard/user/create"
              className="group inline-flex flex-shrink-0 items-center gap-2.5 rounded-2xl bg-secondary px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-secondary/90 hover:shadow-xl hover:-translate-y-0.5"
            >
              File a Report
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main footer grid ─────────────────────────────────── */}
      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1.5fr]">

          {/* Brand column */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm">
                <span className="text-sm font-black text-white">NK</span>
              </div>
              <div>
                <p className="text-base font-black text-white">Nirapod Kontho</p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-white/40 mt-0.5">Bangladesh</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-white/55 max-w-xs">
              Safe, anonymous, and encrypted reporting for harassment, violence, and corruption. Connecting citizens with verified NGO partners.
            </p>

            {/* Social links */}
            <div className="flex gap-2.5">
              {['FB', 'TW', 'IN'].map((s) => (
                <a key={s} href="#" aria-label={s}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[11px] font-bold text-white/50 transition-all hover:bg-white/15 hover:border-white/25 hover:text-white">
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">Platform</p>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white">
                    <span className="h-px w-0 bg-secondary transition-all group-hover:w-3" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div className="space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">Legal</p>
            <ul className="space-y-2.5">
              {legalLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}
                    className="group inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white">
                    <span className="h-px w-0 bg-white/30 transition-all group-hover:w-3" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div className="space-y-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary">Get in Touch</p>
            <div className="space-y-3.5">
              <a href="mailto:info@nirapodkontho.org"
                className="flex items-start gap-3 group">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/6 border border-white/8 mt-0.5">
                  <Mail size={13} className="text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-sm text-white/60 group-hover:text-white transition-colors">info@nirapodkontho.org</p>
                </div>
              </a>

              <a href="tel:+8801700000000"
                className="flex items-start gap-3 group">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/6 border border-white/8 mt-0.5">
                  <Phone size={13} className="text-secondary" />
                </div>
                <div>
                  <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">Phone</p>
                  <p className="text-sm text-white/60 group-hover:text-white transition-colors">+880 1700 000 000</p>
                </div>
              </a>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/6 border border-white/8 mt-0.5">
                  <MapPin size={13} className="text-white/40" />
                </div>
                <div>
                  <p className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">Location</p>
                  <p className="text-sm text-white/60">Dhaka, Bangladesh</p>
                </div>
              </div>

              {/* Emergency numbers */}
              <div className="mt-4 rounded-2xl border border-white/8 bg-white/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-secondary mb-2.5">Emergency Lines</p>
                <div className="flex gap-4">
                  <div>
                    <a href="tel:999" className="text-xl font-black text-white hover:text-secondary transition-colors">999</a>
                    <p className="text-[10px] text-white/35 mt-0.5">Police</p>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div>
                    <a href="tel:109" className="text-xl font-black text-white hover:text-secondary transition-colors">109</a>
                    <p className="text-[10px] text-white/35 mt-0.5">Women & Child</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ───────────────────────────────────────── */}
      <div className="relative border-t border-white/8">
        <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-white/35">
              &copy; {year} Nirapod Kontho. All rights reserved.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3">
              {trustBadges.map((b) => {
                const Icon = b.icon;
                return (
                  <span key={b.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-white/40">
                    <Icon size={10} className="text-secondary" />
                    {b.label}
                  </span>
                );
              })}
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}