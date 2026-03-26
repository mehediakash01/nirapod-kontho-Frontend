import RegisterForm from "@/src/modules/auth/components/RegisterForm";
import Link from 'next/link';
import { BadgeCheck, ShieldPlus, UserRoundPlus } from 'lucide-react';


export default function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(145deg,#f8fafc_0%,#eaf4f1_52%,#f4eee7_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(5,150,105,0.18),transparent_38%),radial-gradient(circle_at_90%_20%,rgba(53,38,12,0.14),transparent_34%),radial-gradient(circle_at_75%_90%,rgba(30,41,59,0.18),transparent_42%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 md:px-8">
        <div className="grid w-full overflow-hidden rounded-3xl border border-primary/20 bg-white/55 shadow-[0_30px_80px_-30px_rgba(30,41,59,0.45)] backdrop-blur-xl md:grid-cols-2">
          <section className="flex items-center justify-center bg-[linear-gradient(160deg,rgba(255,255,255,0.65),rgba(248,250,252,0.35))] p-4 md:p-8 lg:p-10">
            <RegisterForm />
          </section>

          <section className="space-y-6 border-t border-primary/10 p-6 md:border-l md:border-t-0 md:p-10 lg:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-secondary/35 bg-secondary/10 px-3 py-1 text-sm font-medium text-secondary">
              <ShieldPlus className="h-4 w-4" />
              Start Securely
            </div>
            <h1 className="text-3xl font-bold leading-tight text-primary md:text-4xl">
              Create your account and report with confidence
            </h1>
            <p className="max-w-xl text-sm leading-6 text-primary/80 md:text-base">
              Registration gives you a safer way to submit reports, monitor updates, and keep every report organized.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-white/70 px-4 py-3">
                <UserRoundPlus className="h-5 w-5 text-secondary" />
                <p className="text-sm text-primary">Fast onboarding with clear required information</p>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-primary/10 bg-white/70 px-4 py-3">
                <BadgeCheck className="h-5 w-5 text-tertiary" />
                <p className="text-sm text-primary">Direct account flow linked to sign in instantly</p>
              </div>
            </div>
            <p className="text-sm text-primary/80">
              Already registered?{' '}
              <Link href="/login" className="font-semibold text-secondary hover:underline">
                Sign in now
              </Link>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}