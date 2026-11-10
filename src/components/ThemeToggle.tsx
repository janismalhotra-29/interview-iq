'use client';

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useAuth();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-1.5 rounded-full text-[var(--text-muted)] hover:text-[var(--text)] bg-[var(--paper)] hover:bg-[var(--active-bg)] transition-colors border border-[var(--rule)] shadow-xs"
    >
      {theme === 'dark' ? (
        <Sun className="w-3.5 h-3.5 text-[var(--accent)]" />
      ) : (
        <Moon className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
