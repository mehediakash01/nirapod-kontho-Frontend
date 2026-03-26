'use client';


import { useAuth } from '@/src/hooks/useAuth';
import Link from 'next/link';

export default function Sidebar() {
  const { data } = useAuth();

  const role = data?.role;

  const menu = {
    USER: [
      { name: 'Dashboard', path: '/dashboard/user' },
      { name: 'My Reports', path: '/dashboard/user/reports' },
      { name: 'Notifications', path: '/dashboard/user/notifications' },
    ],
    MODERATOR: [
      { name: 'Pending Reports', path: '/dashboard/moderator' },
    ],
    ADMIN: [
      { name: 'My Cases', path: '/dashboard/ngo' },
    ],
    SUPER_ADMIN: [
      { name: 'Manage NGOs', path: '/dashboard/super-admin' },
    ],
  };

  return (
    <aside className="w-64 bg-sidebar p-4 border-r">
      <h2 className="text-xl font-bold mb-6 text-primary">
        Nirapod
      </h2>

      <nav className="space-y-2">
        {menu[role as keyof typeof menu]?.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="block p-2 rounded hover:bg-accent"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}