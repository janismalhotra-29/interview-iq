'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    // Re-trigger the top sweep and entrance animations whenever route changes
    setAnimKey((prev) => prev + 1);
  }, [pathname]);

  return (
    <>
      {/* Top Navigation Loader Bar (re-mounts and sweeps across top screen on route change) */}
      <div key={`loader-${animKey}`} className="top-loader-bar top-loader-active" />

      {/* Visibly Smooth Page Entrance (slides up 18px and fades in) */}
      <div key={`page-${animKey}`} className="animate-page-enter">
        {children}
      </div>
    </>
  );
}
