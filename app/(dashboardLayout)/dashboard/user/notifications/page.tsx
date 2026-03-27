'use client';

import { useNotifications } from '@/src/modules/notification/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function UserNotificationsPage() {
  const { data, isLoading, markAsRead, isMarkingAsRead } = useNotifications();

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      toast.success('Notification marked as read');
    } catch {
      toast.error('Failed to update notification');
    }
  };

  if (isLoading) {
    return <p>Loading notifications...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">My Notifications</h1>

      {data?.length ? (
        <div className="space-y-3">
          {data.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg border p-4 ${
                notification.isRead ? 'bg-white' : 'bg-secondary/5 border-secondary/30'
              }`}
            >
              <p className="text-sm text-gray-800">{notification.message}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
                {!notification.isRead ? (
                  <Button
                    type="button"
                    size="sm"
                    disabled={isMarkingAsRead}
                    onClick={() => handleMarkRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                ) : (
                  <span className="text-xs font-medium text-green-700">Read</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-600">No notifications yet.</p>
      )}
    </div>
  );
}
