"use client";

import React, { useState } from "react";
import { Database, Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DatabaseSetupNotice() {
  const [copied, setCopied] = useState(false);

  const handleCopyPath = () => {
    navigator.clipboard.writeText("supabase/migrations/001_initial_schema.sql");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 rounded-2xl border border-amber-300 dark:border-amber-800/80 bg-amber-50/70 dark:bg-amber-950/30 space-y-4">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
          <Database className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
            Database Migration Required in Supabase SQL Editor
          </h3>
          <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
            Your Supabase authentication is connected, but the Phase 2 tables (
            <code className="font-mono font-semibold">profiles</code>,{" "}
            <code className="font-mono font-semibold">workspaces</code>,{" "}
            <code className="font-mono font-semibold">qr_codes</code>,{" "}
            <code className="font-mono font-semibold">folders</code>) have not been executed on your remote Supabase database yet.
          </p>
        </div>
      </div>

      <div className="pl-11 space-y-2 text-xs text-amber-900 dark:text-amber-200">
        <ol className="list-decimal list-inside space-y-1">
          <li>Open your Supabase Project Dashboard → <strong>SQL Editor</strong>.</li>
          <li>
            Copy the contents of{" "}
            <code className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 font-mono">
              supabase/migrations/001_initial_schema.sql
            </code>{" "}
            and click <strong>Run</strong>.
          </li>
          <li>Refresh this page to activate your cloud workspace.</li>
        </ol>

        <div className="pt-2 flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopyPath}
            className="gap-1.5 text-xs bg-white dark:bg-slate-900"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Path" : "Copy Migration File Path"}</span>
          </Button>
          <a
            href="https://supabase.com/dashboard/project/eacfuysfvapkgwsnxtwl/sql/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button type="button" variant="primary" size="sm" className="gap-1.5 text-xs">
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}

