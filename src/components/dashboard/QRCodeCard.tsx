"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import type QRCodeStyling from "qr-code-styling";
import { SavedQRCode, Folder } from "@/types/qr";
import { DEFAULT_DESIGN } from "@/lib/qr/constants";
import { generateQRFilename } from "@/lib/qr/filename";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Download,
  Copy,
  Trash2,
  Edit3,
  Folder as FolderIcon,
  Calendar,
} from "lucide-react";

interface QRCodeCardProps {
  qr: SavedQRCode;
  folder?: Folder;
  onDuplicate: (qr: SavedQRCode) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function QRCodeCard({
  qr,
  folder,
  onDuplicate,
  onDelete,
}: QRCodeCardProps) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const design = useMemo(
    () => ({ ...DEFAULT_DESIGN, ...(qr.design || {}) }),
    [qr.design]
  );
  const rawPayload = qr.payload?.rawPayload || "https://qrstudio.app";
  const detail = qr.payload?.detail || rawPayload;

  useEffect(() => {
    async function renderThumb() {
      if (typeof window === "undefined" || !thumbRef.current) return;
      const QRCodeStylingClass = (await import("qr-code-styling")).default;

      const options = {
        width: 120,
        height: 120,
        type: "svg" as const,
        data: rawPayload,
        image: design.logoUrl || undefined,
        margin: 4,
        qrOptions: {
          errorCorrectionLevel: design.errorCorrectionLevel,
        },
        imageOptions: {
          hideBackgroundDots: true,
          imageSize: design.logoSize,
          margin: 2,
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

      if (!qrRef.current) {
        qrRef.current = new QRCodeStylingClass(options);
        if (thumbRef.current) {
          thumbRef.current.innerHTML = "";
          qrRef.current.append(thumbRef.current);
        }
      } else {
        qrRef.current.update(options);
      }
    }

    renderThumb();
  }, [rawPayload, design]);

  const handleQuickDownload = async (ext: "png" | "svg") => {
    const QRCodeStylingClass = (await import("qr-code-styling")).default;
    const filename = generateQRFilename(qr.type, detail, ext).replace(
      /\.(png|svg)$/,
      ""
    );

    const exportInstance = new QRCodeStylingClass({
      width: 1024,
      height: 1024,
      type: ext === "svg" ? "svg" : "canvas",
      data: rawPayload,
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

    await exportInstance.download({
      name: filename,
      extension: ext,
    });
  };

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs flex flex-col justify-between gap-4">
      {/* Top Row: Thumbnail + Info */}
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-white shrink-0 flex items-center justify-center w-[136px] h-[136px]">
          <div ref={thumbRef} style={{ width: 120, height: 120 }} />
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="primary" className="uppercase font-mono text-[10px]">
              {qr.type}
            </Badge>
            <Badge variant="neutral" className="text-[10px] capitalize">
              {qr.mode}
            </Badge>
            {folder && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <FolderIcon
                  className="w-2.5 h-2.5"
                  style={{ color: folder.color }}
                />
                <span className="truncate max-w-[90px]">{folder.name}</span>
              </span>
            )}
          </div>

          <div>
            <h3
              className="font-bold text-sm text-slate-900 dark:text-white truncate"
              title={qr.name}
            >
              {qr.name}
            </h3>
            <p
              className="text-xs font-mono text-slate-500 dark:text-slate-400 truncate mt-0.5"
              title={detail}
            >
              {detail}
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <Calendar className="w-3 h-3" />
            <span>
              {new Date(qr.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickDownload("png")}
            className="text-xs h-8 px-2.5 gap-1"
            title="Download 1024px PNG"
          >
            <Download className="w-3 h-3" />
            <span>PNG</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleQuickDownload("svg")}
            className="text-xs h-8 px-2.5 gap-1"
            title="Download Vector SVG"
          >
            <Download className="w-3 h-3" />
            <span>SVG</span>
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Link href={`/dashboard/edit/${qr.id}`}>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 px-2.5 text-xs gap-1 text-blue-600 dark:text-blue-400"
              title="Edit QR Code"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </Button>
          </Link>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isDuplicating}
            onClick={async () => {
              setIsDuplicating(true);
              try {
                await onDuplicate(qr);
              } finally {
                setIsDuplicating(false);
              }
            }}
            className="h-8 w-8 text-slate-500 hover:text-slate-900 dark:hover:text-white"
            title="Duplicate QR Code"
          >
            <Copy className="w-3.5 h-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isDeleting}
            onClick={async () => {
              setIsDeleting(true);
              try {
                await onDelete(qr.id);
              } finally {
                setIsDeleting(false);
              }
            }}
            className="h-8 w-8 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
            title="Delete QR Code"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
