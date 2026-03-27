'use client';

import { memo, useState } from 'react';
import { Button } from '@/components/ui/button';
import type { CaseStatus, NgoCase } from '../services/ngo.api';

interface CaseCardProps {
  item: NgoCase;
  onUpdate: (id: string, status: CaseStatus, note?: string) => Promise<void>;
  isUpdating: boolean;
}

const statusOptions: CaseStatus[] = ['UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

function CaseCardComponent({ item, onUpdate, isUpdating }: CaseCardProps) {
  const [status, setStatus] = useState<CaseStatus>(item.status);
  const [note, setNote] = useState('');

  const isDirty = status !== item.status || note.trim().length > 0;

  const handleUpdate = async () => {
    await onUpdate(item.id, status, note.trim() || undefined);
    setNote('');
  };

  return (
    <div className="space-y-3 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-primary">{item.report.type}</h3>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-700">{item.status}</span>
      </div>

      <p className="text-sm text-gray-700">{item.report.description}</p>
      <p className="text-sm text-gray-500">Location: {item.report.location}</p>
      <p className="text-xs text-gray-400">Created: {new Date(item.createdAt).toLocaleString()}</p>

      <div className="grid gap-3 md:grid-cols-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as CaseStatus)}
          className="rounded border px-3 py-2 text-sm"
          disabled={isUpdating}
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <Button
          type="button"
          disabled={!isDirty || isUpdating}
          onClick={handleUpdate}
        >
          Update Case
        </Button>
      </div>

      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Internal note (optional)"
        rows={3}
        className="w-full rounded border p-2 text-sm"
        maxLength={500}
      />

      {item.notes?.length ? (
        <div className="space-y-2 border-t pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Recent Internal Notes</p>
          {item.notes.map((entry) => (
            <div key={entry.id} className="rounded border bg-slate-50 p-2">
              <p className="text-sm text-gray-700">{entry.note}</p>
              <p className="mt-1 text-xs text-gray-500">
                {entry.author.name || entry.author.email} • {new Date(entry.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const CaseCard = memo(CaseCardComponent);
export default CaseCard;
