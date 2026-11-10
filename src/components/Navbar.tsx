'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import ThemeToggle from './ThemeToggle';
import {
  LayoutDashboard,
  PlayCircle,
  BarChart3,
  History,
  Map,
  Award,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Terminal,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, logout, switchDemoUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const isInterviewRoom = pathname?.startsWith('/interview/') && pathname !== '/interview/setup';

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Mock Session', href: '/interview/setup', icon: PlayCircle },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'History', href: '/history', icon: History },
    { label: 'Roadmap', href: '/roadmap', icon: Map },
    { label: 'Badges', href: '/badges', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-[#090A0C]/90 border-b border-zinc-200 dark:border-[#1F2228] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-xs border border-zinc-800">
                <Terminal className="w-3.5 h-3.5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-zinc-900 dark:text-zinc-100">
                  InterviewIQ
                </span>
                <span className="text-[10px] font-mono text-zinc-500 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.2 rounded">
                  v1.2
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            {!isInterviewRoom && (
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      prefetch={true}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-zinc-100 dark:bg-[#1A1D24] text-zinc-900 dark:text-zinc-100 font-semibold border border-zinc-200 dark:border-[#262B34]'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-[#13151A]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 opacity-70" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2">
            {/* Demo Account Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-[#111215] border border-zinc-200 dark:border-[#1F2228] hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
                title="Switch demo account"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Demo: {user?.full_name?.split(' ')[0] || 'User'}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {demoDropdownOpen && (
                <div
                  onMouseLeave={() => setDemoDropdownOpen(false)}
                  className="absolute right-0 mt-1.5 w-56 bg-white dark:bg-[#111215] rounded-lg shadow-lg border border-zinc-200 dark:border-[#1F2228] p-1.5 z-50 text-xs"
                >
                  <p className="px-2 py-1 font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                    Demo accounts
                  </p>
                  <button
                    onClick={() => {
                      switchDemoUser('alex');
                      setDemoDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-[#1A1D24] transition-colors ${
                      user?.email?.includes('alex') ? 'bg-zinc-100 dark:bg-[#1A1D24] text-zinc-900 dark:text-white font-medium' : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span className="w-5 h-5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-mono text-[10px]">AM</span>
                    <div>
                      <div className="font-medium">Alex Morgan</div>
                      <div className="text-[10px] text-zinc-400">Full Stack</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser('priya');
                      setDemoDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md flex items-center gap-2 hover:bg-zinc-50 dark:hover:bg-[#1A1D24] transition-colors ${
                      user?.email?.includes('priya') ? 'bg-zinc-100 dark:bg-[#1A1D24] text-zinc-900 dark:text-white font-medium' : 'text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <span className="w-5 h-5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center font-mono text-[10px]">PS</span>
                    <div>
                      <div className="font-medium">Priya Sharma</div>
                      <div className="text-[10px] text-zinc-400">AI / ML</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-[#1A1D24] transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-[#1F2228]"
                >
                  <div className="w-6 h-6 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center font-mono text-[10px] font-medium border border-zinc-300 dark:border-zinc-700">
                    {user.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <span className="hidden sm:inline-block font-medium text-xs text-zinc-700 dark:text-zinc-300">
                    {user.full_name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-zinc-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-1.5 w-52 bg-white dark:bg-[#111215] rounded-lg shadow-lg border border-zinc-200 dark:border-[#1F2228] p-1.5 z-50 text-xs"
                  >
                    <div className="px-2.5 py-2 border-b border-zinc-100 dark:border-[#1F2228]">
                      <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate">{user.full_name}</p>
                      <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#1A1D24] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-[#1A1D24] transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Dashboard</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-zinc-100 dark:border-[#1F2228]">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/auth/login"
                  className="px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-1 rounded-md text-xs font-medium text-white bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger */}
            {!isInterviewRoom && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && !isInterviewRoom && (
        <div className="md:hidden px-4 pt-2 pb-3 space-y-1 bg-white dark:bg-[#090A0C] border-b border-zinc-200 dark:border-[#1F2228]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium ${
                  isActive
                    ? 'bg-zinc-100 dark:bg-[#1A1D24] text-zinc-900 dark:text-white font-medium'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-[#13151A]'
                }`}
              >
                <Icon className="w-4 h-4 opacity-70" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
