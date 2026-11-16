"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  QrCode,
  Sparkles,
  Menu,
  X,
  ArrowRight,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Settings,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/generator", label: "Generator" },
    { href: "/features", label: "Features" },
    { href: "/pricing", label: "Pricing" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  const handleSignOut = async () => {
    await signOut();
    setMobileMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <QrCode className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
              QR Studio
            </span>
            <span className="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-400 tracking-wider">
              Static & Dynamic
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <ThemeToggle />

          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{profile?.full_name?.split(" ")[0] || "Dashboard"}</span>
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  title="Profile & Workspace Settings"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                title="Sign Out"
              >
                <LogOut className="w-4 h-4 text-slate-500 hover:text-red-500" />
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="font-medium">
                  Sign In
                </Button>
              </Link>
              <Link href="/generator">
                <Button size="sm" className="gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Create QR</span>
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen ? (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-semibold"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
            {user ? (
              <>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Profile Settings</span>
                </Link>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  className="w-full justify-center gap-2 text-red-600 border-red-200 dark:border-red-900/50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-center mb-2">
                    Sign In
                  </Button>
                </Link>
                <Link href="/generator" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full gap-2 justify-center">
                    <span>Start Creating Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
