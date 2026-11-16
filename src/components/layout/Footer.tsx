"use client";

import React from "react";
import Link from "next/link";
import { QrCode, ShieldCheck, Sparkles } from "lucide-react";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
                <QrCode className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                QR Studio
              </span>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Modern, privacy-respecting QR code generator. Create high-resolution static QR codes client-side with full vector export.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Client-Side Static Processing</span>
            </div>
          </div>

          {/* Quick QR Types */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Supported Formats
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/generator/url" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Website URL
                </Link>
              </li>
              <li>
                <Link href="/generator/wifi" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Wi-Fi Connect
                </Link>
              </li>
              <li>
                <Link href="/generator/text" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Plain Text
                </Link>
              </li>
              <li>
                <Link href="/generator/email" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Email Mailto
                </Link>
              </li>
              <li>
                <Link href="/generator/phone" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Phone Call
                </Link>
              </li>
              <li>
                <Link href="/generator/sms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  SMS Message
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Static QR Generator
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Features & Specifications
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Pricing & Roadmap
                </Link>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                <span>Dynamic Short Links</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                  Phase 3
                </span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                <span>Scan Analytics</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                  Phase 3
                </span>
              </li>
            </ul>
          </div>

          {/* Standards & Specs */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Standards & Privacy
            </h4>
            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
              <p>
                Static QR payloads conform to ISO/IEC 18004 standards and MECARD/RFC specifications.
              </p>
              <p>
                Zero server tracking. Wi-Fi credentials and personal payloads never leave your browser for static codes.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {currentYear} QR Studio. Built with Next.js, TypeScript & Tailwind CSS.</p>
          <div className="flex items-center gap-2">
            <span>Production Grade Static QR Engine</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <Sparkles className="w-3 h-3" /> Phase 1 Live
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
