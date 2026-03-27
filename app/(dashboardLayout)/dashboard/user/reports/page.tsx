'use client';

import Link from 'next/link';
import ReportCard from '@/src/modules/report/components/ReportCard';
import { useReports } from '@/src/modules/report/hooks/useReports';

export default function UserReportsPage() {
  const { data, isLoading } = useReports();

  if (isLoading) {
    return <p>Loading reports...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-primary">My Reports</h1>

        <Link href="/dashboard/user/create" className="bg-primary text-white px-4 py-2 rounded">
          + Create Report
        </Link>
      </div>

      {data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {data.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-600">You have not created any reports yet.</p>
      )}
    </div>
  );
}
