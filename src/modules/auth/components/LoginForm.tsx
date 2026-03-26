'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../validation';

import { useRouter } from 'next/navigation';
import { loginUser } from '../service';

export default function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await loginUser(data);
      router.push('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto"
    >
      <h2 className="text-2xl font-bold text-center text-primary">
        Login
      </h2>

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
        className="w-full bg-primary text-white py-3 rounded"
      >
        Login
      </button>
    </form>
  );
}