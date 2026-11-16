import React from "react";
import { Hero } from "@/components/landing/Hero";
import { SupportedTypes } from "@/components/landing/SupportedTypes";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { FaqSection } from "@/components/landing/FaqSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { QRGenerator } from "@/components/generator/QRGenerator";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Interactive Studio Section on Homepage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Live Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Create Your QR Code Right Here
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Try switching shapes, adjusting colors, or testing Wi-Fi network payloads.
          </p>
        </div>

        <div className="p-4 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md shadow-xs">
          <QRGenerator initialType="url" />
        </div>
      </section>

      {/* 3. Supported QR Types */}
      <SupportedTypes />

      {/* 4. How It Works */}
      <HowItWorks />

      {/* 5. Feature Comparison Table */}
      <ComparisonTable />

      {/* 6. FAQ Section */}
      <FaqSection />

      {/* 7. Call To Action */}
      <CtaSection />
    </div>
  );
}
