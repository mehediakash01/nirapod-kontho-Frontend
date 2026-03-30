'use client';

import ReportCard from '@/src/modules/report/components/ReportCard';
import { useReports } from '@/src/modules/report/hooks/useReports';
import Link from 'next/link';
import { useNotifications } from '@/src/modules/notification/hooks/useNotifications';
import { useAuth } from '@/src/hooks/useAuth';
import { Shield, Mail, Clock } from 'lucide-react';


export default function UserDashboard() {
  const { data: user } = useAuth();
  const { data, isLoading } = useReports();
  const { data: notifications } = useNotifications();

  if (isLoading) return <p>Loading...</p>;

  const unreadCount = notifications?.filter((item) => !item.isRead).length ?? 0;
  const recentReports = data?.slice(0, 4) ?? [];

  // Format role for display
  const roleDisplay = user?.role ? user.role.replace(/_/g, ' ') : 'USER';

  return (
    <div className="space-y-6">
      {/* User Profile Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <img 
                src={user.image} 
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-primary"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user?.name || 'User'}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/15 border border-primary/20 rounded-lg">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-semibold text-primary capitalize">{roleDisplay}</span>
          </div>
        </div>
      </div>

      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <Link
          href="/dashboard/user/create"
          className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          + Report Incident
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Link href="/dashboard/user/reports" className="rounded-lg border bg-white dark:bg-slate-950 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Total Reports</p>
          <p className="mt-1 text-2xl font-bold text-primary">{data?.length ?? 0}</p>
        </Link>
        <Link href="/dashboard/user/reports" className="rounded-lg border bg-white dark:bg-slate-950 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Submitted</p>
          <p className="mt-1 text-2xl font-bold text-yellow-700">
            {data?.filter((item) => item.status === 'SUBMITTED').length ?? 0}
          </p>
        </Link>
        <Link href="/dashboard/user/notifications" className="rounded-lg border bg-white dark:bg-slate-950 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Unread Notifications</p>
          <p className="mt-1 text-2xl font-bold text-secondary">{unreadCount}</p>
        </Link>
        <Link href="/dashboard/user/donations" className="rounded-lg border bg-white dark:bg-slate-950 p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm text-gray-500">Support Campaign</p>
          <p className="mt-1 text-sm font-semibold text-primary">View donation history</p>
        </Link>
      </div>

      {/* Recent Reports */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Recent Reports</h2>
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