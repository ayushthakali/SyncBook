"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "@/lib/features/auth/authSlice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 1. Check for an active session immediately on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setUser(session?.user ?? null));
    });

    // 2. Listen for changes (supabse emits events -> signed_in, signed_out, token_refreshed, user_updated)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      //onAuthStateChange -> listener when any auth changes redux is updated instantly
      dispatch(setUser(session?.user ?? null));
    });

    return () => subscription.unsubscribe(); //Prevents memory leaks and duplicate listeners
  }, [dispatch]);

  return <>{children}</>;
}
