"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { profileUpdateSchema } from "@/features/qr/qr-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  User,
  Building2,
  Lock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export default function SettingsPage() {
  const { user, profile, activeWorkspace, refreshWorkspaceData } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [workspaceName, setWorkspaceName] = useState(
    activeWorkspace?.name || ""
  );
  const [prevProfileId, setPrevProfileId] = useState(profile?.id);
  const [prevWsId, setPrevWsId] = useState(activeWorkspace?.id);

  if (profile?.id !== prevProfileId) {
    setPrevProfileId(profile?.id);
    setFullName(profile?.full_name || "");
  }
  if (activeWorkspace?.id !== prevWsId) {
    setPrevWsId(activeWorkspace?.id);
    setWorkspaceName(activeWorkspace?.name || "");
  }

  const [profileStatus, setProfileStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Password update state
  const [newPassword, setNewPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProfileStatus(null);

    const parsed = profileUpdateSchema.safeParse({
      fullName,
      workspaceName: activeWorkspace ? workspaceName : undefined,
    });

    if (!parsed.success) {
      setProfileStatus({
        type: "error",
        message: parsed.error.issues[0]?.message || "Invalid input",
      });
      return;
    }

    setIsSavingProfile(true);
    try {
      const supabase = createClient();

      const { error: profErr } = await supabase
        .from("profiles")
        .update({
          full_name: parsed.data.fullName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (profErr) throw new Error(profErr.message);

      if (activeWorkspace && parsed.data.workspaceName) {
        const { error: wsErr } = await supabase
          .from("workspaces")
          .update({
            name: parsed.data.workspaceName,
            updated_at: new Date().toISOString(),
          })
          .eq("id", activeWorkspace.id)
          .eq("owner_id", user.id);

        if (wsErr) throw new Error(wsErr.message);
      }

      await refreshWorkspaceData();
      setProfileStatus({
        type: "success",
        message: "Profile and workspace settings updated.",
      });
    } catch (err) {
      setProfileStatus({
        type: "error",
        message:
          err instanceof Error ? err.message : "Failed to update settings.",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (newPassword.length < 8) {
      setPasswordStatus({
        type: "error",
        message: "New password must be at least 8 characters.",
      });
      return;
    }

    setIsSavingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setPasswordStatus({ type: "error", message: error.message });
        return;
      }

      setNewPassword("");
      setPasswordStatus({
        type: "success",
        message: "Your password has been updated.",
      });
    } catch {
      setPasswordStatus({
        type: "error",
        message: "Failed to update password.",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      <div className="space-y-1 pb-6 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Profile & Workspace Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal profile, workspace identity, and account security.
        </p>
      </div>

      {/* Profile & Workspace Card */}
      <form
        onSubmit={handleSaveProfile}
        className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Account & Workspace Identity
            </h2>
          </div>
          <Badge variant="primary" className="text-[10px] font-mono">
            Owner
          </Badge>
        </div>

        {profileStatus && (
          <div
            className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              profileStatus.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
            }`}
          >
            {profileStatus.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{profileStatus.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="settings-email">Account Email</Label>
            <Input
              id="settings-email"
              value={user?.email || ""}
              disabled
              className="bg-slate-100 dark:bg-slate-800 text-xs font-mono"
            />
          </div>

          <div>
            <Label htmlFor="settings-name" required>
              Full Name
            </Label>
            <Input
              id="settings-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <Label htmlFor="settings-workspace" required>
              Workspace Name
            </Label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              <Input
                id="settings-workspace"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="My Workspace"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="settings-slug">Workspace Slug</Label>
            <Input
              id="settings-slug"
              value={activeWorkspace?.slug || "default"}
              disabled
              className="bg-slate-100 dark:bg-slate-800 text-xs font-mono"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" isLoading={isSavingProfile}>
            Save Profile & Workspace
          </Button>
        </div>
      </form>

      {/* Security & Password Card */}
      <form
        onSubmit={handleUpdatePassword}
        className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs space-y-5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Change Password
            </h2>
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Supabase Auth RLS Protected</span>
          </span>
        </div>

        {passwordStatus && (
          <div
            className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
              passwordStatus.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
            }`}
          >
            {passwordStatus.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{passwordStatus.message}</span>
          </div>
        )}

        <div className="max-w-md">
          <Label htmlFor="settings-new-password" required>
            New Password (min. 8 characters)
          </Label>
          <Input
            id="settings-new-password"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="pt-2 flex justify-end">
          <Button type="submit" variant="outline" isLoading={isSavingPassword}>
            Update Password
          </Button>
        </div>
      </form>
    </div>
  );
}

