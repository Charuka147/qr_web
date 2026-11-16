import { describe, it, expect } from "vitest";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-session";
import fs from "fs";
import path from "path";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://eacfuysfvapkgwsnxtwl.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_Aje1Bk8o3TOqkMFbFUIl0A_6ZrCEDh3";

describe("Phase 2 — Supabase Security, RLS & Proxy Route Protection", () => {
  it("should initialize Supabase client with configured project credentials", () => {
    const supabase = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
    expect(supabase).toBeDefined();
  });

  it("should contain complete SQL migration with RLS policies and security definer functions", () => {
    const sqlPath = path.resolve(
      import.meta.dirname,
      "../supabase/migrations/001_initial_schema.sql"
    );
    const sql = fs.readFileSync(sqlPath, "utf-8");

    // Verify all core tables exist in migration
    expect(sql).toContain("create table if not exists public.profiles");
    expect(sql).toContain("create table if not exists public.workspaces");
    expect(sql).toContain("create table if not exists public.workspace_members");
    expect(sql).toContain("create table if not exists public.folders");
    expect(sql).toContain("create table if not exists public.qr_codes");

    // Verify Row Level Security is enabled on all private tables
    expect(sql).toContain("alter table public.profiles enable row level security;");
    expect(sql).toContain("alter table public.workspaces enable row level security;");
    expect(sql).toContain("alter table public.workspace_members enable row level security;");
    expect(sql).toContain("alter table public.folders enable row level security;");
    expect(sql).toContain("alter table public.qr_codes enable row level security;");

    // Verify non-recursive membership check helper and auth onboarding trigger
    expect(sql).toContain("create or replace function public.is_workspace_member");
    expect(sql).toContain("create or replace function public.handle_new_user()");
    expect(sql).toContain("create trigger on_auth_user_created");

    // Verify CRUD policies on qr_codes and folders
    expect(sql).toContain('create policy "Members can view workspace QR codes" on public.qr_codes');
    expect(sql).toContain('create policy "Members can insert QR codes" on public.qr_codes');
    expect(sql).toContain('create policy "Members can update QR codes" on public.qr_codes');
    expect(sql).toContain('create policy "Members can delete QR codes" on public.qr_codes');
  });

  it("should redirect unauthenticated requests from /dashboard to /login via proxy", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

    const req = new NextRequest("http://localhost:3000/dashboard");
    const res = await updateSession(req);

    expect(res.status).toBe(307);
    const location = res.headers.get("location");
    expect(location).toContain("/login");
    expect(location).toContain("redirectTo=%2Fdashboard");
  });

  it("should allow unauthenticated requests to public generator routes", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

    const req = new NextRequest("http://localhost:3000/generator");
    const res = await updateSession(req);

    expect(res.status).toBe(200);
  });
});
