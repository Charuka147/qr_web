"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { SavedQRCode } from "@/types/qr";
import { QRGenerator } from "@/components/generator/QRGenerator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";

function EditQRCodeContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { activeWorkspace, isLoading: authLoading } = useAuth();

  const [qrCode, setQrCode] = useState<SavedQRCode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQR() {
      if (authLoading) return;
      if (!activeWorkspace || !params.id) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("qr_codes")
          .select("*")
          .eq("id", params.id)
          .eq("workspace_id", activeWorkspace.id)
          .maybeSingle();

        if (fetchError || !data) {
          setError(
            "QR code not found or you do not have permission to edit it."
          );
        } else {
          setQrCode(data as SavedQRCode);
        }
      } catch {
        setError("Failed to load QR code configuration.");
      } finally {
        setIsLoading(false);
      }
    }

    loadQR();
  }, [authLoading, activeWorkspace, params.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {qrCode ? `Edit: ${qrCode.name}` : "Edit Saved QR Code"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Modify payload fields, adjust colors or logo, and save changes back to your workspace.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-sm text-slate-500">
          Loading saved QR configuration...
        </div>
      ) : error || !qrCode ? (
        <div className="p-8 rounded-2xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/30 text-center space-y-4 max-w-lg mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
          <p className="text-sm font-medium text-red-800 dark:text-red-200">
            {error || "QR code not found"}
          </p>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      ) : (
        <QRGenerator
          existingQR={qrCode}
          onSaved={(updated) => setQrCode(updated)}
        />
      )}
    </div>
  );
}

export default function EditQRCodePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-sm text-slate-500">
          Loading editor...
        </div>
      }
    >
      <EditQRCodeContent />
    </Suspense>
  );
}

