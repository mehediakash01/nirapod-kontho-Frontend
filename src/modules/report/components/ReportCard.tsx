export default function ReportCard({ report }: any) {
  const statusColor = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
  };

  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <div className="flex justify-between">
        <h3 className="font-semibold">{report.type}</h3>

        <span
          className={`px-2 py-1 text-sm rounded ${
            statusColor[report.status as keyof typeof statusColor]
          }`}
        >
          {report.status}
        </span>
      </div>

      <p className="mt-2 text-gray-600">
        {report.description}
      </p>

      <p className="text-sm mt-2 text-gray-400">
        {report.location}
      </p>
    </div>
  );
}