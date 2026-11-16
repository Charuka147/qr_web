"use client";

import React from "react";
import {
  Globe,
  Wifi,
  FileText,
  Mail,
  Phone,
  MessageSquare,
  Contact,
  Calendar,
  MapPin,
} from "lucide-react";
import { ActiveQRType } from "@/types/qr";

interface TypeSelectorProps {
  activeType: ActiveQRType;
  onChange: (type: ActiveQRType) => void;
}

const ACTIVE_TYPES: {
  id: ActiveQRType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}[] = [
  { id: "url", label: "Website URL", icon: Globe, description: "Link to any web page" },
  { id: "wifi", label: "Wi-Fi", icon: Wifi, description: "Quick network join" },
  { id: "text", label: "Plain Text", icon: FileText, description: "Formatted text note" },
  { id: "email", label: "Email", icon: Mail, description: "Pre-filled mailto" },
  { id: "phone", label: "Phone", icon: Phone, description: "Instant click-to-call" },
  { id: "sms", label: "SMS", icon: MessageSquare, description: "Pre-typed text message" },
];

const UPCOMING_TYPES = [
  { id: "vcard", label: "vCard Contact", icon: Contact },
  { id: "event", label: "Event", icon: Calendar },
  { id: "geo", label: "Location", icon: MapPin },
];

export function TypeSelector({ activeType, onChange }: TypeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          Select QR Code Type
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          6 Static Formats Ready
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {ACTIVE_TYPES.map((item) => {
          const Icon = item.icon;
          const isSelected = activeType === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={`flex items-start gap-2.5 p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20 shadow-xs"
                  : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 transition-colors ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div
                  className={`text-xs font-semibold truncate ${
                    isSelected
                      ? "text-blue-900 dark:text-blue-200"
                      : "text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {item.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {item.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Architecture prepared: Upcoming types pills */}
      <div className="pt-1 flex items-center gap-2 flex-wrap text-[11px] text-slate-500 dark:text-slate-400">
        <span className="font-medium text-slate-400">Upcoming:</span>
        {UPCOMING_TYPES.map((u) => {
          const Icon = u.icon;
          return (
            <span
              key={u.id}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50"
              title="Coming in future release"
            >
              <Icon className="w-3 h-3 text-slate-400" />
              <span>{u.label}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold ml-0.5">
                Soon
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
