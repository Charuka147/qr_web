import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Download, Palette, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium shadow-2xs backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span>Phase 1 Live — Free Static QR Generator with Vector Export</span>
        </div>

        {/* Hero Headline */}
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            Precision QR Codes for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Modern Brands & Creators
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Generate customized, scan-tested QR codes for websites, Wi-Fi networks, contact info, and messaging. 100% private, client-side rendering with SVG vector and print-ready PNG downloads.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link href="/generator">
            <Button size="lg" className="gap-2 shadow-md px-6 text-sm">
              <span>Open QR Generator</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/features">
            <Button variant="outline" size="lg" className="text-sm">
              Explore Specifications
            </Button>
          </Link>
        </div>

        {/* Trust & Spec Highlights */}
        <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto text-left">
          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xs space-y-1">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Client-Side</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Static payloads never touch external servers or store tracking cookies.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xs space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
              <Download className="w-4 h-4" />
              <span>Vector SVG & PNG</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Lossless vector paths for billboard printing and razor-sharp screen displays.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xs space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
              <Palette className="w-4 h-4" />
              <span>Custom Styling</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Shapes, dot styles, custom corner eyes, logos, and contrast verification.
            </p>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 backdrop-blur-xs space-y-1">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-semibold text-xs">
              <Zap className="w-4 h-4" />
              <span>No Signup Required</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Generate and download completely unrestricted static codes immediately.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
