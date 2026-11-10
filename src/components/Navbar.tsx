'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import ThemeToggle from './ThemeToggle';
import {
  Sparkles,
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
  BrainCircuit,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { user, profile, logout, switchDemoUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  // If in the live interview room, simplify navbar so the user stays 100% focused!
  const isInterviewRoom = pathname?.startsWith('/interview/') && pathname !== '/interview/setup';

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Mock Interview', href: '/interview/setup', icon: PlayCircle },
    { label: 'Analytics', href: '/analytics', icon: BarChart3 },
    { label: 'History', href: '/history', icon: History },
    { label: 'Roadmap', href: '/roadmap', icon: Map },
    { label: 'Badges', href: '/badges', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-navy-900/90 border-b border-navy-100 dark:border-navy-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-royal-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-navy-900 dark:text-white">
                    Interview<span className="text-brand-600 dark:text-brand-400">IQ</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800">
                    AI 2.0
                  </span>
                </div>
                <span className="text-[10px] text-navy-500 dark:text-navy-400 font-medium hidden sm:inline">
                  Intelligent Interview System
                </span>
              </div>
            </Link>
          </div>

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
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-950/80 text-brand-600 dark:text-brand-300 font-semibold shadow-xs'
                        : 'text-navy-600 dark:text-navy-300 hover:text-navy-900 dark:hover:text-white hover:bg-navy-50 dark:hover:bg-navy-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600 dark:text-brand-400' : 'text-navy-400'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right Action Items */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Account Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 transition-colors"
                title="Switch demo persona"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo: {user?.full_name?.split(' ')[0] || 'Guest'}</span>
                <ChevronDown className="w-3 h-3 text-amber-600" />
              </button>

              {demoDropdownOpen && (
                <div
                  onMouseLeave={() => setDemoDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-navy-800 rounded-2xl shadow-xl border border-navy-100 dark:border-navy-700 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2"
                >
                  <p className="px-3 py-1.5 font-semibold text-navy-400 uppercase tracking-wider text-[10px]">
                    Switch Demo Persona
                  </p>
                  <button
                    onClick={() => {
                      switchDemoUser('alex');
                      setDemoDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 hover:bg-navy-50 dark:hover:bg-navy-750 transition-colors ${
                      user?.email?.includes('alex') ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 font-semibold' : ''
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
                      AM
                    </div>
                    <div>
                      <div className="font-semibold text-navy-900 dark:text-white">Alex Morgan</div>
                      <div className="text-[11px] text-navy-500 dark:text-navy-400">Full Stack Developer</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser('priya');
                      setDemoDropdownOpen(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl flex items-center gap-2.5 hover:bg-navy-50 dark:hover:bg-navy-750 transition-colors ${
                      user?.email?.includes('priya') ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-600 font-semibold' : ''
                    }`}
                  >
                    <div className="w-7 h-7 rounded-full bg-violet-500 text-white flex items-center justify-center font-bold text-xs">
                      PS
                    </div>
                    <div>
                      <div className="font-semibold text-navy-900 dark:text-white">Priya Sharma</div>
                      <div className="text-[11px] text-navy-500 dark:text-navy-400">AI / ML Engineer</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-navy-100 dark:hover:bg-navy-800 transition-colors border border-navy-200/80 dark:border-navy-700"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs ring-2 ring-brand-500/20 shadow-xs">
                      {user.full_name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>
                  )}
                  <span className="hidden sm:inline-block font-semibold text-sm text-navy-800 dark:text-navy-100 pr-1">
                    {user.full_name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-navy-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-navy-800 rounded-2xl shadow-xl border border-navy-100 dark:border-navy-700 p-2 z-50 text-sm animate-in fade-in slide-in-from-top-2"
                  >
                    <div className="px-3 py-2 border-b border-navy-100 dark:border-navy-700">
                      <p className="font-semibold text-navy-900 dark:text-white truncate">{user.full_name}</p>
                      <p className="text-xs text-navy-500 dark:text-navy-400 truncate">{user.email}</p>
                      <p className="text-[11px] text-brand-600 dark:text-brand-400 mt-0.5 font-medium">
                        {profile?.target_role || 'Candidate'}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-navy-700 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors"
                      >
                        <User className="w-4 h-4 text-navy-400" />
                        <span>Profile & Settings</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-navy-700 dark:text-navy-200 hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-navy-400" />
                        <span>Student Dashboard</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-navy-100 dark:border-navy-700">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3.5 py-2 text-sm font-medium text-navy-700 dark:text-navy-200 hover:text-navy-900 dark:hover:text-white"
                >
                  Log In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-royal-600 hover:from-brand-700 hover:to-royal-700 shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger */}
            {!isInterviewRoom && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-navy-600 dark:text-navy-300 hover:bg-navy-100 dark:hover:bg-navy-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && !isInterviewRoom && (
        <div className="md:hidden px-4 pt-2 pb-4 space-y-1 bg-white dark:bg-navy-900 border-b border-navy-200 dark:border-navy-800">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-300 font-semibold'
                    : 'text-navy-600 dark:text-navy-300 hover:bg-navy-50 dark:hover:bg-navy-800'
                }`}
              >
                <Icon className="w-5 h-5 text-navy-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
