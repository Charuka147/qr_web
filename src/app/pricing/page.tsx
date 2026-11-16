"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight, Clock, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function PricingPage() {
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail || !waitlistEmail.includes("@")) return;
    setWaitlistSubmitted(true);
  };

  const plans = [
    {
      name: "Free Static",
      price: "$0",
      cadence: "forever",
      description: "Complete client-side static generator for individuals, freelancers, and small businesses.",
      status: "Available Now",
      isLive: true,
      features: [
        "Unlimited static QR code generation",
        "All 6 standard payloads (URL, Wi-Fi, Text, Email, Phone, SMS)",
        "Full design customization (dot shapes, frames, eye colors)",
        "Custom logo upload & preset icons",
        "Vector SVG & high-res PNG export (up to 2048px)",
        "WCAG 2.2 color contrast analyzer",
        "Zero watermarks or expiration dates",
        "100% private client-side processing",
      ],
      ctaText: "Start Generating Free",
      ctaHref: "/generator",
      popular: false,
    },
    {
      name: "Starter",
      price: "$5",
      cadence: "/ month",
      description: "For creators and growing businesses who need editable destinations and basic scan metrics.",
      status: "Coming Soon (Phase 4)",
      isLive: false,
      features: [
        "Everything in Free Static",
        "5 Dynamic QR codes with editable redirect URLs",
        "Basic scan count analytics",
        "Saved QR library & folder organization",
        "Standard redirect speed guarantee",
      ],
      ctaText: "Join Waitlist",
      popular: false,
    },
    {
      name: "Pro",
      price: "$12",
      cadence: "/ month",
      description: "For digital agencies, event organizers, and marketing campaigns requiring deep analytics.",
      status: "Coming Soon (Phase 4)",
      isLive: false,
      features: [
        "Everything in Starter",
        "50 Dynamic QR codes",
        "Advanced scan analytics (device, OS, approximate geography)",
        "Daily & monthly trend graphs",
        "Bulk QR code export",
        "Custom slug URLs (e.g. /r/summer-sale)",
      ],
      ctaText: "Join Waitlist",
      popular: true,
    },
    {
      name: "Business",
      price: "$29",
      cadence: "/ month",
      description: "For teams, franchises, and enterprise workflows requiring custom domains and API access.",
      status: "Coming Soon (Phase 4)",
      isLive: false,
      features: [
        "Everything in Pro",
        "Unlimited Dynamic QR codes",
        "Custom branded short domain (e.g. qr.yourbrand.com)",
        "Multi-member workspace team seats",
        "Developer REST API & webhook triggers",
        "Priority enterprise support",
      ],
      ctaText: "Join Waitlist",
      popular: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Badge variant="primary">Transparent Roadmap</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Simple, Predictable Plans
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          The Static QR Generator is 100% free without limitations. Dynamic QR management and scan tracking plans are currently in active development.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`p-6 rounded-3xl border flex flex-col justify-between transition-all ${
              plan.popular
                ? "border-blue-500 dark:border-blue-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-blue-500/20 relative"
                : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-semibold text-[11px] px-3 py-0.5 rounded-full shadow-xs">
                Most Anticipated
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      plan.isLive
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {plan.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1 py-2 border-y border-slate-100 dark:border-slate-800">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {plan.price}
                </span>
                <span className="text-xs text-slate-500">{plan.cadence}</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                {plan.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              {plan.isLive ? (
                <Link href={plan.ctaHref || "/generator"}>
                  <Button variant="primary" size="md" className="w-full justify-center gap-1.5 shadow-xs font-semibold">
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <a href="#waitlist-section">
                  <Button variant="outline" size="md" className="w-full justify-center gap-1.5 text-xs">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{plan.ctaText}</span>
                  </Button>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Waitlist Section */}
      <div
        id="waitlist-section"
        className="max-w-3xl mx-auto p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/40 text-center space-y-4"
      >
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Early Access Notification</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Get Notified When Dynamic QR Codes & Analytics Launch
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          We are rolling out user authentication and dynamic redirect tracking in Phase 2 and Phase 3. Leave your email to receive early access.
        </p>

        {waitlistSubmitted ? (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Thank you! We will notify you as soon as Phase 2 goes live.</span>
          </div>
        ) : (
          <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <Input
                type="email"
                placeholder="developer@company.com"
                value={waitlistEmail}
                onChange={(e) => setWaitlistEmail(e.target.value)}
                required
                className="pl-9 text-xs"
              />
            </div>
            <Button type="submit" size="md" className="gap-1.5 font-medium shrink-0">
              <span>Notify Me</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
