import { create } from "zustand";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../supabase";
import type { Profile } from "@/types/database";

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isInitialized: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user: null,
  profile: null,
  isLoading: true,
  isInitialized: false,

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),

  initialize: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      set({
        session,
        user: session?.user ?? null,
        isLoading: false,
        isInitialized: true,
      });

      // Fetch profile if user is logged in
      if (session?.user) {
        get().refreshProfile();
      }

      // Listen for auth state changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ session, user: session?.user ?? null });

        if (session?.user) {
          get().refreshProfile();
        } else {
          set({ profile: null });
        }
      });
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      set({ profile: data });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  },
}));
