'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const createNgoSchema = z.object({
  name: z.string().min(3, 'NGO name must be at least 3 characters'),
  email: z.string().email('Provide a valid NGO email'),
  phone: z.string().min(5, 'Phone number is too short'),
  address: z.string().min(5, 'Address is too short'),
  adminName: z.string().min(2, 'Admin name is required'),
  adminEmail: z.string().email('Provide a valid admin email'),
  adminPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

export type CreateNgoFormValues = z.infer<typeof createNgoSchema>;

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
  } = useForm<CreateNgoFormValues>({
    resolver: zodResolver(createNgoSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      adminName: '',
      adminEmail: '',
      adminPassword: '',
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating NGO...' : 'Create NGO'}
      </Button>
    </form>
  );
}
