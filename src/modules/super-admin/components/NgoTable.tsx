'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { NgoItem } from '../services/super-admin.api';

interface NgoTableProps {
  ngos: NgoItem[];
}

export default function NgoTable({ ngos }: NgoTableProps) {
  if (!ngos.length) {
    return <div className="rounded-lg border bg-white p-6 text-sm text-gray-600">No NGOs found.</div>;
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <h2 className="mb-3 text-lg font-semibold text-primary">Registered NGOs</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Open Cases</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ngos.map((ngo) => {
            const openCases = ngo.cases.filter(
              (c) => c.status === 'UNDER_REVIEW' || c.status === 'IN_PROGRESS'
            ).length;

            return (
              <TableRow key={ngo.id}>
                <TableCell className="font-medium">{ngo.name}</TableCell>
                <TableCell>{ngo.email}</TableCell>
                <TableCell>{ngo.phone}</TableCell>
                <TableCell>{openCases}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
