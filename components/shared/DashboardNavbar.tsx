'use client';

import { useAuth } from "@/src/hooks/useAuth";



export default function DashboardNavbar() {
  const { data } = useAuth();

  return (
    <div className="flex justify-between items-center p-4 border-b bg-white">
      <h1 className="font-semibold text-primary">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm">{data?.email}</span>
        <button className="text-red-500">Logout</button>
      </div>
    </div>
  );
}