"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { SavedQRCode, ActiveQRType } from "@/types/qr";
import {
  buildDuplicateQRRecord,
  filterSavedQRCodes,
  folderInputSchema,
} from "@/features/qr/qr-service";
import { QRCodeCard } from "@/components/dashboard/QRCodeCard";
import { DatabaseSetupNotice } from "@/components/dashboard/DatabaseSetupNotice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  FolderPlus,
  Folder as FolderIcon,
  QrCode,
  Layers,
  Trash2,
  Settings,
  Sparkles,
} from "lucide-react";

const FOLDER_COLORS = [
  "#2563EB",
  "#059669",
  "#7C3AED",
  "#EA580C",
  "#DC2626",
  "#0891B2",
];

export default function DashboardPage() {
  const {
    user,
    activeWorkspace,
    folders,
    isLoading: authLoading,
    dbReady,
    refreshWorkspaceData,
  } = useAuth();

  const [qrCodes, setQrCodes] = useState<SavedQRCode[]>([]);
  const [isLoadingQRs, setIsLoadingQRs] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<ActiveQRType | "all">("all");
  const [selectedFolder, setSelectedFolder] = useState<
    string | "all" | "unfiled"
  >("all");

  // New folder state
  const [showNewFolderForm, setShowNewFolderForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0]);
  const [folderError, setFolderError] = useState<string | null>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const fetchQRCodes = useCallback(async () => {
    if (!activeWorkspace) {
      setQrCodes([]);
      setIsLoadingQRs(false);
      return;
    }

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("workspace_id", activeWorkspace.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setQrCodes(data as SavedQRCode[]);
      }
    } finally {
      setIsLoadingQRs(false);
    }
  }, [activeWorkspace]);

  useEffect(() => {
    if (authLoading) return;
    let active = true;

    async function load() {
      if (!activeWorkspace) {
        if (active) {
          setQrCodes([]);
          setIsLoadingQRs(false);
        }
        return;
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("workspace_id", activeWorkspace.id)
        .order("created_at", { ascending: false });

      if (active) {
        if (!error && data) {
          setQrCodes(data as SavedQRCode[]);
        }
        setIsLoadingQRs(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [authLoading, activeWorkspace]);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace) return;
    setFolderError(null);

    const parsed = folderInputSchema.safeParse({
      workspaceId: activeWorkspace.id,
      name: newFolderName,
      color: newFolderColor,
    });

    if (!parsed.success) {
      setFolderError(parsed.error.issues[0]?.message || "Invalid folder name");
      return;
    }

    setIsCreatingFolder(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("folders").insert({
        workspace_id: parsed.data.workspaceId,
        name: parsed.data.name,
        color: parsed.data.color,
      });

      if (error) {
        setFolderError(error.message);
        return;
      }

      setNewFolderName("");
      setShowNewFolderForm(false);
      await refreshWorkspaceData();
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!activeWorkspace) return;
    const supabase = createClient();
    await supabase
      .from("folders")
      .delete()
      .eq("id", folderId)
      .eq("workspace_id", activeWorkspace.id);

    if (selectedFolder === folderId) {
      setSelectedFolder("all");
    }
    await refreshWorkspaceData();
    await fetchQRCodes();
  };

  const handleDuplicateQR = async (qr: SavedQRCode) => {
    if (!activeWorkspace) return;
    const duplicatePayload = buildDuplicateQRRecord(qr);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("qr_codes")
      .insert(duplicatePayload)
      .select("*")
      .single();

    if (!error && data) {
      setQrCodes((prev) => [data as SavedQRCode, ...prev]);
    }
  };

  const handleDeleteQR = async (id: string) => {
    if (!activeWorkspace) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("qr_codes")
      .delete()
      .eq("id", id)
      .eq("workspace_id", activeWorkspace.id);

    if (!error) {
      setQrCodes((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const filteredCodes = filterSavedQRCodes(qrCodes, {
    search: searchQuery,
    type: selectedType,
    folderId: selectedFolder,
  });

  const folderMap = new Map(folders.map((f) => [f.id, f]));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Top Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="text-[10px] uppercase font-mono">
              Workspace
            </Badge>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {activeWorkspace?.name || user?.email || "My Workspace"}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            QR Code Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/dashboard/settings">
            <Button variant="outline" size="md" className="gap-1.5 text-xs">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Button>
          </Link>
          <Link href="/generator">
            <Button variant="primary" size="md" className="gap-1.5 shadow-sm">
              <Plus className="w-4 h-4" />
              <span>Create New QR</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Database Migration Alert if needed */}
      {!dbReady && <DatabaseSetupNotice />}

      {/* Overview Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Total Saved QR Codes
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {qrCodes.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Organized Folders
            </span>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
              {folders.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <FolderIcon className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-medium text-slate-500">
              Active Plan Tier
            </span>
            <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Free Static</span>
              <Badge variant="success" className="text-[10px]">
                Active
              </Badge>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Sidebar Folders + QR Code List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Folders */}
        <div className="lg:col-span-3 space-y-4">
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Folders
              </span>
              <button
                type="button"
                onClick={() => setShowNewFolderForm(!showNewFolderForm)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>

            {showNewFolderForm && (
              <form
                onSubmit={handleCreateFolder}
                className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5"
              >
                <Input
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  error={folderError || undefined}
                  className="h-8 text-xs"
                />
                <div className="flex items-center gap-1.5">
                  {FOLDER_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewFolderColor(c)}
                      className={`w-5 h-5 rounded-full border transition-transform ${
                        newFolderColor === c
                          ? "scale-110 ring-2 ring-offset-1 ring-blue-500"
                          : "opacity-70"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
                <div className="flex gap-1.5 pt-1">
                  <Button
                    type="submit"
                    size="sm"
                    isLoading={isCreatingFolder}
                    className="flex-1 h-7 text-xs"
                  >
                    Create
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewFolderForm(false)}
                    className="h-7 text-xs px-2"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedFolder("all")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  selectedFolder === "all"
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <span>All QR Codes</span>
                <span className="font-mono text-[11px] opacity-75">
                  {qrCodes.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedFolder("unfiled")}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  selectedFolder === "unfiled"
                    ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <span>Unfiled</span>
                <span className="font-mono text-[11px] opacity-75">
                  {qrCodes.filter((q) => !q.folder_id).length}
                </span>
              </button>

              {folders.map((folder) => {
                const count = qrCodes.filter(
                  (q) => q.folder_id === folder.id
                ).length;
                const isSelected = selectedFolder === folder.id;
                return (
                  <div
                    key={folder.id}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedFolder(folder.id)}
                      className="flex items-center gap-2 flex-1 text-left truncate"
                    >
                      <FolderIcon
                        className="w-3.5 h-3.5 shrink-0"
                        style={{ color: folder.color }}
                      />
                      <span className="truncate">{folder.name}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-[11px] opacity-75">
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteFolder(folder.id)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5 transition-opacity"
                        title="Delete folder"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: Search, Filters & QR Grid */}
        <div className="lg:col-span-9 space-y-5">
          {/* Search & Type Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <Input
                placeholder="Search saved QR codes by name, URL, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs h-10"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(e.target.value as ActiveQRType | "all")
              }
              aria-label="Filter by QR type"
              className="h-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 px-3 text-xs font-medium text-slate-700 dark:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="url">Website URL</option>
              <option value="wifi">Wi-Fi</option>
              <option value="text">Plain Text</option>
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="sms">SMS</option>
            </select>
          </div>

          {/* Grid or Empty State */}
          {isLoadingQRs ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="h-48 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 animate-pulse p-5"
                />
              ))}
            </div>
          ) : filteredCodes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCodes.map((qr) => (
                <QRCodeCard
                  key={qr.id}
                  qr={qr}
                  folder={
                    qr.folder_id ? folderMap.get(qr.folder_id) : undefined
                  }
                  onDuplicate={handleDuplicateQR}
                  onDelete={handleDeleteQR}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/40 dark:bg-slate-900/20 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {qrCodes.length === 0
                    ? "No saved QR codes yet"
                    : "No matching QR codes found"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {qrCodes.length === 0
                    ? "Create your first customized static QR code in the studio and save it to your workspace for instant access and re-editing."
                    : "Try clearing your search query or switching folder filters."}
                </p>
              </div>
              {qrCodes.length === 0 && (
                <div className="pt-2">
                  <Link href="/generator">
                    <Button variant="primary" size="md" className="gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Create & Save Your First QR</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
