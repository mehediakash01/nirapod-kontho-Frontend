'use client';

import { useState } from 'react';
import DashboardNavbar from '@/components/shared/DashboardNavbar';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Sidebar from '@/components/shared/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onMobileOpenChange={setMobileSidebarOpen}
        />

        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <DashboardNavbar onMenuClick={() => setMobileSidebarOpen(true)} />

          <main className="flex-1 overflow-x-hidden bg-linear-to-b from-background via-muted/30 to-background p-4 sm:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}