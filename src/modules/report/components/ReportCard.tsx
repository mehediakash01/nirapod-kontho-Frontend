import { CalendarDays, MapPin, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { Report } from '../types';

export default function ReportCard({ report }: { report: Report }) {
  const statusVariant = {
    DRAFT: 'outline',
    SUBMITTED: 'secondary',
    VERIFIED: 'default',
    REJECTED: 'destructive',
  } as const;

  const severityTone = {
    MILD: 'text-sky-700 bg-sky-50 border-sky-100',
    MODERATE: 'text-amber-700 bg-amber-50 border-amber-100',
    URGENT: 'text-rose-700 bg-rose-50 border-rose-100',
  };

  return (
    <article className="rounded-xl border bg-background/80 p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-primary">{report.type.replaceAll('_', ' ')}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>

        <Badge variant={statusVariant[report.status]}>
          {report.status}
        </Badge>
      </div>

      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
        {report.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 text-muted-foreground">
          <MapPin className="size-3.5" />
          {report.location}
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 ${severityTone[report.severity]}`}>
          <ShieldAlert className="size-3.5" />
          {report.severity}
        </span>
      </div>
    </article>
  );
}
