import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Download,
  Palette,
  Eye,
  Sliders,
  Layers,
  ArrowRight,
  BarChart3,
  Globe2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Features & Specifications — QR Studio",
  description:
    "Explore the technical architecture, customization engine, vector export capabilities, and upcoming dynamic QR roadmap for QR Studio.",
};

export default function FeaturesPage() {
  const currentFeatures = [
    {
      title: "Six Core Static Payload Types",
      description: "ISO/IEC 18004 compliant encoders for Website URLs, Wi-Fi networks (WPA/WEP), Plain Text, Mailto Email, Phone calls, and SMS.",
      icon: Layers,
    },
    {
      title: "100% Client-Side Privacy",
      description: "Static generation executes entirely within the browser sandbox. Sensitive data like Wi-Fi passwords never leaves your local machine.",
      icon: ShieldCheck,
    },
    {
      title: "Lossless Vector SVG & High-Res PNG",
      description: "Export mathematically scalable vector SVG files for billboard printing or razor-sharp raster PNGs up to 2048x2048px.",
      icon: Download,
    },
    {
      title: "Advanced Shape & Eye Customization",
      description: "Choose from 6 dot patterns, 3 corner frame styles, and customize inner eye and outer frame colors independently.",
      icon: Palette,
    },
    {
      title: "WCAG Color Contrast Guidance",
      description: "Real-time luminance calculation alerts you when foreground-to-background contrast falls below 3:1, preventing unreadable prints.",
      icon: Eye,
    },
    {
      title: "Brand Logo Embedding & Auto-Correction",
      description: "Upload custom logos or choose curated SVG icons. The system automatically switches to High (Level H 30%) error correction.",
      icon: Sliders,
    },
  ];

  const roadmapPhases = [
    {
      phase: "Phase 2",
      title: "Authentication & QR Dashboard",
      status: "In Development",
      items: [
        "Supabase Authentication (Email/Password & Google OAuth)",
        "Workspace-aware dashboard to save and organize QR codes",
        "Tagging, folders, and batch search",
        "Edit design templates and duplicate saved configurations",
      ],
      icon: Users,
    },
    {
      phase: "Phase 3",
      title: "Dynamic QR Codes & Scan Analytics",
      status: "Planned",
      items: [
        "Dynamic short redirect URLs (e.g. /r/abc123) with cryptographically secure slugs",
        "Change destination link anytime without re-printing physical materials",
        "Phishing and open-redirect abuse prevention filters",
        "Real-time scan metrics: total scans, unique visitors, device categories, approximate geo",
      ],
      icon: BarChart3,
    },
    {
      phase: "Phase 4 & 5",
      title: "SaaS Subscriptions & Enterprise Features",
      status: "Roadmap",
      items: [
        "Stripe customer billing & subscription tiers (Starter, Pro, Business)",
        "Custom short domains (e.g. qr.yourbrand.com)",
        "Multi-member team permissions and audit logging",
        "REST API & webhook triggers for programmatic QR generation",
      ],
      icon: Globe2,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <Badge variant="primary">Platform Architecture</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Engineered for Scannability, Precision, and Scalability
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          QR Studio bridges aesthetic design freedom with strict adherence to QR barcode scanning standards.
        </p>
      </div>

      {/* Phase 1 Live Features */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Phase 1 Live Capabilities (Available Now)
            </h2>
          </div>
          <Badge variant="success">Production Ready</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3"
              >
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roadmap Overview */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Engineering Roadmap & Future Phases
            </h2>
            <p className="text-xs text-slate-500">
              Database schemas and service architecture are prepared for seamless upgrade.
            </p>
          </div>
          <Badge variant="neutral">Upcoming</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {roadmapPhases.map((phase) => {
            const Icon = phase.icon;
            return (
              <div
                key={phase.phase}
                className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-blue-600 dark:text-blue-400">
                        {phase.phase}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {phase.title}
                      </h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                    {phase.status}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-8">
        <Link href="/generator">
          <Button size="lg" className="gap-2 shadow-sm">
            <span>Try the Static QR Generator</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
