'use client';

import { useForm } from 'react-hook-form';
import { createReport } from '../services/report.api';
import { useRouter } from 'next/navigation';

export default function CreateReportForm() {
  const router = useRouter();

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await createReport(data);
      router.push('/dashboard/user');
    } catch (err) {
      alert('Failed to create report');
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
        <option value="VIOLENCE">Violence</option>
        <option value="CORRUPTION">Corruption</option>
      </select>

      <textarea
        {...register('description')}
        placeholder="Describe the incident"
        className="w-full border p-3 rounded"
      />

      <input
        {...register('location')}
        placeholder="Location"
        className="w-full border p-3 rounded"
      />

      <button className="bg-primary text-white px-4 py-2 rounded">
        Submit Report
      </button>
    </form>
  );
}