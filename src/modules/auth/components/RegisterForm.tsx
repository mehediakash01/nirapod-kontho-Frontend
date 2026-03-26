'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../validation';

import { useRouter } from 'next/navigation';
import { registerUser } from '../service';

export default function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data);
      router.push('/login');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-center text-primary">
        Register
      </h2>

      <input
        {...register('name')}
        placeholder="Name"
        className="w-full border p-3 rounded"
      />
      <p className="text-red-500 text-sm">{errors.name?.message}</p>

      <input
        {...register('email')}
        placeholder="Email"
        className="w-full border p-3 rounded"
      />
      <p className="text-red-500 text-sm">{errors.email?.message}</p>

      <input
        type="password"
        {...register('password')}
        placeholder="Password"
        className="w-full border p-3 rounded"
      />
      <p className="text-red-500 text-sm">
        {errors.password?.message}
      </p>

      <button
        type="submit"
        className="w-full bg-secondary text-white py-3 rounded"
      >
        Register
      </button>
    </form>
  );
}