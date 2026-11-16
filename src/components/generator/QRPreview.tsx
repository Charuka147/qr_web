"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type QRCodeStyling from "qr-code-styling";
import type { Options } from "qr-code-styling";
import {
  ActiveQRType,
  QRDesignConfig,
  ExportFormat,
  ExportResolution,
  Folder,
} from "@/types/qr";
import { calculateContrastRatio } from "@/lib/qr/contrast";
import { generateQRFilename } from "@/lib/qr/filename";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Download,
  Copy,
  Check,
  AlertTriangle,
  ShieldCheck,
  Bookmark,
  FolderOpen,
  Sparkles,
} from "lucide-react";

interface QRPreviewProps {
  type: ActiveQRType;
  payload: string;
  detail: string;
  design: QRDesignConfig;
  isValid: boolean;
  isAuthenticated?: boolean;
  folders?: Folder[];
  initialName?: string;
  initialFolderId?: string | null;
  isEditingExisting?: boolean;
  isSaving?: boolean;
  saveStatus?: { type: "success" | "error"; message: string } | null;
  onSave?: (name: string, folderId: string | null) => Promise<void>;
}

export function QRPreview({
  type,
  payload,
  detail,
  design,
  isValid,
  isAuthenticated = false,
  folders = [],
  initialName = "",
  initialFolderId = null,
  isEditingExisting = false,
  isSaving = false,
  saveStatus = null,
  onSave,
}: QRPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [resolution, setResolution] = useState<ExportResolution>(1024);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  const [qrName, setQrName] = useState(initialName || "");
  const [selectedFolderId, setSelectedFolderId] = useState<string>(
    initialFolderId || ""
  );
  const [prevInitName, setPrevInitName] = useState(initialName);
  const [prevInitFolder, setPrevInitFolder] = useState(initialFolderId);

  if (initialName !== prevInitName) {
    setPrevInitName(initialName);
    setQrName(initialName);
  }
  if (initialFolderId !== prevInitFolder) {
    setPrevInitFolder(initialFolderId);
    setSelectedFolderId(initialFolderId || "");
  }

  // WCAG contrast analysis
  const contrast = calculateContrastRatio(design.dotsColor, design.backgroundColor);

  // Initialize and update QR code
  useEffect(() => {
    async function renderQRCode() {
      if (typeof window === "undefined" || !containerRef.current) return;

      const QRCodeStylingClass = (await import("qr-code-styling")).default;

      const qrOptions: Options = {
        width: 280,
        height: 280,
        type: "svg",
        data: payload || "https://qrstudio.app",
        image: design.logoUrl || undefined,
        margin: design.margin,
        qrOptions: {
          errorCorrectionLevel: design.errorCorrectionLevel,
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: design.logoSize,
          margin: design.logoMargin,
          crossOrigin: "anonymous",
        },
        dotsOptions: {
          color: design.dotsColor,
          type: design.dotType,
        },
        backgroundOptions: {
          color: design.backgroundColor,
        },
        cornersSquareOptions: {
          color: design.customEyeColors
            ? design.cornersSquareColor
            : design.dotsColor,
          type: design.cornersSquareType,
        },
        cornersDotOptions: {
          color: design.customEyeColors
            ? design.cornersDotColor
            : design.dotsColor,
          type: design.cornersDotType,
        },
      };

      if (!qrInstanceRef.current) {
        qrInstanceRef.current = new QRCodeStylingClass(qrOptions);
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
          qrInstanceRef.current.append(containerRef.current);
        }
      } else {
        qrInstanceRef.current.update(qrOptions);
      }
    }

    renderQRCode();
  }, [payload, design]);

  // Handle Download
  const handleDownload = async () => {
    if (!isValid || !payload) return;
    setDownloading(true);

    try {
      const QRCodeStylingClass = (await import("qr-code-styling")).default;
      const filename = generateQRFilename(type, detail, exportFormat);
      const nameWithoutExt = filename.replace(/\.(png|svg)$/, "");

      const exportQR = new QRCodeStylingClass({
        width: resolution,
        height: resolution,
        type: exportFormat === "svg" ? "svg" : "canvas",
        data: payload,
        image: design.logoUrl || undefined,
        margin: Math.round((design.margin / 280) * resolution),
        qrOptions: {
          errorCorrectionLevel: design.errorCorrectionLevel,
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: design.logoSize,
          margin: Math.round((design.logoMargin / 280) * resolution),
          crossOrigin: "anonymous",
        },
        dotsOptions: {
          color: design.dotsColor,
          type: design.dotType,
        },
        backgroundOptions: {
          color: design.backgroundColor,
        },
        cornersSquareOptions: {
          color: design.customEyeColors
            ? design.cornersSquareColor
            : design.dotsColor,
          type: design.cornersSquareType,
        },
        cornersDotOptions: {
          color: design.customEyeColors
            ? design.cornersDotColor
            : design.dotsColor,
          type: design.cornersDotType,
        },
      });

      await exportQR.download({
        name: nameWithoutExt,
        extension: exportFormat,
      });
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setDownloading(false);
    }
  };

  // Handle Copy to Clipboard
  const handleCopy = async () => {
    if (!isValid || !payload) return;

    try {
      const QRCodeStylingClass = (await import("qr-code-styling")).default;
      const exportQR = new QRCodeStylingClass({
        width: 1024,
        height: 1024,
        type: "canvas",
        data: payload,
        image: design.logoUrl || undefined,
        margin: Math.round((design.margin / 280) * 1024),
        qrOptions: {
          errorCorrectionLevel: design.errorCorrectionLevel,
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: design.logoSize,
          margin: Math.round((design.logoMargin / 280) * 1024),
          crossOrigin: "anonymous",
        },
        dotsOptions: {
          color: design.dotsColor,
          type: design.dotType,
        },
        backgroundOptions: {
          color: design.backgroundColor,
        },
        cornersSquareOptions: {
          color: design.customEyeColors
            ? design.cornersSquareColor
            : design.dotsColor,
          type: design.cornersSquareType,
        },
        cornersDotOptions: {
          color: design.customEyeColors
            ? design.cornersDotColor
            : design.dotsColor,
          type: design.cornersDotType,
        },
      });

      const rawData = await exportQR.getRawData("png");
      if (rawData && navigator.clipboard && window.ClipboardItem) {
        const item = new ClipboardItem({ "image/png": rawData as Blob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        setCopyFeedback("Image copied to clipboard!");
        setTimeout(() => {
          setCopied(false);
          setCopyFeedback(null);
        }, 2500);
      } else {
        setCopyFeedback("Clipboard copy not supported in this browser");
        setTimeout(() => setCopyFeedback(null), 2500);
      }
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      setCopyFeedback("Failed to copy image");
      setTimeout(() => setCopyFeedback(null), 2500);
    }
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave || !isValid) return;
    const defaultTitle =
      qrName.trim() || `${type.toUpperCase()} — ${detail.slice(0, 28) || "QR Code"}`;
    await onSave(defaultTitle, selectedFolderId || null);
  };

  return (
    <div className="sticky top-20 space-y-4">
      {/* Preview Container Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-sm backdrop-blur-xs text-center flex flex-col items-center">
        {/* Top Badges */}
        <div className="w-full flex items-center justify-between mb-4">
          <Badge variant="primary" className="uppercase font-mono text-[10px]">
            {type} Static
          </Badge>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
            <span>{payload.length} chars</span>
            <span>•</span>
            <span>EC: {design.errorCorrectionLevel}</span>
          </div>
        </div>

        {/* QR Code Canvas Frame */}
        <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white shadow-xs flex items-center justify-center min-w-[280px] min-h-[280px] relative transition-transform hover:scale-[1.01]">
          <div
            ref={containerRef}
            className="flex items-center justify-center"
            style={{ width: 280, height: 280 }}
          />

          {!isValid && (
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center text-white p-4">
              <AlertTriangle className="w-8 h-8 text-amber-400 mb-1" />
              <span className="text-xs font-semibold">Form Input Incomplete</span>
              <span className="text-[11px] text-slate-300">
                Fix highlighted fields to enable full export
              </span>
            </div>
          )}
        </div>

        {/* Contrast Warning Banner */}
        {!contrast.isReadable && (
          <div className="w-full mt-4 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-left text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="font-semibold">Low Contrast Detected ({contrast.ratio}:1)</div>
              <div className="text-[11px] leading-relaxed">{contrast.message}</div>
            </div>
          </div>
        )}

        {/* Payload Summary Pill */}
        <div className="w-full mt-4 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-left">
          <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1">
            Encoded Payload
          </div>
          <p className="text-xs font-mono text-slate-700 dark:text-slate-300 break-all line-clamp-2">
            {payload || "Empty payload"}
          </p>
        </div>
      </div>

      {/* Save to Workspace Card */}
      {onSave && (
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-3.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{isEditingExisting ? "Update Saved QR" : "Save to Workspace"}</span>
            </span>
            {isAuthenticated && (
              <Badge variant="success" className="text-[10px] py-0">
                Cloud Sync
              </Badge>
            )}
          </h4>

          {isAuthenticated ? (
            <form onSubmit={handleSaveSubmit} className="space-y-3">
              <div>
                <Label htmlFor="qr-save-name">QR Code Name</Label>
                <Input
                  id="qr-save-name"
                  placeholder={`${type.toUpperCase()} — ${detail.slice(0, 20) || "Untitled"}`}
                  value={qrName}
                  onChange={(e) => setQrName(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              {folders.length > 0 && (
                <div>
                  <Label htmlFor="qr-save-folder">Folder (Optional)</Label>
                  <div className="relative">
                    <FolderOpen className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                    <select
                      id="qr-save-folder"
                      value={selectedFolderId}
                      onChange={(e) => setSelectedFolderId(e.target.value)}
                      className="flex h-9 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      <option value="">All QR Codes (No Folder)</option>
                      {folders.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {saveStatus && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    saveStatus.type === "success"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60"
                      : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60"
                  }`}
                >
                  {saveStatus.type === "success" ? (
                    <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                  )}
                  <span>{saveStatus.message}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="secondary"
                size="md"
                disabled={!isValid || isSaving}
                isLoading={isSaving}
                className="w-full justify-center gap-2 text-xs font-semibold border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isEditingExisting ? "Save Changes" : "Save to Dashboard"}</span>
              </Button>
            </form>
          ) : (
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2.5">
              <p className="leading-relaxed">
                Sign in to save this QR configuration to your workspace, organize into folders, and re-edit anytime.
              </p>
              <Link href="/login" className="block">
                <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Sign In to Save QR</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Export Controls Card */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>Export Options</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium normal-case flex items-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>High-Res Ready</span>
          </span>
        </h4>

        {/* Format Selector */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setExportFormat("png")}
            className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
              exportFormat === "png"
                ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold"
                : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
            }`}
          >
            PNG (High-Res Raster)
          </button>
          <button
            type="button"
            onClick={() => setExportFormat("svg")}
            className={`py-2 px-3 rounded-lg border text-xs font-medium text-center transition-all ${
              exportFormat === "svg"
                ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold"
                : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300"
            }`}
          >
            SVG (Vector Print)
          </button>
        </div>

        {/* Resolution Options (For PNG) */}
        {exportFormat === "png" && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400 block">
              Output Resolution
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {([512, 1024, 2048] as ExportResolution[]).map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setResolution(res)}
                  className={`py-1.5 px-2 rounded-lg border text-xs font-mono transition-all ${
                    resolution === res
                      ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                  }`}
                >
                  {res}px
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={handleDownload}
            disabled={!isValid || downloading}
            isLoading={downloading}
            className="w-full justify-center gap-2 shadow-sm font-semibold"
          >
            <Download className="w-4 h-4" />
            <span>Download {exportFormat.toUpperCase()}</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleCopy}
            disabled={!isValid}
            className="w-full justify-center gap-2 text-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-600 font-medium">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Image to Clipboard</span>
              </>
            )}
          </Button>

          {copyFeedback && !copied && (
            <p className="text-[11px] text-center text-slate-500">{copyFeedback}</p>
          )}
        </div>
      </div>
    </div>
  );
}
