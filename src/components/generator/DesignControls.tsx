/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useRef, useState } from "react";
import { QRDesignConfig } from "@/types/qr";
import {
  COLOR_PRESETS,
  DOT_OPTIONS,
  CORNER_SQUARE_OPTIONS,
  CORNER_DOT_OPTIONS,
  ERROR_CORRECTION_OPTIONS,
  PRESET_LOGOS,
} from "@/lib/qr/constants";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Palette,
  Shapes,
  Image as ImageIcon,
  Sliders,
  RotateCcw,
  Upload,
  Trash2,
  Eye,
} from "lucide-react";

interface DesignControlsProps {
  design: QRDesignConfig;
  onChange: (updater: (prev: QRDesignConfig) => QRDesignConfig) => void;
  onReset: () => void;
}

export function DesignControls({ design, onChange, onReset }: DesignControlsProps) {
  const [activeTab, setActiveTab] = useState<"colors" | "shapes" | "logo" | "quality">("colors");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB for optimal scannability");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onChange((prev) => ({
        ...prev,
        logoUrl: result,
        // High error correction recommended for logos
        errorCorrectionLevel: "H",
      }));
    };
    reader.readAsDataURL(file);
  };

  const tabs = [
    { id: "colors", label: "Colors", icon: Palette },
    { id: "shapes", label: "Shapes", icon: Shapes },
    { id: "logo", label: "Logo", icon: ImageIcon },
    { id: "quality", label: "Quality", icon: Sliders },
  ] as const;

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-xs space-y-4">
      {/* Header and Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Design & Branding</span>
        </h3>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 gap-1 h-7 px-2"
          title="Reset to default design"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </Button>
      </div>

      {/* Tabs navigation */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. COLORS TAB */}
      {activeTab === "colors" && (
        <div className="space-y-4">
          {/* Quick presets */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">
              Color Palettes
            </label>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      dotsColor: preset.fg,
                      backgroundColor: preset.bg,
                      cornersSquareColor: preset.fg,
                      cornersDotColor: preset.fg,
                    }))
                  }
                  className="flex items-center gap-1.5 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900 text-left transition-transform active:scale-95"
                >
                  <div
                    className="w-4 h-4 rounded-full border border-slate-200 shrink-0"
                    style={{ backgroundColor: preset.fg }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-slate-200 shrink-0 -ml-2"
                    style={{ backgroundColor: preset.bg }}
                  />
                  <span className="text-[11px] truncate text-slate-700 dark:text-slate-300 font-medium">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Foreground & Background */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                Dots Color (Foreground)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="dots-color-picker"
                  value={design.dotsColor}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      dotsColor: e.target.value,
                      cornersSquareColor: prev.customEyeColors ? prev.cornersSquareColor : e.target.value,
                      cornersDotColor: prev.customEyeColors ? prev.cornersDotColor : e.target.value,
                    }))
                  }
                  className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={design.dotsColor}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      dotsColor: e.target.value,
                      cornersSquareColor: prev.customEyeColors ? prev.cornersSquareColor : e.target.value,
                      cornersDotColor: prev.customEyeColors ? prev.cornersDotColor : e.target.value,
                    }))
                  }
                  className="w-full h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-1.5">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                Background Color
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="bg-color-picker"
                  value={design.backgroundColor === "transparent" ? "#ffffff" : design.backgroundColor}
                  onChange={(e) =>
                    onChange((prev) => ({ ...prev, backgroundColor: e.target.value }))
                  }
                  className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={design.backgroundColor}
                  onChange={(e) =>
                    onChange((prev) => ({ ...prev, backgroundColor: e.target.value }))
                  }
                  className="w-full h-8 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs uppercase"
                />
              </div>
            </div>
          </div>

          {/* Eye Color Customization Toggle */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="custom-eyes-toggle" className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer">
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Custom Eye / Corner Colors</span>
              </label>
              <input
                type="checkbox"
                id="custom-eyes-toggle"
                checked={design.customEyeColors}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    customEyeColors: e.target.checked,
                    cornersSquareColor: e.target.checked ? prev.cornersSquareColor : prev.dotsColor,
                    cornersDotColor: e.target.checked ? prev.cornersDotColor : prev.dotsColor,
                  }))
                }
                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
              />
            </div>

            {design.customEyeColors && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    Corner Square (Outer Frame)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={design.cornersSquareColor}
                      onChange={(e) =>
                        onChange((prev) => ({ ...prev, cornersSquareColor: e.target.value }))
                      }
                      className="w-7 h-7 rounded border bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={design.cornersSquareColor}
                      onChange={(e) =>
                        onChange((prev) => ({ ...prev, cornersSquareColor: e.target.value }))
                      }
                      className="w-full h-7 px-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                    Corner Dot (Inner Eye)
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={design.cornersDotColor}
                      onChange={(e) =>
                        onChange((prev) => ({ ...prev, cornersDotColor: e.target.value }))
                      }
                      className="w-7 h-7 rounded border bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={design.cornersDotColor}
                      onChange={(e) =>
                        onChange((prev) => ({ ...prev, cornersDotColor: e.target.value }))
                      }
                      className="w-full h-7 px-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. SHAPES TAB */}
      {activeTab === "shapes" && (
        <div className="space-y-4">
          {/* Dot Style */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">
              Dot Pattern Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DOT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange((prev) => ({ ...prev, dotType: opt.id }))}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-all ${
                    design.dotType === opt.id
                      ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold shadow-2xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Square Style */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">
              Corner Square (Outer Eye)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CORNER_SQUARE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({ ...prev, cornersSquareType: opt.id }))
                  }
                  className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-all ${
                    design.cornersSquareType === opt.id
                      ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold shadow-2xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Dot Style */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">
              Corner Dot (Inner Eye)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CORNER_DOT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({ ...prev, cornersDotType: opt.id }))
                  }
                  className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-all ${
                    design.cornersDotType === opt.id
                      ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300 font-semibold shadow-2xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. LOGO TAB */}
      {activeTab === "logo" && (
        <div className="space-y-4">
          {/* Preset Logos */}
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">
              Preset Quick Logos
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_LOGOS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      logoUrl: item.dataUrl,
                      errorCorrectionLevel: "H",
                    }))
                  }
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-white dark:bg-slate-900 transition-all hover:shadow-xs group"
                >
                  <img
                    src={item.dataUrl}
                    alt={item.name}
                    className="w-6 h-6 object-contain group-hover:scale-110 transition-transform"
                  />
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">
                    {item.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Custom Logo */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-2">
              Upload Custom Image / Logo
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png, image/jpeg, image/svg+xml, image/webp"
              className="hidden"
              id="qr-logo-upload-input"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-2 flex-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PNG/SVG/JPEG</span>
              </Button>

              {design.logoUrl && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => onChange((prev) => ({ ...prev, logoUrl: null }))}
                  title="Remove logo"
                  className="px-2.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>

            {design.logoUrl && (
              <div className="mt-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={design.logoUrl}
                      alt="Selected logo"
                      className="w-7 h-7 object-contain rounded bg-white p-0.5 border"
                    />
                    <span className="text-xs font-medium text-blue-900 dark:text-blue-200">
                      Active Logo
                    </span>
                  </div>
                  <span className="text-[10px] bg-blue-600 text-white font-semibold px-2 py-0.5 rounded-full">
                    Error Corr. set to High (H)
                  </span>
                </div>

                <Slider
                  label="Logo Size"
                  value={design.logoSize}
                  min={0.15}
                  max={0.45}
                  step={0.05}
                  displayValue={`${Math.round(design.logoSize * 100)}%`}
                  onChange={(val) => onChange((prev) => ({ ...prev, logoSize: val }))}
                />

                <Slider
                  label="Logo Margin"
                  value={design.logoMargin}
                  min={0}
                  max={15}
                  step={1}
                  displayValue={`${design.logoMargin}px`}
                  onChange={(val) => onChange((prev) => ({ ...prev, logoMargin: val }))}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. QUALITY & MARGIN TAB */}
      {activeTab === "quality" && (
        <div className="space-y-4">
          {/* Error Correction Level */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Error Correction Level
              </label>
              <span className="text-[11px] text-slate-500">
                Recovery Capability
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ERROR_CORRECTION_OPTIONS.map((opt) => (
                <button
                  key={opt.level}
                  type="button"
                  onClick={() =>
                    onChange((prev) => ({ ...prev, errorCorrectionLevel: opt.level }))
                  }
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    design.errorCorrectionLevel === opt.level
                      ? "bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500/20 text-blue-900 dark:text-blue-100 shadow-2xs"
                      : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs mb-0.5">
                    <span>Level {opt.level}</span>
                    <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">
                      {opt.recovery}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 leading-tight">
                    {opt.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quiet Zone Margin */}
          <div className="pt-2">
            <Slider
              label="Quiet Zone (Margin)"
              value={design.margin}
              min={0}
              max={30}
              step={2}
              displayValue={`${design.margin}px`}
              onChange={(val) => onChange((prev) => ({ ...prev, margin: val }))}
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Standard quiet zone ensures camera lenses can distinguish the code from adjacent textures.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
