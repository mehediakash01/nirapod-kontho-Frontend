'use client';

import { Button } from '@/components/ui/button';
import { Globe, Loader2, LucideIcon } from 'lucide-react';

interface OAuthButtonProps {
  provider: 'google';
  isLoading?: boolean;
  onClick?: () => void;
}

export default function OAuthButton({ provider, isLoading = false, onClick }: OAuthButtonProps) {
  const providerConfig: Record<string, { label: string; Icon: LucideIcon }> = {
    google: {
      label: 'Sign in with Google',
      Icon: Globe,
    },
  };

  const config = providerConfig[provider];
  const IconComponent = config.Icon;

  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full border-primary/20 bg-white/70 text-foreground hover:bg-white/80"
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <IconComponent className="mr-2 h-4 w-4" />
      )}
      {config.label}
    </Button>
  );
}
