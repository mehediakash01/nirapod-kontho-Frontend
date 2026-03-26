import Link from 'next/link';
import { KeyRound, MailCheck } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(145deg,#f8fafc_0%,#eaf4f1_52%,#f4eee7_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(5,150,105,0.18),transparent_38%),radial-gradient(circle_at_90%_20%,rgba(53,38,12,0.14),transparent_34%),radial-gradient(circle_at_75%_90%,rgba(30,41,59,0.18),transparent_42%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10 md:px-8">
        <div className="w-full rounded-3xl border border-primary/20 bg-white/60 p-8 text-center shadow-[0_30px_80px_-30px_rgba(30,41,59,0.45)] backdrop-blur-xl md:p-12">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/15 text-secondary">
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Password recovery</h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-primary/80 md:text-base">
            This page is ready for your reset-password API integration. Connect your backend endpoint and send the reset email flow from here.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 text-sm font-medium text-secondary">
            <MailCheck className="h-4 w-4" />
            Reset flow placeholder is active
          </div>
          <p className="mt-8 text-sm text-primary/80">
            Return to{' '}
            <Link href="/login" className="font-semibold text-secondary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
