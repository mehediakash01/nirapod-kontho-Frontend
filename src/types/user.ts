export type Role =
  | 'SUPER_ADMIN'
  | 'NGO_ADMIN'
  | 'ADMIN'
  | 'MODERATOR'
  | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role?: Role;
  image?: string;
}