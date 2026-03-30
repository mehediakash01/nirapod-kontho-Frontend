'use client';

import { memo, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock3, FileAudio, FileImage, FileText, ListChecks, ShieldAlert } from 'lucide-react';
import type { CaseStatus, NgoCase } from '../services/ngo.api';

interface CaseCardProps {
  item: NgoCase;
  onUpdate: (id: string, status: CaseStatus, note?: string) => Promise<void>;
  isUpdating: boolean;
}

const statusOptions: CaseStatus[] = ['UNDER_REVIEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const tabOptions = ['summary', 'evidence', 'notes', 'history'] as const;
type TabKey = (typeof tabOptions)[number];

const statusBadgeClassMap: Record<CaseStatus, string> = {
  UNDER_REVIEW: 'bg-amber-100 text-amber-800 border-amber-200',
  IN_PROGRESS: 'bg-sky-100 text-sky-800 border-sky-200',
  RESOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  CLOSED: 'bg-slate-200 text-slate-700 border-slate-300',
};

const priorityBadgeClassMap: Record<'LOW' | 'MEDIUM' | 'HIGH', string> = {
  LOW: 'bg-slate-100 text-slate-700 border-slate-300',
  MEDIUM: 'bg-orange-100 text-orange-800 border-orange-200',
  HIGH: 'bg-rose-100 text-rose-800 border-rose-200',
};

const reportTypeLabels: Record<NgoCase['report']['type'], string> = {
  HARASSMENT: 'Harassment',
  DOMESTIC_VIOLENCE: 'Domestic Violence',
  STALKING: 'Stalking',
  CORRUPTION: 'Corruption',
  THREAT: 'Threat',
};

function CaseCardComponent({ item, onUpdate, isUpdating }: CaseCardProps) {
  const [status, setStatus] = useState<CaseStatus>(item.status);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('summary');

  const isDirty = status !== item.status || note.trim().length > 0;

  const timelineEvents = useMemo(
    () => [
      {
        id: `created-${item.id}`,
        title: 'Case created and assigned',
        detail: `Priority: ${item.priority}`,
        at: item.createdAt,
      },
      ...item.notes.map((entry) => ({
        id: entry.id,
        title: 'Case note added',
        detail: `${entry.author.name || entry.author.email}: ${entry.note}`,
        at: entry.createdAt,
      })),
      {
        id: `status-${item.id}`,
        title: `Current status: ${item.status}`,
        detail: 'Latest case state from NGO dashboard',
        at: item.createdAt,
      },
    ].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()),
    [item]
  );

  const handleUpdate = async () => {
    await onUpdate(item.id, status, note.trim() || undefined);
    setNote('');
  };

  const openTab = (tab: TabKey) => setActiveTab(tab);

  return (
    <article className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm backdrop-blur-sm">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-primary">{reportTypeLabels[item.report.type]}</h3>
          <p className="mt-1 text-xs text-muted-foreground">Case ID: {item.id}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={priorityBadgeClassMap[item.priority]}>{item.priority} Priority</Badge>
          <Badge className={statusBadgeClassMap[item.status]}>{item.status.replace('_', ' ')}</Badge>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {tabOptions.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => openTab(tab)}
            className={`rounded-full border px-3 py-1 text-xs font-medium capitalize transition ${
              activeTab === tab
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-muted-foreground hover:border-primary/40'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'summary' ? (
        <div className="space-y-3 rounded-xl border bg-background/80 p-3">
          <p className="text-sm text-foreground">{item.report.description}</p>
          <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <p>Location: {item.report.location}</p>
            <p>Reported: {new Date(item.report.createdAt).toLocaleString()}</p>
            <p>Incident: {item.report.incidentDate ? new Date(item.report.incidentDate).toLocaleString() : 'N/A'}</p>
            <p>Severity: {item.report.severity ?? 'N/A'}</p>
          </div>
        </div>
      ) : null}

      {activeTab === 'evidence' ? (
        <div className="space-y-3 rounded-xl border bg-background/80 p-3">
          {item.report.voiceNoteUrl ? (
            <div className="rounded-lg border bg-card p-3">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-primary">
                <FileAudio className="size-4" /> Voice Note
              </p>
              <audio controls className="w-full" src={item.report.voiceNoteUrl} />
            </div>
          ) : null}

          {item.report.evidence.length ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {item.report.evidence.map((evidence) => {
                const isImage = evidence.fileType.toLowerCase().startsWith('image');
                return (
                  <a
                    key={evidence.id}
                    href={evidence.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group overflow-hidden rounded-lg border bg-card transition hover:border-primary/40"
                  >
                    {isImage ? (
                      <img
                        src={evidence.fileUrl}
                        alt="Case evidence"
                        className="h-28 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-28 items-center justify-center bg-muted/30 text-muted-foreground">
                        <FileText className="size-6" />
                      </div>
                    )}
                    <div className="flex items-center justify-between p-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {isImage ? <FileImage className="size-3.5" /> : <FileText className="size-3.5" />} {evidence.fileType}
                      </span>
                      <span>{new Date(evidence.createdAt).toLocaleDateString()}</span>
                    </div>
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No uploaded evidence for this case.</p>
          )}
        </div>
      ) : null}

      {activeTab === 'notes' ? (
        <div className="space-y-3 rounded-xl border bg-background/80 p-3">
          <div className="space-y-2">
            {item.notes?.length ? (
              item.notes.map((entry) => (
                <div key={entry.id} className="rounded-lg border bg-card p-3">
                  <p className="text-sm text-foreground">{entry.note}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {entry.author.name || entry.author.email} | {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No notes added yet.</p>
            )}
          </div>
        </div>
      ) : null}

      {activeTab === 'history' ? (
        <div className="space-y-3 rounded-xl border bg-background/80 p-3">
          {timelineEvents.map((event, index) => (
            <div key={event.id} className="relative pl-6">
              {index < timelineEvents.length - 1 ? (
                <span className="absolute left-2 top-5 h-full w-px bg-border" />
              ) : null}
              <span className="absolute left-0 top-1.5 inline-flex size-4 items-center justify-center rounded-full bg-primary/15 text-primary">
                <ListChecks className="size-2.5" />
              </span>
              <p className="text-sm font-medium text-foreground">{event.title}</p>
              <p className="text-xs text-muted-foreground">{event.detail}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{new Date(event.at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-4 rounded-xl border bg-background/70 p-3">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
          <Clock3 className="size-4" /> Case Status Update
        </p>

        <div className="grid gap-3 md:grid-cols-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as CaseStatus)}
            className="h-10 rounded-md border bg-background px-3 text-sm"
            disabled={isUpdating}
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <Button type="button" disabled={!isDirty || isUpdating} onClick={handleUpdate}>
            {isUpdating ? 'Saving...' : 'Save Update'}
          </Button>
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add operational note for this status update"
          rows={3}
          className="mt-3 w-full rounded-md border bg-background p-2 text-sm"
          maxLength={500}
        />

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <ShieldAlert className="size-3.5" /> Notes are visible to authorized case handlers.
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="size-3.5" /> Reporter receives status notifications automatically.
          </span>
        </div>
      </div>
    </article>
  );
}

const CaseCard = memo(CaseCardComponent);
export default CaseCard;
