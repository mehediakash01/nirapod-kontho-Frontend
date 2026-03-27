import { api } from '@/src/services/api';

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface DonationRecord {
  id: string;
  amount: number;
  paymentStatus: PaymentStatus;
  transactionId: string;
  createdAt: string;
}

export interface DonationDashboardSummary {
  totalAmount: number;
  totalSuccessfulDonations: number;
  totalPendingDonations: number;
  totalFailedDonations: number;
  thisMonthAmount: number;
  monthlySubscriptionPayments: number;
}

export interface DonationMonthlyTrendItem {
  period: string;
  amount: number;
}

export interface DonationDashboardTransaction {
  id: string;
  amount: number;
  paymentStatus: PaymentStatus;
  transactionId: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface DonationDashboardData {
  summary: DonationDashboardSummary;
  monthlyTrend: DonationMonthlyTrendItem[];
  recentTransactions: DonationDashboardTransaction[];
}

export const createOneTimeCheckout = async (amount: number) => {
  const res = await api.post('/payments/one-time-checkout', { amount });
  return res.data.data as { checkoutUrl: string; sessionId: string };
};

export const createMonthlySubscription = async (amount: number) => {
  const res = await api.post('/payments/monthly-subscription', { amount });
  return res.data.data as { checkoutUrl: string; sessionId: string };
};

export const getMyDonations = async (): Promise<DonationRecord[]> => {
  const res = await api.get('/payments/my-history');
  return res.data.data;
};

export const getDonationDashboard = async (): Promise<DonationDashboardData> => {
  const res = await api.get('/payments/dashboard');
  return res.data.data;
};
