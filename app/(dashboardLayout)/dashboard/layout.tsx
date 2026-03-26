'use client';

import DashboardNavbar from '@/components/shared/DashboardNavbar';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Sidebar from '@/components/shared/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1">
          <DashboardNavbar/>
          <main className="p-6 bg-muted">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}