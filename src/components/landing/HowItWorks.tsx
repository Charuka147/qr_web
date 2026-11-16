import React from "react";
import { Layers, SlidersHorizontal, DownloadCloud } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Choose Data Payload",
      description: "Pick from URLs, Wi-Fi keys, emails, or phone numbers. Fields are validated in real-time according to ISO and MECARD standards.",
      icon: Layers,
    },
    {
      number: "02",
      title: "Customize & Check Contrast",
      description: "Select shapes, corner eye styles, brand colors, and add your logo. The engine calculates WCAG contrast to guarantee scannability.",
      icon: SlidersHorizontal,
    },
    {
      number: "03",
      title: "Export Print-Ready Assets",
      description: "Download vector SVG for infinite scaling on flyers, packaging, and billboards, or raster PNG up to 2048px for web use.",
      icon: DownloadCloud,
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Intuitive Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            From Payload to Print in Three Steps
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            No registration, no tracking watermarks, and no third-party redirect middleman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-3xl font-extrabold text-slate-200 dark:text-slate-800 font-mono">
                    {step.number}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-semibold text-base text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
