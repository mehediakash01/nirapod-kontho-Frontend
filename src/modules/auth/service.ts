import { api } from "@/src/services/api";
import type { z } from 'zod';
import { loginSchema, registerSchema } from './validation';

type LoginPayload = z.infer<typeof loginSchema>;
type RegisterPayload = z.infer<typeof registerSchema>;

export const loginUser = async (data: LoginPayload) => {
  const res = await api.post('/auth/sign-in/email', data);
  return res.data;
};

export const registerUser = async (data: RegisterPayload) => {
  const res = await api.post('/auth/sign-up/email', data);
  return res.data;
};
