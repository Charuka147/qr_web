import React from "react";
import { Badge } from "@/components/ui/badge";

export function ComparisonTable() {
  const comparisonItems = [
    {
      feature: "Permanent Direct Encoding",
      staticVal: "Yes (Permanent in QR matrix)",
      dynamicVal: "Encoded via short redirect slug",
    },
    {
      feature: "Never Expires / Zero Downtime",
      staticVal: "Guaranteed (Works forever)",
      dynamicVal: "Requires active host service",
    },
    {
      feature: "100% Privacy & Offline Access",
      staticVal: "Yes (Client-side, no server logs)",
      dynamicVal: "Server logged for scan analytics",
    },
    {
      feature: "Vector SVG & High-Res PNG Export",
      staticVal: "Included (Up to 2048px)",
      dynamicVal: "Included",
    },
    {
      feature: "Custom Shapes, Eyes & Logo Branding",
      staticVal: "Included",
      dynamicVal: "Included",
    },
    {
      feature: "Change Target URL After Printing",
      staticVal: "No (Requires new QR code)",
      dynamicVal: "Yes (Edit anytime in Phase 3)",
      badgeDynamic: "Phase 3",
    },
    {
      feature: "Scan Analytics & Device Metrics",
      staticVal: "No (Direct scan)",
      dynamicVal: "Yes (Coming in Phase 3)",
      badgeDynamic: "Phase 3",
    },
    {
      feature: "Custom Short Domains",
      staticVal: "N/A",
      dynamicVal: "Yes (Coming in Phase 4)",
      badgeDynamic: "Phase 4",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <Badge variant="primary">Architectural Clarity</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Static vs. Dynamic QR Codes
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Understand the fundamental differences so you can pick the right architecture for your business.
          </p>
        </div>

        <div className="max-w-4xl mx-auto overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
                  <th className="py-4 px-6 font-semibold text-slate-900 dark:text-white w-1/2">
                    Capabilities
                  </th>
                  <th className="py-4 px-6 font-semibold text-blue-600 dark:text-blue-400 w-1/4">
                    Static QR (Live MVP)
                  </th>
                  <th className="py-4 px-6 font-semibold text-slate-700 dark:text-slate-300 w-1/4">
                    Dynamic QR (Roadmap)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {comparisonItems.map((item, idx) => (
                  <tr
                    key={item.feature}
                    className={idx % 2 === 0 ? "bg-transparent" : "bg-slate-50/50 dark:bg-slate-800/20"}
                  >
                    <td className="py-3.5 px-6 font-medium text-slate-800 dark:text-slate-200">
                      {item.feature}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400 font-mono text-xs">
                      {item.staticVal}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600 dark:text-slate-400 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <span>{item.dynamicVal}</span>
                        {item.badgeDynamic && (
                          <span className="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.2 rounded border border-blue-200/50 dark:border-blue-800/50">
                            {item.badgeDynamic}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
