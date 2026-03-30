'use client';

import { useAuth } from '@/src/hooks/useAuth';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CreditCard,
  FileCheck2,
  LayoutGrid,
  ScrollText,
  Settings2,
  ShieldCheck,
  UserCog,
  Users,
  ClipboardCheck,
  History,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type SidebarProps = {
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

type MenuItem = {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
};

const menu: Record<string, MenuItem[]> = {
  USER: [
    { name: 'Dashboard', path: '/dashboard/user', icon: LayoutGrid },
    { name: 'My Reports', path: '/dashboard/user/reports', icon: ShieldCheck },
    { name: 'Notifications', path: '/dashboard/user/notifications', icon: Bell },
    { name: 'Donations', path: '/dashboard/user/donations', icon: CreditCard },
  ],
  MODERATOR: [
    { name: 'Overview', path: '/dashboard/moderator', icon: LayoutGrid },
    { name: 'Pending Reports', path: '/dashboard/moderator/pending', icon: ClipboardCheck },
    { name: 'Reviewed Reports', path: '/dashboard/moderator/reviewed', icon: History },
  ],
  NGO_ADMIN: [{ name: 'My Cases', path: '/dashboard/ngo', icon: BriefcaseBusiness }],
  SUPER_ADMIN: [
    { name: 'Dashboard', path: '/dashboard/super-admin', icon: LayoutGrid },
    { name: 'Manage NGOs', path: '/dashboard/super-admin/ngos', icon: Users },
    { name: 'Manage Users', path: '/dashboard/super-admin/users', icon: UserCog },
    { name: 'Verified Reports', path: '/dashboard/super-admin/reports', icon: FileCheck2 },
    { name: 'Audit Logs', path: '/dashboard/super-admin/audit-logs', icon: ScrollText },
    { name: 'Analytics', path: '/dashboard/super-admin/analytics', icon: BarChart3 },
    { name: 'Payment & Donations', path: '/dashboard/super-admin/payments', icon: CreditCard },
    { name: 'Platform Settings', path: '/dashboard/super-admin/settings', icon: Settings2 },
  ],
};

export default function Sidebar({
  mobileOpen,
  onMobileOpenChange,
}: SidebarProps) {
  const { data } = useAuth();
  const pathname = usePathname();

  const role = data?.role;
  const items = menu[role as keyof typeof menu] ?? [];

  const renderSidebarNav = (onNavigate?: () => void) => (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isExact = pathname === item.path;
        const hasMoreSpecificMatch = items.some(
          (candidate) =>
            candidate.path !== item.path &&
            pathname.startsWith(`${candidate.path}/`) &&
            candidate.path.length > item.path.length
        );
        const isActive = isExact || (!hasMoreSpecificMatch && pathname.startsWith(`${item.path}/`));

        return (
          <Link
            key={item.path}
            href={item.path}
            onClick={onNavigate}
            className={cn(
              'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground hover:pl-3.5'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{item.name}</span>
            {isActive ? <span className="absolute inset-y-1 left-0 w-1 rounded-full bg-primary" /> : null}
          </Link>
        );
      })}
    </nav>
  );


  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-sidebar-border bg-sidebar/95 p-4 lg:flex lg:flex-col">
        <div className="mb-8 rounded-2xl border border-sidebar-border bg-sidebar px-4 py-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-sidebar-foreground/60">
            Nirapod Kontho
          </p>
          <h2 className="mt-1 text-xl font-bold text-sidebar-primary">Dashboard</h2>
        </div>

        {renderSidebarNav()}
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-74 border-sidebar-border bg-sidebar p-0" showCloseButton>
          <SheetHeader className="border-b border-sidebar-border px-5 py-4">
            <SheetTitle className="text-left text-base text-sidebar-primary">Nirapod Dashboard</SheetTitle>
          </SheetHeader>

          <div className="p-4">
              {renderSidebarNav(() => onMobileOpenChange(false))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}