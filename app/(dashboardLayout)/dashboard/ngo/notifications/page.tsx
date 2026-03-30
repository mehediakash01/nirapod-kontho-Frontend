'use client';

import { Bell } from 'lucide-react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/src/modules/notification/hooks/useNotifications';

export default function NgoNotificationsPage() {
  const { data, isLoading, error, markAsRead, isMarkingAsRead } = useNotifications();

  return (
    <ProtectedRoute allowedRoles={['NGO_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track assignment updates, case events, and system notices.</p>
        </section>

        {isLoading ? <p className="text-sm text-muted-foreground">Loading notifications...</p> : null}
        {error ? <p className="text-sm text-red-600">Failed to load notifications.</p> : null}

        {!isLoading && !error && !data?.length ? (
          <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No notifications yet.</p>
        ) : null}

        <section className="space-y-3">
          {(data ?? []).map((item) => (
            <article key={item.id} className={`rounded-xl border p-4 shadow-sm ${item.isRead ? 'bg-card/60' : 'bg-primary/5'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Bell className="mt-0.5 size-4 text-primary" />
                  <div>
                    <p className="text-sm text-foreground">{item.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                </div>

                {!item.isRead ? (
                  <Button size="sm" variant="outline" onClick={() => markAsRead(item.id)} disabled={isMarkingAsRead}>
                    Mark read
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      </div>
    </ProtectedRoute>
  );
}
