"use client";

import React, { useState } from "react";
import {
  ActiveQRType,
  URLFormData,
  TextFormData,
  WifiFormData,
  EmailFormData,
  PhoneFormData,
  SMSFormData,
  WifiEncryption,
} from "@/types/qr";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Globe,
  Wifi,
  Lock,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Info,
  ShieldCheck,
} from "lucide-react";

interface ContentFormProps {
  type: ActiveQRType;
  formData: {
    url: URLFormData;
    text: TextFormData;
    wifi: WifiFormData;
    email: EmailFormData;
    phone: PhoneFormData;
    sms: SMSFormData;
  };
  errors: Record<string, string>;
  onChange: <K extends ActiveQRType>(
    type: K,
    updater: (prev: ContentFormProps["formData"][K]) => ContentFormProps["formData"][K]
  ) => void;
}

export function ContentForm({ type, formData, errors, onChange }: ContentFormProps) {
  const [showWifiPassword, setShowWifiPassword] = useState(false);

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Payload Configuration</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
          Static Encoding
        </span>
      </div>

      {/* 1. URL FORM */}
      {type === "url" && (
        <div className="space-y-3">
          <div>
            <Label required>Target Website URL</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Globe className="w-4 h-4" />
              </div>
              <Input
                type="url"
                id="qr-url-input"
                placeholder="https://example.com/promotion"
                value={formData.url.url}
                onChange={(e) =>
                  onChange("url", (prev) => ({ ...prev, url: e.target.value }))
                }
                error={errors.url}
                className="pl-9 font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              <span>Standard URLs will automatically resolve over https://</span>
            </p>
          </div>
        </div>
      )}

      {/* 2. PLAIN TEXT FORM */}
      {type === "text" && (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label required>Text Content</Label>
              <span className="text-[11px] text-slate-500 font-mono">
                {formData.text.text.length} / 2000 chars
              </span>
            </div>
            <Textarea
              id="qr-text-input"
              rows={4}
              placeholder="Enter plain text, notes, or raw codes to encode directly into the QR code..."
              value={formData.text.text}
              onChange={(e) =>
                onChange("text", (prev) => ({ ...prev, text: e.target.value }))
              }
              error={errors.text}
              className="font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              <span>Shorter text produces cleaner, faster-scanning QR codes.</span>
            </p>
          </div>
        </div>
      )}

      {/* 3. WI-FI FORM */}
      {type === "wifi" && (
        <div className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label required>Network Name (SSID)</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Wifi className="w-4 h-4" />
                </div>
                <Input
                  id="qr-wifi-ssid"
                  placeholder="Office_Guest_WiFi"
                  value={formData.wifi.ssid}
                  onChange={(e) =>
                    onChange("wifi", (prev) => ({ ...prev, ssid: e.target.value }))
                  }
                  error={errors.ssid}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <Label required>Security Type</Label>
              <select
                id="qr-wifi-encryption"
                value={formData.wifi.encryption}
                onChange={(e) =>
                  onChange("wifi", (prev) => ({
                    ...prev,
                    encryption: e.target.value as WifiEncryption,
                  }))
                }
                className="flex h-10 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
                <option value="WEP">WEP (Legacy)</option>
                <option value="nopass">None (Open Network)</option>
              </select>
            </div>
          </div>

          {formData.wifi.encryption !== "nopass" && (
            <div>
              <Label required>Network Password</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  type={showWifiPassword ? "text" : "password"}
                  id="qr-wifi-password"
                  placeholder="Min 8 characters for WPA"
                  value={formData.wifi.password || ""}
                  onChange={(e) =>
                    onChange("wifi", (prev) => ({ ...prev, password: e.target.value }))
                  }
                  error={errors.password}
                  className="pl-9 pr-10 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowWifiPassword(!showWifiPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showWifiPassword ? "Hide password" : "Show password"}
                >
                  {showWifiPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="qr-wifi-hidden"
              checked={formData.wifi.hidden}
              onChange={(e) =>
                onChange("wifi", (prev) => ({ ...prev, hidden: e.target.checked }))
              }
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
            />
            <label htmlFor="qr-wifi-hidden" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              Hidden network (SSID is not broadcasting)
            </label>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Wi-Fi passwords are encoded directly into the QR code offline. Credentials never leave your device.
            </span>
          </div>
        </div>
      )}

      {/* 4. EMAIL FORM */}
      {type === "email" && (
        <div className="space-y-3">
          <div>
            <Label required>Recipient Email</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <Input
                type="email"
                id="qr-email-recipient"
                placeholder="contact@company.com"
                value={formData.email.email}
                onChange={(e) =>
                  onChange("email", (prev) => ({ ...prev, email: e.target.value }))
                }
                error={errors.email}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label>Subject Line (Optional)</Label>
            <Input
              id="qr-email-subject"
              placeholder="Inquiry about services"
              value={formData.email.subject || ""}
              onChange={(e) =>
                onChange("email", (prev) => ({ ...prev, subject: e.target.value }))
              }
              error={errors.subject}
            />
          </div>

          <div>
            <Label>Message Body (Optional)</Label>
            <Textarea
              id="qr-email-body"
              rows={3}
              placeholder="Hi, I saw your QR code and wanted to follow up..."
              value={formData.email.body || ""}
              onChange={(e) =>
                onChange("email", (prev) => ({ ...prev, body: e.target.value }))
              }
              error={errors.body}
            />
          </div>
        </div>
      )}

      {/* 5. PHONE FORM */}
      {type === "phone" && (
        <div className="space-y-3">
          <div>
            <Label required>Phone Number</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <Input
                type="tel"
                id="qr-phone-number"
                placeholder="+1 555 123 4567"
                value={formData.phone.phone}
                onChange={(e) =>
                  onChange("phone", (prev) => ({ ...prev, phone: e.target.value }))
                }
                error={errors.phone}
                className="pl-9 font-mono text-xs"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <Info className="w-3 h-3 shrink-0" />
              <span>Include international country code (e.g., +1 for USA, +44 for UK).</span>
            </p>
          </div>
        </div>
      )}

      {/* 6. SMS FORM */}
      {type === "sms" && (
        <div className="space-y-3">
          <div>
            <Label required>Recipient Phone Number</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4 h-4" />
              </div>
              <Input
                type="tel"
                id="qr-sms-phone"
                placeholder="+1 555 123 4567"
                value={formData.sms.phone}
                onChange={(e) =>
                  onChange("sms", (prev) => ({ ...prev, phone: e.target.value }))
                }
                error={errors.phone}
                className="pl-9 font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label>Pre-filled Message (Optional)</Label>
              <span className="text-[11px] text-slate-500 font-mono">
                {(formData.sms.message || "").length} / 160 chars
              </span>
            </div>
            <Textarea
              id="qr-sms-message"
              rows={3}
              placeholder="Hi! Please send me the menu and schedule."
              value={formData.sms.message || ""}
              onChange={(e) =>
                onChange("sms", (prev) => ({ ...prev, message: e.target.value }))
              }
              error={errors.message}
            />
          </div>
        </div>
      )}
    </div>
  );
}
