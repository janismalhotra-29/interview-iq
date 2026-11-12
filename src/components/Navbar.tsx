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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg)]/90 border-b border-[var(--rule)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-editorial text-lg tracking-tight text-[var(--text)] font-semibold">
                Interview<em className="text-[var(--accent)] not-italic font-normal italic ml-0.5">IQ</em>
              </span>
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
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs transition-all ${
                        isActive
                          ? 'bg-[var(--text)] text-[var(--bg)] font-semibold shadow-xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--active-bg)]'
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
          <div className="flex items-center gap-2.5">
            {/* Demo Account Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoDropdownOpen(!demoDropdownOpen)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[var(--text-muted)] bg-[var(--paper)] border border-[var(--rule)] hover:text-[var(--text)] transition-colors shadow-xs"
                title="Switch demo account"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                <span>{user?.full_name?.split(' ')[0] || 'User'}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {demoDropdownOpen && (
                <div
                  onMouseLeave={() => setDemoDropdownOpen(false)}
                  className="absolute right-0 mt-1.5 w-56 bg-[var(--paper)] rounded-xl shadow-xl border border-[var(--rule)] p-1.5 z-50 text-xs"
                >
                  <p className="px-2 py-1 font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                    Demo accounts
                  </p>
                  <button
                    onClick={() => {
                      switchDemoUser('alex');
                      setDemoDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 hover:bg-[var(--active-bg)] transition-colors ${
                      user?.email?.includes('alex') ? 'bg-[var(--active-bg)] text-[var(--text)] font-semibold' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-[var(--rule)] text-[var(--text)] flex items-center justify-center font-mono text-[10px]">AM</span>
                    <div>
                      <div className="font-medium">Alex Morgan</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Full Stack</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      switchDemoUser('priya');
                      setDemoDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2 hover:bg-[var(--active-bg)] transition-colors ${
                      user?.email?.includes('priya') ? 'bg-[var(--active-bg)] text-[var(--text)] font-semibold' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-[var(--rule)] text-[var(--text)] flex items-center justify-center font-mono text-[10px]">PS</span>
                    <div>
                      <div className="font-medium">Priya Sharma</div>
                      <div className="text-[10px] text-[var(--text-muted)]">AI / ML</div>
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
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-[var(--active-bg)] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-[var(--paper)] border border-[var(--rule)] text-[var(--text)] flex items-center justify-center font-mono text-[11px] font-medium shadow-xs">
                    {user.full_name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <ChevronDown className="w-3 h-3 text-[var(--text-muted)]" />
                </button>

                {profileDropdownOpen && (
                  <div
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                    className="absolute right-0 mt-1.5 w-52 bg-[var(--paper)] rounded-xl shadow-xl border border-[var(--rule)] p-1.5 z-50 text-xs"
                  >
                    <div className="px-2.5 py-2 border-b border-[var(--rule)]">
                      <p className="font-medium text-[var(--text)] truncate">{user.full_name}</p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[var(--text)] hover:bg-[var(--active-bg)] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[var(--text)] hover:bg-[var(--active-bg)] transition-colors"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                        <span>Dashboard</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-[var(--rule)]">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left"
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
                  className="px-3 py-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text)]"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-enfold text-xs py-1.5 px-3.5"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger */}
            {!isInterviewRoom && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 rounded-md text-[var(--text-muted)] hover:bg-[var(--active-bg)]"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && !isInterviewRoom && (
        <div className="md:hidden px-4 pt-2 pb-3 space-y-1 bg-[var(--paper)] border-b border-[var(--rule)]">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'bg-[var(--text)] text-[var(--bg)] font-semibold'
                    : 'text-[var(--text-muted)] hover:bg-[var(--active-bg)]'
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
