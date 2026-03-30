'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileAudio,
  FileImage,
  FileVideo,
  LocateFixed,
  MapPin,
  ShieldAlert,
  UserRound,
  Volume2,
  XCircle,
} from 'lucide-react';
import type {
  ModerationAction,
  PendingReport,
  RejectionReason,
} from '../services/verification.api';

interface PendingReportCardProps {
  report: PendingReport;
  onAction: (payload: {
    reportId: string;
    status: ModerationAction;
    note?: string;
    rejectionReason?: RejectionReason;
    checklist?: string[];
  }) => Promise<void>;
  isUpdating: boolean;
}

export default function PendingReportCard({ report, onAction, isUpdating }: PendingReportCardProps) {
  const [note, setNote] = useState('');
  const [rejectionReason, setRejectionReason] = useState<RejectionReason | ''>('');
  const [showVoiceNote, setShowVoiceNote] = useState(false);

  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    incidentDetailsClear: false,
    evidenceMatchesNarrative: false,
    locationLooksSpecific: false,
    noObviousSpamSignals: false,
  });

  const checklistOptions: Array<{ key: keyof typeof checklist; label: string }> = [
    { key: 'incidentDetailsClear', label: 'Incident details are clear and specific' },
    { key: 'evidenceMatchesNarrative', label: 'Evidence supports the narrative' },
    { key: 'locationLooksSpecific', label: 'Location and time context are sufficient' },
    { key: 'noObviousSpamSignals', label: 'No obvious spam/fabrication signals' },
  ];

  const selectedChecklist = checklistOptions
    .filter((item) => checklist[item.key])
    .map((item) => item.label);

  const formatDate = (value?: string | null) => {
    if (!value) return 'Not provided';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not provided';
    return date.toLocaleDateString();
  };

  const formatTime = (value?: string | null) => {
    if (!value) return 'Not provided';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Not provided';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const severityTone =
    report.severity === 'URGENT'
      ? 'destructive'
      : report.severity === 'MODERATE'
      ? 'secondary'
      : 'outline';

  const handleApprove = async () => {
    await onAction({
      reportId: report.id,
      status: 'APPROVED',
      note: note.trim() || undefined,
      checklist: selectedChecklist,
    });
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      return;
    }

    await onAction({
      reportId: report.id,
      status: 'REJECTED',
      note: note.trim() || undefined,
      rejectionReason,
      checklist: selectedChecklist,
    });
  };

  return (
    <Card className="border-border/80 bg-white shadow-sm">
      <CardHeader className="border-b border-border/70">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <CardTitle className="text-primary">{report.type.replaceAll('_', ' ')}</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="uppercase">
                {report.status}
              </Badge>
              <Badge variant={severityTone} className="uppercase">
                {report.severity ?? 'UNSPECIFIED'}
              </Badge>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <p className="flex items-center gap-1">
              <UserRound className="size-3.5" />
              {report.reporterInsight?.label ?? 'Reporter profile unavailable'}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarClock className="size-3.5" /> Incident Date
            </p>
            <p className="font-medium text-foreground">{formatDate(report.incidentDate)}</p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Clock3 className="size-3.5" /> Incident Time
            </p>
            <p className="font-medium text-foreground">{formatTime(report.incidentDate)}</p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-3 sm:col-span-2">
            <p className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" /> Location
            </p>
            <p className="font-medium text-foreground">{report.location}</p>
            {typeof report.latitude === 'number' && typeof report.longitude === 'number' ? (
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <LocateFixed className="size-3.5" />
                {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Incident Description</h4>
          <p className="rounded-lg border bg-background p-3 text-sm leading-relaxed text-muted-foreground">
            {report.description}
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">Evidence Attachments</h4>
            <Badge variant="outline">{report.evidence.length} file(s)</Badge>
          </div>

          {report.evidence.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {report.evidence.map((item) => {
                const isImage = item.fileType.startsWith('image/');
                const isVideo = item.fileType.startsWith('video/');

                return (
                  <Dialog key={item.id}>
                    <DialogTrigger asChild>
                      <button
                        type="button"
                        className="group relative overflow-hidden rounded-lg border bg-muted/30 text-left transition hover:border-primary/60"
                      >
                        {isImage ? (
                          <img src={item.fileUrl} alt="Evidence" className="h-28 w-full object-cover" />
                        ) : isVideo ? (
                          <video src={item.fileUrl} className="h-28 w-full object-cover" />
                        ) : (
                          <div className="flex h-28 w-full items-center justify-center bg-muted/70">
                            {item.fileType.startsWith('audio/') ? (
                              <FileAudio className="size-6 text-muted-foreground" />
                            ) : (
                              <FileImage className="size-6 text-muted-foreground" />
                            )}
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1 text-[11px] text-white">
                          {item.fileType.startsWith('video/') ? (
                            <span className="inline-flex items-center gap-1"><FileVideo className="size-3" />Video</span>
                          ) : item.fileType.startsWith('audio/') ? (
                            <span className="inline-flex items-center gap-1"><FileAudio className="size-3" />Audio</span>
                          ) : (
                            <span className="inline-flex items-center gap-1"><FileImage className="size-3" />Image</span>
                          )}
                        </div>
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>Evidence Preview</DialogTitle>
                      </DialogHeader>
                      {isImage ? (
                        <img src={item.fileUrl} alt="Evidence preview" className="max-h-[70vh] w-full rounded-lg object-contain" />
                      ) : isVideo ? (
                        <video src={item.fileUrl} controls className="max-h-[70vh] w-full rounded-lg object-contain" />
                      ) : (
                        <audio src={item.fileUrl} controls className="w-full" />
                      )}
                    </DialogContent>
                  </Dialog>
                );
              })}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed p-3 text-sm text-muted-foreground">
              No evidence files uploaded.
            </p>
          )}
        </div>

        <div className="space-y-2 rounded-lg border bg-muted/20 p-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">Voice Note</h4>
            {report.voiceNoteUrl ? (
              <Button type="button" variant="outline" size="sm" onClick={() => setShowVoiceNote((prev) => !prev)}>
                <Volume2 className="size-4" />
                {showVoiceNote ? 'Hide Player' : 'Play Voice Note'}
              </Button>
            ) : null}
          </div>

          {report.voiceNoteUrl ? (
            showVoiceNote ? <audio src={report.voiceNoteUrl} controls className="w-full" /> : null
          ) : (
            <p className="text-sm text-muted-foreground">No voice note attached.</p>
          )}
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground">Verification Checklist</h4>
          <div className="grid gap-2">
            {checklistOptions.map((item) => (
              <label
                key={item.key}
                className="flex cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={checklist[item.key]}
                  onChange={(event) => {
                    setChecklist((prev) => ({
                      ...prev,
                      [item.key]: event.target.checked,
                    }));
                  }}
                />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Rejection Reason (Required for reject)</label>
          <select
            value={rejectionReason}
            onChange={(event) => setRejectionReason(event.target.value as RejectionReason | '')}
            className="h-10 w-full rounded-md border bg-background px-3 text-sm"
          >
            <option value="">Select rejection reason</option>
            <option value="INSUFFICIENT_EVIDENCE">Insufficient evidence</option>
            <option value="INCONSISTENT_DETAILS">Inconsistent details</option>
            <option value="DUPLICATE_REPORT">Duplicate report</option>
            <option value="OUT_OF_SCOPE">Out of scope</option>
            <option value="POTENTIAL_SPAM">Potential spam</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Moderator Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Add contextual notes for audit trail and NGO handoff"
            className="w-full rounded-md border bg-background p-2 text-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 border-t pt-4">
          <Button
            type="button"
            className="bg-emerald-600 text-white hover:bg-emerald-700"
            disabled={isUpdating}
            onClick={handleApprove}
          >
            <CheckCircle2 className="size-4" /> Approve Report
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isUpdating || !rejectionReason}
            onClick={handleReject}
          >
            <XCircle className="size-4" /> Reject Report
          </Button>
          {!rejectionReason ? (
            <p className="inline-flex items-center gap-1 text-xs text-amber-700">
              <AlertTriangle className="size-3.5" /> Select rejection reason to enable reject action.
            </p>
          ) : (
            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <ShieldAlert className="size-3.5" /> Rejection reason will be saved in verification feedback.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
