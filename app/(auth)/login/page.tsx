import LoginForm from "@/src/modules/auth/components/LoginForm";
import Link from 'next/link';
import { LockKeyhole, ShieldCheck, ArrowRight, Lock } from 'lucide-react';


export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(145deg,#f8fafc_0%,#eaf4f1_52%,#f4eee7_100%)]">
      {/* Animated gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(5,150,105,0.2),transparent_38%),radial-gradient(circle_at_90%_20%,rgba(53,38,12,0.15),transparent_34%),radial-gradient(circle_at_75%_90%,rgba(30,41,59,0.2),transparent_42%)]" />
      
      {/* Floating accent elements */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-4 py-10 md:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-primary/20 bg-white/60 shadow-[0_30px_80px_-30px_rgba(30,41,59,0.5)] backdrop-blur-xl md:grid-cols-2 gap-0">
          {/* Left Section - Info */}
          <section className="order-2 hidden flex-col justify-center space-y-8 border-t border-primary/10 p-8 md:order-1 md:flex md:border-r md:border-t-0 md:p-12 lg:p-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-3.5 py-1.5 text-sm font-semibold text-secondary">
                <LockKeyhole className="h-4 w-4" />
                Secure Access
              </div>
              <h1 className="text-4xl font-bold leading-tight text-primary">
                Welcome Back to<br />
                <span className="bg-gradient-to-r from-secondary via-tertiary to-primary bg-clip-text text-transparent">
                  Safer Reporting
                </span>
              </h1>
              <p className="max-w-lg text-base leading-7 text-primary/75">
                Continue your protected reporting journey. Access your reports, case updates, and keep your actions organized in one private, secure space.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="group flex items-start gap-4 rounded-xl border border-primary/10 bg-gradient-to-r from-white/50 to-white/30 p-4 transition-all hover:border-secondary/20 hover:bg-white/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/15 text-secondary group-hover:bg-secondary/25 transition-colors">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-primary">Protected Sessions</p>
                  <p className="text-sm text-primary/65">Secure access with advanced controls</p>
                </div>
              </div>

              <div className="group flex items-start gap-4 rounded-xl border border-primary/10 bg-gradient-to-r from-white/50 to-white/30 p-4 transition-all hover:border-tertiary/20 hover:bg-white/60">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-tertiary/15 text-tertiary group-hover:bg-tertiary/25 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-primary">Privacy First</p>
                  <p className="text-sm text-primary/65">Your data stays encrypted end-to-end</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-primary/70">
                New to Nirapod Kontho?{' '}
                <Link href="/register" className="inline-flex items-center gap-1 font-semibold text-secondary hover:text-secondary/80 transition-colors">
                  Get started <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </p>
            </div>
          </section>

          {/* Right Section - Form */}
          <section className="order-1 flex flex-col items-center justify-center bg-gradient-to-br from-white/80 via-white/60 to-primary/5 p-6 md:order-2 md:p-8 lg:p-10">
            <div className="w-full max-w-sm">
              <div className="mb-8 text-center md:hidden">
                <h1 className="text-2xl font-bold text-primary">Welcome Back</h1>
                <p className="text-sm text-primary/70 mt-2">Sign in to your secure account</p>
              </div>
              <LoginForm />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}