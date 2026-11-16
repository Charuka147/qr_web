import type { Metadata } from "next";
import { QRGenerator } from "@/components/generator/QRGenerator";
import { Sparkles, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "QR Code Generator — Free, Custom & Vector SVG | QR Studio",
  description:
    "Generate custom QR codes for websites, Wi-Fi networks, plain text, emails, phone numbers, and SMS. Fully customized dot shapes, eye patterns, and SVG downloads.",
};

export default function GeneratorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Studio Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Static QR Code Generator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure payload data, customize dot styles & corner eyes, upload branding logos, and export vector SVG.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Client-Side Generation</span>
        </div>
      </div>

      {/* Main Generator Canvas */}
      <QRGenerator initialType="url" />
    </div>
  );
}
