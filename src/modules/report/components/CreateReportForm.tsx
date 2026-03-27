'use client';

import { useForm } from 'react-hook-form';
import { createReport } from '../services/report.api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { CreateReportPayload } from '../types';

export default function CreateReportForm() {
  const router = useRouter();

  const { register, handleSubmit } = useForm<CreateReportPayload>({
    defaultValues: {
      type: 'HARASSMENT',
      description: '',
      location: '',
      isAnonymous: false,
    },
  });

  const onSubmit = async (data: CreateReportPayload) => {
    try {
      await createReport(data);
      toast.success('Report submitted successfully');
      router.push('/dashboard/user/reports');
    } catch (err) {
      toast.error('Failed to create report');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-lg"
    >
      <h2 className="text-xl font-bold text-primary">
        Create Report
      </h2>

      <select
        {...register('type')}
        className="w-full border p-3 rounded"
      >
        <option value="HARASSMENT">Harassment</option>
        <option value="DOMESTIC_VIOLENCE">Domestic Violence</option>
        <option value="STALKING">Stalking</option>
        <option value="CORRUPTION">Corruption</option>
        <option value="THREAT">Threat</option>
      </select>

      <textarea
        {...register('description')}
        placeholder="Describe the incident"
        className="w-full border p-3 rounded"
        minLength={10}
      />

      <input
        {...register('location')}
        placeholder="Location"
        className="w-full border p-3 rounded"
        minLength={3}
      />

      <label className="inline-flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" {...register('isAnonymous')} />
        Submit anonymously
      </label>

      <button className="bg-primary text-white px-4 py-2 rounded">
        Submit Report
      </button>
    </form>
  );
}