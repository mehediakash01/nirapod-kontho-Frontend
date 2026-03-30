'use client';

import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { BookOpenText, ExternalLink, ShieldCheck } from 'lucide-react';

const resources = [
  {
    title: 'Case Handling Checklist',
    description: 'Standard process for intake, safety triage, escalation, and closure.',
    href: '/how-it-works',
  },
  {
    title: 'Safety Guidance Library',
    description: 'Platform safety practices and trauma-informed communication references.',
    href: '/safety',
  },
  {
    title: 'Support Materials',
    description: 'Public educational resources for legal, social, and emergency support.',
    href: '/resources',
  },
];

export default function NgoResourcesPage() {
  return (
    <ProtectedRoute allowedRoles={['NGO_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">Resources</h1>
          <p className="mt-1 text-sm text-muted-foreground">Operational references for consistent and safe case management.</p>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <a key={resource.title} href={resource.href} className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm transition hover:border-primary/40">
              <div className="mb-2 flex items-center justify-between">
                <BookOpenText className="size-4 text-primary" />
                <ExternalLink className="size-4 text-muted-foreground" />
              </div>
              <p className="font-semibold text-primary">{resource.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{resource.description}</p>
            </a>
          ))}
        </section>

        <section className="rounded-2xl border border-border/70 bg-primary/5 p-4">
          <p className="flex items-center gap-2 text-sm text-primary">
            <ShieldCheck className="size-4" /> For urgent safety risks, follow your NGO escalation protocol before regular status updates.
          </p>
        </section>
      </div>
    </ProtectedRoute>
  );
}
