import LoginForm from "@/src/modules/auth/components/LoginForm";
import Link from 'next/link';
import { LockKeyhole, ShieldCheck, UserCheck } from 'lucide-react';


export default function LoginPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(145deg,#f8fafc_0%,#eaf4f1_52%,#f4eee7_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(5,150,105,0.18),transparent_38%),radial-gradient(circle_at_90%_20%,rgba(53,38,12,0.14),transparent_34%),radial-gradient(circle_at_75%_90%,rgba(30,41,59,0.18),transparent_42%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 md:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-primary/20 bg-white/55 shadow-[0_30px_80px_-30px_rgba(30,41,59,0.45)] backdrop-blur-xl md:grid-cols-2">
          <section className="order-2 space-y-6 border-t border-primary/10 p-6 md:order-1 md:border-r md:border-t-0 md:p-10 lg:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/35 bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
              <LockKeyhole className="h-4 w-4" />
              Secure Access
            </div>
            <h1 className="text-3xl font-bold leading-tight text-primary md:text-4xl">
              Sign in and continue your protected reporting journey
            </h1>
            <p className="max-w-xl text-sm leading-6 text-primary/80 md:text-base">
              Access your account to submit reports, view case updates, and keep your actions organized in one private space.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-white/70 px-4 py-3">
                <ShieldCheck className="h-5 w-5 text-secondary" />
                <p className="text-sm text-primary">Protected account session with secure access controls</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-white/70 px-4 py-3">
                <UserCheck className="h-5 w-5 text-tertiary" />
                <p className="text-sm text-primary">Case history and report tracking in one clear dashboard</p>
              </div>
            </div>
            <p className="text-sm text-primary/80">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-secondary hover:underline">
                Create one now
              </Link>
            </p>
          </section>

          <section className="order-1 flex items-center justify-center bg-[linear-gradient(160deg,rgba(255,255,255,0.65),rgba(248,250,252,0.35))] p-4 md:order-2 md:p-8 lg:p-10">
            <LoginForm />
          </section>
        </div>
      </div>
    </div>
  );
}