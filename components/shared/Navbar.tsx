'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Menu, X, LogOut, LayoutDashboard, Moon, Sun, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/src/providers/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Ensure component is mounted before rendering theme-dependent content
  useEffect(() => {
    setMounted(true);
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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-2xl border-b border-primary/10 shadow-[0_2px_16px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.24)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20 py-2 sm:py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-linear-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <span className="text-white font-bold text-lg">NK</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground hidden sm:inline group-hover:text-primary transition-colors">
              Nirapod Kontho
            </span>
            <span className="text-lg sm:text-xl font-bold text-foreground sm:hidden">
              NK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-tertiary group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-tertiary group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-secondary to-tertiary group-hover:w-full transition-all duration-300" />
            </Link>
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex gap-3 items-center">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleThemeChange}
              className="rounded-lg"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'light' ? (
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
                  className="flex items-center gap-2 rounded-lg"
                >
                  <div className="w-6 h-6 bg-linear-to-br from-secondary to-tertiary rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium">{user.name?.split(' ')[0]}</span>
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>

                {isUserOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-background border border-primary/10 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
                  className="text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-2 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/report"
                  className="px-5 py-2 text-sm font-medium text-white bg-linear-to-r from-secondary to-tertiary rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  Report Now
                </Link>
              </>
            ) : null}
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex md:hidden gap-2 items-center">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleThemeChange}
              className="rounded-lg"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-primary/10 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-4 mt-4">
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="#contact"
                className="text-sm font-medium text-muted-foreground hover:text-foreground px-4 py-2 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col gap-3 pt-2 border-t border-primary/10">
                {!isLoading && user ? (
                  <>
                    <div className="px-4 py-2 border-b border-primary/10">
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
                  href="/report"
                  className="bg-linear-to-r from-secondary to-tertiary text-white px-4 py-2.5 rounded-lg font-medium transition-all text-center text-sm"
                  onClick={() => setIsOpen(false)}
                >
                  Report Now
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}