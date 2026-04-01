'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const REPORT_TYPES = [
  'HARASSMENT',
  'DOMESTIC_VIOLENCE',
  'STALKING',
  'CORRUPTION',
  'THREAT',
] as const;

const createNgoSchema = z.object({
  name: z.string().min(3, 'NGO name must be at least 3 characters'),
  email: z.string().email('Provide a valid NGO email'),
  phone: z.string().min(5, 'Phone number is too short'),
  address: z.string().min(5, 'Address is too short'),
  adminName: z.string().min(2, 'Admin name is required'),
  adminEmail: z.string().email('Provide a valid admin email'),
  adminPassword: z.string().min(6, 'Password must be at least 6 characters'),
  supportedReportTypes: z.array(z.enum(REPORT_TYPES)).optional(),
  coverageAreasCsv: z.string().optional(),
  maxActiveCases: z.coerce.number().int().min(1).max(500).optional(),
  priorityEscalationHours: z.coerce.number().int().min(1).max(168).optional(),
});

export type CreateNgoFormInput = z.input<typeof createNgoSchema>;
export type CreateNgoFormValues = z.output<typeof createNgoSchema>;

interface CreateNgoFormProps {
  onSubmit: (values: CreateNgoFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export default function CreateNgoForm({ onSubmit, isSubmitting }: CreateNgoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateNgoFormInput, unknown, CreateNgoFormValues>({
    resolver: zodResolver(createNgoSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      adminName: '',
      adminEmail: '',
      adminPassword: '',
      supportedReportTypes: [],
      coverageAreasCsv: '',
      maxActiveCases: 20,
      priorityEscalationHours: 24,
    },
  });

  const submitHandler = async (values: CreateNgoFormValues) => {
    await onSubmit(values);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="grid gap-3 rounded-lg border bg-white p-4">
      <h2 className="text-lg font-semibold text-primary">Create NGO + Admin</h2>

      <Input placeholder="NGO Name" {...register('name')} aria-invalid={Boolean(errors.name)} />
      {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}

      <Input placeholder="NGO Email" {...register('email')} aria-invalid={Boolean(errors.email)} />
      {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}

      <Input placeholder="Phone" {...register('phone')} aria-invalid={Boolean(errors.phone)} />
      {errors.phone ? <p className="text-xs text-red-600">{errors.phone.message}</p> : null}

      <Input placeholder="Address" {...register('address')} aria-invalid={Boolean(errors.address)} />
      {errors.address ? <p className="text-xs text-red-600">{errors.address.message}</p> : null}

      <Input
        placeholder="Admin Name"
        {...register('adminName')}
        aria-invalid={Boolean(errors.adminName)}
      />
      {errors.adminName ? <p className="text-xs text-red-600">{errors.adminName.message}</p> : null}

      <Input
        placeholder="Admin Email"
        {...register('adminEmail')}
        aria-invalid={Boolean(errors.adminEmail)}
      />
      {errors.adminEmail ? <p className="text-xs text-red-600">{errors.adminEmail.message}</p> : null}

      <Input
        type="password"
        placeholder="Admin Password"
        {...register('adminPassword')}
        aria-invalid={Boolean(errors.adminPassword)}
      />
      {errors.adminPassword ? (
        <p className="text-xs text-red-600">{errors.adminPassword.message}</p>
      ) : null}

      <div className="rounded-md border border-border/70 p-3">
        <p className="mb-2 text-sm font-medium text-primary">Supported Report Types</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {REPORT_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" value={type} {...register('supportedReportTypes')} />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      <Input
        placeholder="Coverage Areas (comma separated, e.g. Dhaka North, Gazipur)"
        {...register('coverageAreasCsv')}
        aria-invalid={Boolean(errors.coverageAreasCsv)}
      />
      {errors.coverageAreasCsv ? (
        <p className="text-xs text-red-600">{errors.coverageAreasCsv.message}</p>
      ) : null}

      <Input
        type="number"
        placeholder="Max Active Cases"
        {...register('maxActiveCases')}
        aria-invalid={Boolean(errors.maxActiveCases)}
      />
      {errors.maxActiveCases ? (
        <p className="text-xs text-red-600">{errors.maxActiveCases.message}</p>
      ) : null}

      <Input
        type="number"
        placeholder="Priority Escalation SLA (hours)"
        {...register('priorityEscalationHours')}
        aria-invalid={Boolean(errors.priorityEscalationHours)}
      />
      {errors.priorityEscalationHours ? (
        <p className="text-xs text-red-600">{errors.priorityEscalationHours.message}</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating NGO...' : 'Create NGO'}
      </Button>
    </form>
  );
}
