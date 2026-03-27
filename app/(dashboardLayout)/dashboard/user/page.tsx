'use client';

import ReportCard from '@/src/modules/report/components/ReportCard';
import { useReports } from '@/src/modules/report/hooks/useReports';
import Link from 'next/link';
import { useNotifications } from '@/src/modules/notification/hooks/useNotifications';


export default function UserDashboard() {
  const { data, isLoading } = useReports();
  const { data: notifications } = useNotifications();

  if (isLoading) return <p>Loading...</p>;

  const unreadCount = notifications?.filter((item) => !item.isRead).length ?? 0;
  const recentReports = data?.slice(0, 4) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-primary">User Dashboard</h1>

        <Link
          href="/dashboard/user/create"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          + Create Report
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Link href="/dashboard/user/reports" className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Reports</p>
          <p className="mt-1 text-2xl font-bold text-primary">{data?.length ?? 0}</p>
        </Link>
        <Link href="/dashboard/user/reports" className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Submitted</p>
          <p className="mt-1 text-2xl font-bold text-yellow-700">
            {data?.filter((item) => item.status === 'SUBMITTED').length ?? 0}
          </p>
        </Link>
        <Link href="/dashboard/user/notifications" className="rounded-lg border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Unread Notifications</p>
          <p className="mt-1 text-2xl font-bold text-secondary">{unreadCount}</p>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-primary">Recent Reports</h2>
        <Link href="/dashboard/user/reports" className="text-sm font-medium text-secondary hover:underline">
          View all reports
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {recentReports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>

      {!recentReports.length ? (
        <p className="text-sm text-gray-600">You have not created any reports yet.</p>
      ) : null}
    </div>
  );
}