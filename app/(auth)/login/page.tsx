import LoginForm from "@/src/modules/auth/components/LoginForm";
import Link from 'next/link';
import { LockKeyhole, ShieldCheck, Lock, ArrowRight, CheckCircle2, Eye } from 'lucide-react';

const trustPoints = [
  {
    icon: ShieldCheck,
    title: 'Protected Sessions',
    desc: 'Secure access with advanced session controls',
    accent: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    desc: 'Your data stays encrypted end-to-end',
    accent: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Eye,
    title: 'Anonymous Options',
    desc: 'Identify yourself only when you choose to',
    accent: 'text-primary',
    bg: 'bg-primary/10',
  },
];

const stats = [
  { value: '2,400+', label: 'Reports filed' },
  { value: '91%', label: 'Cases resolved' },
  { value: '18', label: 'NGO partners' },
];

export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ── Full-page split background ───────────────────────── */}
      <div className="pointer-events-none absolute inset-0 flex">
        {/* Left panel — dark primary */}
        <div className="hidden md:block w-1/2 bg-primary" />
        {/* Right panel — off-white */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-white via-primary/[0.03] to-secondary/[0.05]" />
      </div>

      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-secondary/25 blur-[80px]" />
      <div className="pointer-events-none absolute left-1/4 bottom-0 h-56 w-56 rounded-full bg-accent/20 blur-[80px]" />
      <div className="pointer-events-none absolute right-8 top-16 h-64 w-64 rounded-full bg-primary/8 blur-[80px]" />

      {/* Grid texture — left side only */}
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden md:block w-1/2 opacity-[0.06]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '56px 56px' }} />

      {/* Decorative arcs — left panel */}
      <svg className="pointer-events-none absolute left-0 top-0 hidden md:block h-full w-1/2 opacity-[0.06]" viewBox="0 0 500 900" fill="none" preserveAspectRatio="xMidYMid slice">
        <circle cx="500" cy="450" r="380" stroke="white" strokeWidth="1" />
        <circle cx="500" cy="450" r="270" stroke="white" strokeWidth="1" />
        <circle cx="500" cy="450" r="170" stroke="white" strokeWidth="1" />
      </svg>

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-12 md:px-8">
        <div className="grid w-full md:grid-cols-2 gap-0">

          {/* LEFT — Info panel */}
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
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Secure Access
                </div>

                <h1 className="text-[clamp(2rem,4vw,3rem)] font-black leading-[0.95] tracking-[-0.03em] text-white">
                  Welcome<br />Back to<br />
                  <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                    Safer Reporting
                  </span>
                </h1>

                <div className="mt-4 h-[2px] w-16 rounded-full bg-gradient-to-r from-secondary to-accent" />

                <p className="mt-6 text-sm leading-relaxed text-white/60 max-w-sm">
                  Continue your protected reporting journey. Access your reports, case updates, and keep your actions organized in one private, secure space.
                </p>
              </div>

              {/* Trust points */}
              <div className="space-y-3">
                {trustPoints.map((tp) => {
                  const Icon = tp.icon;
                  return (
                    <div key={tp.title} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/15">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/8">
                        <Icon className={`h-4 w-4 ${tp.accent}`} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{tp.title}</p>
                        <p className="text-[11px] text-white/50">{tp.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stats row */}
              <div className="flex gap-6 border-t border-white/10 pt-6">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-lg font-black text-secondary">{s.value}</div>
                    <div className="text-[11px] text-white/45 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer link */}
            <p className="text-xs text-white/40">
              New to Nirapod Kontho?{' '}
              <Link href="/register" className="inline-flex items-center gap-1 font-bold text-secondary hover:text-secondary/80 transition-colors">
                Create account <ArrowRight className="h-3 w-3" />
              </Link>
            </p>
          </section>

          {/* RIGHT — Form panel */}
          <section className="order-1 md:order-2 flex flex-col items-center justify-center min-h-screen md:min-h-0 py-16 px-6 md:px-12 lg:px-16">

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
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-secondary mb-2">Sign in</p>
                <h2 className="text-2xl font-black text-foreground tracking-tight">Welcome back</h2>
                <p className="mt-1.5 text-sm text-muted-foreground">Enter your credentials to access your account</p>
              </div>

              {/* The actual form component */}
              <LoginForm />

              {/* Mobile register link */}
              <p className="mt-6 text-center text-xs text-muted-foreground md:hidden">
                Do not have an account?{' '}
                <Link href="/register" className="font-bold text-primary hover:underline">
                  Register
                </Link>
              </p>
            </div>

            {/* Bottom trust badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {['Anonymous reporting', 'Encrypted data', 'Moderated & safe'].map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-[10px] font-semibold text-primary/70">
                  <CheckCircle2 className="h-3 w-3 text-secondary" />{badge}
                </span>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}