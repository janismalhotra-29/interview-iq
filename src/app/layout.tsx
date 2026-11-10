import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'InterviewIQ – AI-Powered Interview Preparation & Evaluation System',
  description: 'Master technical, system design, and HR interviews with real-time AI simulations, speech-to-text answers, and rigorous 5-parameter evaluation feedback.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-navy-950 text-navy-900 dark:text-navy-50 antialiased selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
