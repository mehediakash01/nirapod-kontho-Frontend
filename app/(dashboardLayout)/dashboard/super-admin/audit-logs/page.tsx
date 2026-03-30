'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Badge } from '@/components/ui/badge';
import { getDonationDashboard } from '@/src/modules/payment/services/payment.api';
import { getAssignmentAuditLogs } from '@/src/modules/super-admin/services/super-admin.api';

type AuditEvent = {
  id: string;
  category: 'PAYMENT' | 'REPORT';
  title: string;
  detail: string;
  time: string;
  severity: 'INFO' | 'WARN' | 'ALERT';
};

export default function SuperAdminAuditLogsPage() {
  const assignmentAuditQuery = useQuery({
    queryKey: ['assignment-audit-logs'],
    queryFn: getAssignmentAuditLogs,
  });

  const donationQuery = useQuery({
    queryKey: ['donation-dashboard'],
    queryFn: getDonationDashboard,
  });

  const events = useMemo<AuditEvent[]>(() => {
    const paymentEvents: AuditEvent[] = (donationQuery.data?.recentTransactions ?? []).slice(0, 10).map((tx) => ({
      id: `payment-${tx.id}`,
      category: 'PAYMENT',
      title: `Donation ${tx.paymentStatus}`,
      detail: `${tx.user.email} | ${tx.transactionId}`,
      time: tx.createdAt,
      severity: tx.paymentStatus === 'FAILED' ? 'ALERT' : tx.paymentStatus === 'PENDING' ? 'WARN' : 'INFO',
    }));

    const reportEvents: AuditEvent[] = (assignmentAuditQuery.data ?? []).slice(0, 20).map((log) => ({
      id: `report-${log.id}`,
      category: 'REPORT',
      title: log.action === 'REASSIGN_NGO' ? 'NGO Reassignment' : 'NGO Assignment',
      detail: `${log.message}${log.rationale ? ` | Rationale: ${log.rationale}` : ''}`,
      time: log.createdAt,
      severity: log.severity === 'ALERT' ? 'ALERT' : log.severity === 'WARN' ? 'WARN' : 'INFO',
    }));

    return [...paymentEvents, ...reportEvents]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 25);
      }, [donationQuery.data, assignmentAuditQuery.data]);

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">Audit Logs</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Unified operational timeline from payment and verified-report activity.
          </p>
        </section>

        {(assignmentAuditQuery.isLoading || donationQuery.isLoading) ? (
          <p className="text-sm text-muted-foreground">Loading audit events...</p>
        ) : null}

        {!assignmentAuditQuery.isLoading && !donationQuery.isLoading && !events.length ? (
          <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No events available.</p>
        ) : null}

        <section className="space-y-3">
          {events.map((event) => (
            <article key={event.id} className="rounded-xl border bg-card/70 p-4 shadow-sm">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold text-primary">{event.title}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{event.category}</Badge>
                  <Badge
                    variant={
                      event.severity === 'ALERT' ? 'destructive' : event.severity === 'WARN' ? 'secondary' : 'default'
                    }
                  >
                    {event.severity}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">{event.detail}</p>
              <p className="mt-2 text-xs text-muted-foreground">{new Date(event.time).toLocaleString()}</p>
            </article>
          ))}
        </section>
      </div>
    </ProtectedRoute>
  );
}
