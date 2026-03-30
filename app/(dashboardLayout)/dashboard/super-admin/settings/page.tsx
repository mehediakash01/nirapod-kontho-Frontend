'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { getDonationDashboard } from '@/src/modules/payment/services/payment.api';
import { getSuperAdminAnalytics } from '@/src/modules/super-admin/services/super-admin.api';

export default function SuperAdminSettingsPage() {
  const [opsEmail, setOpsEmail] = useState('ops@nirapod-kontho.org');
  const [slaTargetHours, setSlaTargetHours] = useState('24');

  const analyticsQuery = useQuery({
    queryKey: ['super-admin-analytics'],
    queryFn: getSuperAdminAnalytics,
  });

  const donationQuery = useQuery({
    queryKey: ['donation-dashboard'],
    queryFn: getDonationDashboard,
  });

  const handleSave = () => {
    toast.success('Operational settings snapshot saved locally for this session.');
  };

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">Platform Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Configure operations defaults and monitor environment-level health indicators.
          </p>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">Operations Defaults</h2>
            <p className="mt-1 text-sm text-muted-foreground">These controls help standardize response workflows.</p>

            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Escalation Email</label>
                <Input value={opsEmail} onChange={(event) => setOpsEmail(event.target.value)} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary">Case SLA Target (hours)</label>
                <Input value={slaTargetHours} onChange={(event) => setSlaTargetHours(event.target.value)} />
              </div>

              <Button type="button" onClick={handleSave}>Save Settings</Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">System Health</h2>
            <p className="mt-1 text-sm text-muted-foreground">Live indicators from analytics and payment services.</p>

            <div className="mt-4 space-y-2">
              <HealthRow
                label="Report Pipeline"
                value={`${analyticsQuery.data?.verifiedReports ?? 0} verified / ${analyticsQuery.data?.submittedReports ?? 0} submitted`}
              />
              <HealthRow
                label="Case Resolution"
                value={`${analyticsQuery.data?.resolvedCases ?? 0} resolved`}
              />
              <HealthRow
                label="Payment Success"
                value={`${donationQuery.data?.summary.totalSuccessfulDonations ?? 0} successful`}
              />
              <div className="flex items-center justify-between rounded-lg border bg-background/80 px-3 py-2">
                <p className="text-sm text-muted-foreground">Environment Status</p>
                <Badge variant="default">Operational</Badge>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

function HealthRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-background/80 px-3 py-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold text-primary">{value}</p>
    </div>
  );
}
