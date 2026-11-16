import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-transparent to-slate-100/60 dark:to-slate-900/40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-blue-500/10 via-white to-indigo-500/10 dark:from-blue-950/40 dark:via-slate-900 dark:to-indigo-950/40 shadow-sm text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant & Unlimited</span>
          </div>

          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Ready to generate clean, high-precision QR codes?
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              No account creation required. Configure colors, test contrast, add your brand logo, and download print-ready SVG files immediately.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/generator">
              <Button size="lg" className="gap-2 shadow-md px-8 text-sm">
                <span>Start Generating Free</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Zero Tracking
            </span>
            <span>•</span>
            <span>Vector SVG Exports</span>
            <span>•</span>
            <span>Permanent Lifespan</span>
          </div>
        </div>
      </div>
    </section>
  );
}
