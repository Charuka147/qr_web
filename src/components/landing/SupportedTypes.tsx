import React from "react";
import Link from "next/link";
import {
  Globe,
  Wifi,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  ArrowRight,
  Contact,
  Calendar,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function SupportedTypes() {
  const activeTypes = [
    {
      id: "url",
      title: "Website URL",
      description: "Direct scans to your landing page, portfolio, menu, or web application with automatic protocol validation.",
      icon: Globe,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900",
      href: "/generator/url",
    },
    {
      id: "wifi",
      title: "Wi-Fi Network",
      description: "Instant one-tap network join for cafes, hotels, and offices. Supports WPA/WPA2/WPA3, WEP, and hidden SSIDs.",
      icon: Wifi,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900",
      href: "/generator/wifi",
    },
    {
      id: "text",
      title: "Plain Text",
      description: "Permanently encode instructions, coupon codes, notes, or raw serials without internet dependency.",
      icon: FileText,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900",
      href: "/generator/text",
    },
    {
      id: "email",
      title: "Email Mailto",
      description: "Pre-populate customer support inquiries, feedback mail, or contact addresses with subject and body.",
      icon: Mail,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900",
      href: "/generator/email",
    },
    {
      id: "phone",
      title: "Phone Call",
      description: "Open the native phone dialer instantly for hotlines, emergency services, and sales representatives.",
      icon: Phone,
      color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-900",
      href: "/generator/phone",
    },
    {
      id: "sms",
      title: "SMS Message",
      description: "Trigger pre-filled text messages for SMS opt-in campaigns, verification, or customer chat.",
      icon: MessageSquare,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900",
      href: "/generator/sms",
    },
  ];

  const upcomingTypes = [
    { title: "vCard Digital Contact", icon: Contact, release: "Phase 2" },
    { title: "Calendar Event (.ics)", icon: Calendar, release: "Phase 2" },
    { title: "Geolocation Coordinates", icon: MapPin, release: "Phase 2" },
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <Badge variant="primary">Standard-Compliant Encoders</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Built for Every Real-World Use Case
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            QR Studio rigorously formats payloads to ensure high scan compatibility across iOS Camera, Android Google Lens, and barcode readers.
          </p>
        </div>

        {/* 6 Active Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTypes.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    href={item.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:gap-2 transition-all"
                  >
                    <span>Generate {item.title}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Prepared Architecture / Upcoming Showcase */}
        <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Phase 2 Roadmap Preview
              </div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                Additional Payload Formats in Development
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {upcomingTypes.map((u) => {
                const Icon = u.icon;
                return (
                  <div
                    key={u.title}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-400"
                  >
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{u.title}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono px-1.5 py-0.2 rounded">
                      {u.release}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
