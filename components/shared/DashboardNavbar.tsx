'use client';

import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from 'next/navigation';



export default function DashboardNavbar() {
  const { data, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch {
      // Toast is handled in AuthContext.
    }
  };

  return (
    <div className="flex justify-between items-center p-4 border-b bg-white">
      <h1 className="font-semibold text-primary">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm">{data?.email}</span>
        <button type="button" className="text-red-500" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}