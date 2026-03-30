'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Building2, Mail, MapPin, Phone, Search } from 'lucide-react';
import { getAllNgos } from '@/src/modules/super-admin/services/super-admin.api';

export default function SuperAdminNgosPage() {
  const [search, setSearch] = useState('');

  const ngosQuery = useQuery({
    queryKey: ['all-ngos'],
    queryFn: getAllNgos,
  });

  const ngos = useMemo(() => ngosQuery.data ?? [], [ngosQuery.data]);

  const filteredNgos = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return ngos;

    return ngos.filter((ngo) =>
      `${ngo.name} ${ngo.email} ${ngo.phone} ${ngo.address}`.toLowerCase().includes(key)
    );
  }, [ngos, search]);

  const openCases = useMemo(
    () => ngos.reduce((sum, ngo) => sum + ngo.cases.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length, 0),
    [ngos]
  );

  return (
    <ProtectedRoute allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <section className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
          <h1 className="text-2xl font-bold text-primary">NGO Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse NGO profiles, monitor caseload, and verify contact readiness.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <StatCard title="Total NGOs" value={String(ngos.length)} />
          <StatCard title="Open Cases" value={String(openCases)} />
          <StatCard title="Avg Open / NGO" value={ngos.length ? (openCases / ngos.length).toFixed(1) : '0.0'} />
        </section>

        <section className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Search className="size-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by NGO name, email, phone, address"
            />
          </div>

          {ngosQuery.isLoading ? <p className="text-sm text-muted-foreground">Loading NGOs...</p> : null}
          {ngosQuery.error ? <p className="text-sm text-red-600">Failed to load NGOs.</p> : null}

          {!ngosQuery.isLoading && !ngosQuery.error && !filteredNgos.length ? (
            <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">No NGO records found.</p>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            {filteredNgos.map((ngo) => {
              const ngoOpenCases = ngo.cases.filter((c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED').length;

              return (
                <article key={ngo.id} className="rounded-xl border bg-background/80 p-4">
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-primary">{ngo.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Added {new Date(ngo.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={ngoOpenCases > 5 ? 'destructive' : ngoOpenCases > 0 ? 'secondary' : 'outline'}>
                      {ngoOpenCases} Open
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Mail className="size-4" /> {ngo.email}</p>
                    <p className="flex items-center gap-2"><Phone className="size-4" /> {ngo.phone}</p>
                    <p className="flex items-center gap-2"><MapPin className="size-4" /> {ngo.address}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </ProtectedRoute>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
        <Building2 className="size-4 text-primary" />
      </div>
      <p className="text-2xl font-bold text-primary">{value}</p>
    </div>
  );
}
