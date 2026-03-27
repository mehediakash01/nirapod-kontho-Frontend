'use client';

import ReportCard from '@/src/modules/report/components/ReportCard';
import { useReports } from '@/src/modules/report/hooks/useReports';
import Link from 'next/link';


export default function UserDashboard() {
  const { data, isLoading } = useReports();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-primary">
          My Reports
        </h1>

        <Link
          href="/dashboard/user/create"
          className="bg-primary text-white px-4 py-2 rounded"
        >
          + Create Report
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {data?.map((report: any) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}