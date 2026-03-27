'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { PendingReport, ModerationAction } from '../services/verification.api';

interface PendingReportCardProps {
  report: PendingReport;
  onAction: (reportId: string, status: ModerationAction, note?: string) => Promise<void>;
  isUpdating: boolean;
}

export default function PendingReportCard({ report, onAction, isUpdating }: PendingReportCardProps) {
  const [note, setNote] = useState('');

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-primary">{report.type}</h3>
        <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
          {report.status}
        </span>
      </div>

      <p className="text-sm text-gray-700">{report.description}</p>
      <p className="text-sm text-gray-500">Location: {report.location}</p>
      <p className="text-xs text-gray-400">{new Date(report.createdAt).toLocaleString()}</p>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        placeholder="Optional moderator note"
        className="w-full rounded border p-2 text-sm"
      />

      <div className="flex gap-2">
        <Button
          type="button"
          className="bg-green-600 text-white hover:bg-green-700"
          disabled={isUpdating}
          onClick={() => onAction(report.id, 'APPROVED', note.trim() || undefined)}
        >
          Approve
        </Button>
        <Button
          type="button"
          variant="destructive"
          disabled={isUpdating}
          onClick={() => onAction(report.id, 'REJECTED', note.trim() || undefined)}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
