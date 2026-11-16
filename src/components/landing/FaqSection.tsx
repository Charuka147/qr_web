"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Do static QR codes ever expire?",
      a: "No. Static QR codes encode the data directly into the black and white dot pattern. As long as the target website exists or the encoded Wi-Fi/text information remains valid, the QR code will scan indefinitely without any ongoing subscription or server dependency.",
    },
    {
      q: "Can I use downloaded QR codes for commercial print and packaging?",
      a: "Yes. All QR codes generated via QR Studio are 100% royalty-free and can be printed on retail packaging, business cards, restaurant menus, stickers, and commercial advertisements.",
    },
    {
      q: "Why should I export in SVG format instead of PNG?",
      a: "SVG (Scalable Vector Graphics) is a mathematical vector format. Unlike PNG raster images which can become pixelated when enlarged, SVG files can be scaled to any size—from a business card to a billboard—without losing crisp edges.",
    },
    {
      q: "Is my Wi-Fi password safe when creating a Wi-Fi QR code?",
      a: "Yes. Static generation takes place completely in your web browser using client-side JavaScript. Your Wi-Fi network credentials are never transmitted over the internet or logged on any remote server.",
    },
    {
      q: "What does Error Correction Level mean?",
      a: "Error correction (Reed-Solomon algorithm) allows a QR code to remain readable even if parts of it are damaged, dirty, or obscured by a logo. Level L can recover ~7% of data, M recovers ~15%, Q recovers ~25%, and Level H recovers up to ~30%. We automatically suggest Level H when uploading a custom center logo.",
    },
    {
      q: "When will dynamic QR codes and scan analytics be available?",
      a: "Dynamic QR codes with short redirect links, scan metrics (device, location, time), and editable destination targets are scheduled for Phase 3 of QR Studio. The database schema and security foundation are already prepared.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Everything you need to know about static QR generation, vector formats, and scan safety.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-medium text-sm text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
