'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    // Trigger smooth top indicator on page navigation
    setNavigating(true);
    const timer = setTimeout(() => {
      setNavigating(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Subtle 2px Top Indicator Line on page navigation */}
      <div
        className={`fixed top-0 left-0 right-0 h-[2px] bg-[var(--accent)] z-[9999] pointer-events-none transition-all duration-300 ease-out ${
          navigating ? 'w-full opacity-100' : 'w-0 opacity-0'
        }`}
      />
      {/* Subtle page entrance drift and fade */}
      <div key={pathname} className="animate-page-enter">
        {children}
      </div>
    </>
  );
}
