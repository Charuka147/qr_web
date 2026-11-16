import React from "react";
import { notFound } from "next/navigation";
import { ActiveQRType } from "@/types/qr";
import { QRGenerator } from "@/components/generator/QRGenerator";
import { Sparkles, ShieldCheck } from "lucide-react";

const validTypes: ActiveQRType[] = ["url", "wifi", "text", "email", "phone", "sms"];

const typeLabels: Record<ActiveQRType, { title: string; subtitle: string }> = {
  url: {
    title: "Website URL QR Code Generator",
    subtitle: "Direct visitors to any web page, landing page, or app link with automatic protocol validation.",
  },
  wifi: {
    title: "Wi-Fi Network QR Code Generator",
    subtitle: "Allow guests to join your Wi-Fi instantly with one camera scan. Supports WPA/WPA2, WEP, and hidden SSIDs.",
  },
  text: {
    title: "Plain Text QR Code Generator",
    subtitle: "Permanently embed plain text notes, coupon codes, passwords, or serial numbers without internet connection.",
  },
  email: {
    title: "Email QR Code Generator",
    subtitle: "Trigger pre-populated mailto messages with your recipient address, subject line, and body text.",
  },
  phone: {
    title: "Phone Call QR Code Generator",
    subtitle: "Directly open phone dials for emergency hotlines, sales reps, customer service, or retail desk numbers.",
  },
  sms: {
    title: "SMS Message QR Code Generator",
    subtitle: "Send pre-composed text messages to any phone number for SMS opt-in or customer inquiries.",
  },
};

export function generateStaticParams() {
  return validTypes.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!validTypes.includes(type as ActiveQRType)) {
    return { title: "QR Code Generator | QR Studio" };
  }
  const info = typeLabels[type as ActiveQRType];
  return {
    title: `${info.title} — Free Vector & PNG | QR Studio`,
    description: info.subtitle,
  };
}

export default async function GeneratorTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  if (!validTypes.includes(type as ActiveQRType)) {
    notFound();
  }

  const currentType = type as ActiveQRType;
  const info = typeLabels[currentType];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dedicated Type Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {info.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {info.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Client-Side Generation</span>
        </div>
      </div>

      {/* Generator */}
      <QRGenerator initialType={currentType} />
    </div>
  );
}
