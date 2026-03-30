'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function NgoSettingsPage() {
  const [defaultNoteTemplate, setDefaultNoteTemplate] = useState('Case reviewed by NGO team. Next follow-up in 48 hours.');
  const [urgentEscalationEmail, setUrgentEscalationEmail] = useState('ngo-escalation@nirapod-kontho.org');

  const saveSettings = () => {
    toast.success('NGO dashboard settings saved for this session.');
  };

  return (
    <ProtectedRoute allowedRoles={['NGO_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">NGO Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">Configure operational defaults for safer case handling workflows.</p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">Case Update Defaults</h2>
            <div className="mt-3 space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-primary">Default Note Template</label>
                <textarea
                  value={defaultNoteTemplate}
                  onChange={(event) => setDefaultNoteTemplate(event.target.value)}
                  rows={4}
                  className="w-full rounded-md border bg-background p-2 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-primary">Urgent Escalation Email</label>
                <Input value={urgentEscalationEmail} onChange={(event) => setUrgentEscalationEmail(event.target.value)} />
              </div>

              <Button type="button" onClick={saveSettings}>Save Settings</Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">Workflow Guardrails</h2>
            <div className="mt-3 space-y-2">
              <Row label="Sensitive case mode" value="Enabled" />
              <Row label="Internal notes retention" value="Active" />
              <div className="flex items-center justify-between rounded-lg border bg-background/80 px-3 py-2">
                <p className="text-sm text-muted-foreground">Escalation status</p>
                <Badge>Operational</Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-background/80 px-3 py-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-primary">{value}</p>
    </div>
  );
}
