'use client';

import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRecentDecisions } from '@/src/modules/verification/services/verification.api';

export default function ModeratorReviewedReportsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['verification-recent'],
    queryFn: getRecentDecisions,
  });

  if (isLoading) {
    return <p>Loading reviewed reports...</p>;
  }

  if (error) {
    return <p className="text-red-600">Failed to load reviewed reports.</p>;
  }

  return (
    <ProtectedRoute allowedRoles={['MODERATOR', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Reviewed Reports</h1>
          <p className="text-sm text-gray-600">Your recent moderation decisions and recorded feedback.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Decisions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data?.length ? (
              data.map((item) => (
                <div key={item.id} className="rounded-lg border p-3">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-primary">{item.report.type.replaceAll('_', ' ')}</p>
                    <Badge variant={item.status === 'APPROVED' ? 'secondary' : 'destructive'}>
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reviewed at: {new Date(item.createdAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Severity: {item.report.severity ?? 'UNSPECIFIED'}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{item.feedback || 'No feedback note recorded.'}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No reviewed reports yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
