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
      className="p-2 rounded-xl text-navy-500 hover:text-navy-900 dark:text-navy-300 dark:hover:text-white bg-navy-100/60 dark:bg-navy-800/80 hover:bg-navy-200/70 dark:hover:bg-navy-700 transition-all border border-navy-200/50 dark:border-navy-700"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 animate-pulse-subtle" />
      ) : (
        <Moon className="w-4 h-4 text-violet-600" />
      )}
    </button>
  );
}
