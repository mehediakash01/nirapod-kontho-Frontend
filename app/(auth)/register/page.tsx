import RegisterForm from "@/src/modules/auth/components/RegisterForm";
import Link from 'next/link';
import { ShieldPlus, BadgeCheck, ArrowRight, CheckCircle2, Zap, Users } from 'lucide-react';

const benefits = [
  {
    icon: CheckCircle2,
    title: 'Verified Reports',
    desc: 'Every submission goes through human moderation before escalation',
    accent: 'text-secondary',
  },
  {
    icon: BadgeCheck,
    title: 'Direct NGO Support',
    desc: 'Connected to 18+ verified partner organisations across Bangladesh',
    accent: 'text-accent',
  },
  {
    icon: Zap,
    title: 'Real-time Updates',
    desc: 'Track your case status and receive notifications at each stage',
    accent: 'text-primary',
  },
  {
    icon: Users,
    title: 'Community Backed',
    desc: 'Part of a growing network protecting thousands of people',
    accent: 'text-secondary',
  },
];

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ── Full-page split background ───────────────────────── */}
      <div className="pointer-events-none absolute inset-0 flex">
        {/* Left panel — light */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-white via-secondary/[0.03] to-primary/[0.05]" />
        {/* Right panel — dark */}
        <div className="hidden md:block w-1/2 bg-primary" />
      </div>

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute right-0 top-1/4 h-72 w-72 rounded-full bg-secondary/25 blur-[80px]" />
      <div className="pointer-events-none absolute right-1/4 bottom-0 h-56 w-56 rounded-full bg-accent/20 blur-[80px]" />
      <div className="pointer-events-none absolute left-8 top-16 h-64 w-64 rounded-full bg-primary/8 blur-[80px]" />

      {/* Grid texture — right side */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden md:block w-1/2 opacity-[0.06]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />

      {/* Decorative arcs — right panel */}
      <svg className="pointer-events-none absolute right-0 top-0 hidden md:block h-full w-1/2 opacity-[0.06]" viewBox="0 0 500 900" fill="none" preserveAspectRatio="xMidYMid slice">
        <circle cx="0" cy="450" r="380" stroke="white" strokeWidth="1" />
        <circle cx="0" cy="450" r="270" stroke="white" strokeWidth="1" />
        <circle cx="0" cy="450" r="170" stroke="white" strokeWidth="1" />
      </svg>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-12 md:px-8">
        <div className="grid w-full md:grid-cols-2 gap-0">

          {/* LEFT — Form panel */}
          <section className="order-1 flex flex-col items-center justify-center min-h-screen md:min-h-0 py-16 px-6 md:px-12 lg:px-16">

            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 mb-10 md:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
                <span className="text-xs font-black text-white">NK</span>
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-primary">Nirapod Kontho</span>
            </div>

            <div className="w-full max-w-sm">
              {/* Form heading */}
              <div className="mb-8">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary mb-2">Get started</p>
                <h2 className="text-2xl font-black text-foreground tracking-tight">Create your account</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">Join the safe reporting community — free, always.</p>
              </div>

              {/* The actual form component */}
              <RegisterForm />

              {/* Mobile login link */}
              <p className="mt-6 text-center text-xs text-muted-foreground md:hidden">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Bottom trust badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {['Free to use', 'No spam', 'Identity protected'].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-[10px] font-semibold text-primary/70">
                  <CheckCircle2 className="h-3 w-3 text-secondary" />{badge}
                </span>
              ))}
            </div>
          </section>

          {/* RIGHT — Info panel */}
          <section className="order-2 hidden md:flex flex-col justify-between py-16 px-12 lg:px-16">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20">
                <span className="text-sm font-black text-white">NK</span>
              </div>
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-white/70">Nirapod Kontho</span>
            </div>

            {/* Main copy */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-secondary mb-6">
                  <ShieldPlus className="h-3.5 w-3.5" />
                  Start Securely
                </div>

                <h1 className="text-[clamp(2rem,4vw,3rem)] font-black leading-[0.95] tracking-[-0.03em] text-white">
                  Report with<br />Complete<br />
                  <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                    Confidence
                  </span>
                </h1>

                <div className="mt-4 h-[2px] w-16 rounded-full bg-gradient-to-r from-secondary to-accent" />

                <p className="mt-6 text-sm leading-relaxed text-white/60 max-w-sm">
                  Registration gives you a powerful tool to submit reports safely, monitor real-time updates, and keep every report organized in your secure dashboard.
                </p>
              </div>

              {/* Benefits grid */}
              <div className="grid grid-cols-2 gap-3">
                {benefits.map((b) => {
                  const Icon = b.icon;
                  return (
                    <div key={b.title} className="rounded-2xl border border-white/8 bg-white/5 p-4 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/15">
                      <Icon className={`h-5 w-5 ${b.accent} mb-2.5`} />
                      <p className="text-xs font-bold text-white leading-snug">{b.title}</p>
                      <p className="text-[11px] text-white/45 mt-1 leading-snug">{b.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer link */}
            <p className="text-xs text-white/40">
              Already have an account?{' '}
              <Link href="/login" className="inline-flex items-center gap-1 font-bold text-secondary hover:text-secondary/80 transition-colors">
                Sign in <ArrowRight className="h-3 w-3" />
              </Link>
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}