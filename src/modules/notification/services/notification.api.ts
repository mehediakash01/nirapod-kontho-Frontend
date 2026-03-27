import { api } from '@/src/services/api';

export interface NotificationItem {
  id: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const getMyNotifications = async (): Promise<NotificationItem[]> => {
  const res = await api.get('/notifications');
  return res.data.data;
};

export const markNotificationAsRead = async (id: string): Promise<NotificationItem> => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data.data;
};
