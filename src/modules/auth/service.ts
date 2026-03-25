import { api } from "@/src/services/api";


export const loginUser = async (data: any) => {
  const res = await api.post('/auth/signin', data);
  return res.data;
};

export const registerUser = async (data: any) => {
  const res = await api.post('/auth/signup', data);
  return res.data;
};