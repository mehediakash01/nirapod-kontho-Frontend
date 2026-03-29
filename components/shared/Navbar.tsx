'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard, Moon, Sun, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/src/providers/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/how-it-works', label: 'Workflow' },
    { href: '/safety', label: 'Safety' },
    { href: '/resources', label: 'Resources' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleThemeChange = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch {
      // Error already shown by toast in context
    }
    setIsUserOpen(false);
    setIsOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-xl border-b border-primary/15 shadow-lg'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 py-2 sm:py-3">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
            >
              <span className="text-white font-bold text-lg">NK</span>
            </motion.div>
            <span className="text-lg sm:text-xl font-bold text-foreground hidden sm:inline group-hover:text-primary transition-colors">
              Nirapod Kontho
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-10 flex-1 justify-center">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all duration-300 relative group ${
                    active
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-300 ${
                      active ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop User Section - Right */}
          <div className="hidden md:flex gap-3 items-center">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleThemeChange}
              className={`rounded-lg transition-all ${
                isScrolled ? 'hover:bg-muted/50' : 'hover:bg-white/20'
              }`}
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <Sun className="h-4 w-4" />
              ) : theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {!isLoading && user ? (
              // User Profile Dropdown
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className={`flex items-center gap-2 rounded-lg transition-all ${
                    isScrolled
                      ? 'bg-white/10 border-primary/20 hover:bg-white/20'
                      : 'bg-white/20 border-white/30 hover:bg-white/30'
                  }`}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium">{user.name?.split(' ')[0]}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>

                {isUserOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-background/95 backdrop-blur-xl border border-primary/15 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-primary/10 bg-muted/30">
                      <p className="text-sm font-semibold text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors text-left border-t border-primary/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : !isLoading ? (
              // Guest Links
              <>
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors px-3 py-2 rounded-lg`}
                >
                  Sign in
                </Link>
                <Link
                  href="/dashboard/user/create"
                  className="px-5 py-2 text-sm font-semibold text-white bg-gradient-to-r from-primary via-primary/90 to-secondary rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Report Now
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex md:hidden gap-2 items-center ml-auto">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleThemeChange}
              className={`rounded-lg transition-all ${
                isScrolled ? 'hover:bg-muted/50' : 'hover:bg-white/20'
              }`}
              aria-label="Toggle theme"
            >
              {!mounted ? (
                <Sun className="h-4 w-4" />
              ) : theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-all ${
                isScrolled
                  ? 'hover:bg-muted/50 text-foreground'
                  : 'hover:bg-white/20 text-white'
              }`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`lg:hidden pb-4 border-t ${
            isScrolled ? 'border-primary/15' : 'border-white/20'
          } animate-in fade-in slide-in-from-top-2 duration-200`}
          >
            <div className="flex flex-col gap-0 mt-4">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium px-4 py-3 transition-all border-l-4 ${
                      active
                        ? 'border-l-primary bg-primary/5 text-primary'
                        : 'border-l-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile User Section */}
            <div className="flex flex-col gap-3 pt-4 mt-4 border-t border-primary/10">
              {!isLoading && user ? (
                <>
                  <div className="px-4 py-3 border-b border-primary/10">
                    <p className="text-sm font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:text-destructive/80 transition-colors text-left"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : !isLoading ? (
                <>
                  <Link
                    href="/login"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : null}
              <Link
                href="/dashboard/user/create"
                className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2.5 rounded-lg font-semibold transition-all text-center text-sm mx-4"
                onClick={() => setIsOpen(false)}
              >
                Report Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}