'use client';

import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';

export default function AppThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="theme-preference"
      disableTransitionOnChange
      forcedTheme={undefined}
    >
      {children}
    </ThemeProvider>
  );
}
