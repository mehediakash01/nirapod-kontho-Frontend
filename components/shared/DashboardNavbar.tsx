'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from "@/src/hooks/useAuth";
import { LogOut, Menu, Moon, Sun, User as UserIcon, Settings } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type DashboardNavbarProps = {
  onMenuClick: () => void;
};

export default function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
  const { data, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const title = useMemo(() => {
    if (pathname.startsWith('/dashboard/super-admin/payments')) return 'Payment Dashboard';
    if (pathname.startsWith('/dashboard/super-admin')) return 'NGO Management';
    if (pathname.startsWith('/dashboard/moderator/reviewed')) return 'Reviewed Reports';
    if (pathname.startsWith('/dashboard/moderator/pending')) return 'Pending Verification Queue';
    if (pathname.startsWith('/dashboard/moderator')) return 'Moderator Panel';
    if (pathname.startsWith('/dashboard/ngo')) return 'NGO Cases';
    if (pathname.startsWith('/dashboard/user/reports')) return 'My Reports';
    if (pathname.startsWith('/dashboard/user/notifications')) return 'Notifications';
    if (pathname.startsWith('/dashboard/user/donations')) return 'Donations';
    if (pathname.startsWith('/dashboard/user/create')) return 'Create Report';
    if (pathname.startsWith('/dashboard/user')) return 'User Dashboard';
    return 'Dashboard';
  }, [pathname]);

  const handleThemeToggle = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch {
      // Toast is handled in AuthContext.
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:h-18 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onMenuClick}
            className="lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-foreground sm:text-lg">{title}</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">Stay on top of reports and platform activity</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
          >
            {!mounted || theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-border">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={data?.image || ''} alt={data?.name || data?.email || 'User'} />
                  <AvatarFallback className="bg-primary/10 text-primary uppercase">
                    {(data?.name || data?.email || 'U').charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{data?.name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{data?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile" className="flex items-center cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="flex items-center cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}