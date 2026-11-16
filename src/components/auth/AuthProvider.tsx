"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Workspace, UserProfile, Folder } from "@/types/qr";

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  activeWorkspace: Workspace | null;
  workspaces: Workspace[];
  folders: Folder[];
  isLoading: boolean;
  dbReady: boolean;
  setActiveWorkspace: (workspace: Workspace) => void;
  refreshWorkspaceData: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbReady, setDbReady] = useState(true);

  const loadUserAndWorkspace = useCallback(async (currentUser: User | null) => {
    if (!currentUser) {
      setProfile(null);
      setWorkspaces([]);
      setActiveWorkspace(null);
      setFolders([]);
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      // 1. Fetch or ensure profile exists
      const { data: existingProfile, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      // If table does not exist yet (42P01 or PGRST205), mark dbReady = false
      if (
        profileErr &&
        (profileErr.code === "42P01" ||
          profileErr.code === "PGRST205" ||
          profileErr.message?.includes("does not exist") ||
          profileErr.message?.includes("schema cache"))
      ) {
        setDbReady(false);
        setIsLoading(false);
        return;
      }

      setDbReady(true);

      let userProfile = existingProfile as UserProfile | null;
      const defaultName =
        currentUser.user_metadata?.full_name ||
        currentUser.email?.split("@")[0] ||
        "Studio User";

      if (!userProfile && currentUser.email) {
        const { data: insertedProfile } = await supabase
          .from("profiles")
          .insert({
            id: currentUser.id,
            email: currentUser.email,
            full_name: defaultName,
            avatar_url: currentUser.user_metadata?.avatar_url || null,
          })
          .select("*")
          .maybeSingle();

        userProfile = insertedProfile as UserProfile | null;
      }

      setProfile(userProfile);

      // 2. Fetch user's workspaces
      const { data: memberRows } = await supabase
        .from("workspace_members")
        .select("workspace_id, role, workspaces(*)")
        .eq("user_id", currentUser.id);

      let userWorkspaces: Workspace[] = [];
      if (memberRows && memberRows.length > 0) {
        userWorkspaces = memberRows
          .map((row) => {
            const ws = row.workspaces as unknown;
            return Array.isArray(ws) ? ws[0] : ws;
          })
          .filter(Boolean) as Workspace[];
      }

      // If user has no workspace yet, bootstrap their default workspace
      if (userWorkspaces.length === 0) {
        const slugBase = defaultName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        const wsSlug = `${slugBase || "ws"}-${currentUser.id.slice(0, 8)}`;

        const { data: createdWs } = await supabase
          .from("workspaces")
          .insert({
            name: `${defaultName}'s Workspace`,
            slug: wsSlug,
            owner_id: currentUser.id,
          })
          .select("*")
          .maybeSingle();

        if (createdWs) {
          await supabase.from("workspace_members").insert({
            workspace_id: createdWs.id,
            user_id: currentUser.id,
            role: "owner",
          });
          userWorkspaces = [createdWs as Workspace];
        }
      }

      setWorkspaces(userWorkspaces);
      const selectedWs = userWorkspaces[0] || null;
      setActiveWorkspace(selectedWs);

      if (selectedWs) {
        const { data: wsFolders } = await supabase
          .from("folders")
          .select("*")
          .eq("workspace_id", selectedWs.id)
          .order("created_at", { ascending: true });
        setFolders((wsFolders as Folder[]) || []);
      }
    } catch (err) {
      console.error("Failed to initialize workspace:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user: initialUser } }) => {
      setUser(initialUser ?? null);
      loadUserAndWorkspace(initialUser ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      loadUserAndWorkspace(nextUser);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserAndWorkspace]);

  const refreshWorkspaceData = useCallback(async () => {
    if (user) {
      await loadUserAndWorkspace(user);
    }
  }, [user, loadUserAndWorkspace]);

  const signOut = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setWorkspaces([]);
    setActiveWorkspace(null);
    setFolders([]);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        activeWorkspace,
        workspaces,
        folders,
        isLoading,
        dbReady,
        setActiveWorkspace,
        refreshWorkspaceData,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

