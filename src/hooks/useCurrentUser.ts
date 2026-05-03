import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface CurrentUser {
  id: string;
  email: string;
  apodo: string;
  nombre?: string;
}

interface AuthState {
  user: CurrentUser | null;
  session: Session | null;
  loading: boolean;
}

const buildUser = async (sessionUser: User): Promise<CurrentUser> => {
  const fallbackApodo =
    (sessionUser.user_metadata?.apodo as string | undefined) ??
    sessionUser.email?.split("@")[0] ??
    "Usuario";

  // Fetch profile (best-effort; trigger creates it on signup)
  const { data } = await supabase
    .from("profiles")
    .select("apodo, nombre")
    .eq("id", sessionUser.id)
    .maybeSingle();

  return {
    id: sessionUser.id,
    email: sessionUser.email ?? "",
    apodo: data?.apodo ?? fallbackApodo,
    nombre: data?.nombre ?? undefined,
  };
};

/**
 * Reactive hook exposing the current authenticated user (with profile data).
 * Uses Supabase auth + profiles table.
 */
export const useCurrentUser = () => {
  const [state, setState] = useState<AuthState>({ user: null, session: null, loading: true });

  useEffect(() => {
    let mounted = true;

    // 1) Set up listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        // Defer the profile fetch to avoid deadlocks inside the callback
        setTimeout(async () => {
          const user = await buildUser(session.user);
          if (mounted) setState({ user, session, loading: false });
        }, 0);
      } else {
        setState({ user: null, session: null, loading: false });
      }
    });

    // 2) Then load existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        const user = await buildUser(session.user);
        if (mounted) setState({ user, session, loading: false });
      } else {
        setState({ user: null, session: null, loading: false });
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state.user;
};

/** Convenience hook returning loading state too. */
export const useAuthState = () => {
  const [state, setState] = useState<AuthState>({ user: null, session: null, loading: true });

  useEffect(() => {
    let mounted = true;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        setTimeout(async () => {
          const user = await buildUser(session.user);
          if (mounted) setState({ user, session, loading: false });
        }, 0);
      } else {
        setState({ user: null, session: null, loading: false });
      }
    });
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      if (session?.user) {
        const user = await buildUser(session.user);
        if (mounted) setState({ user, session, loading: false });
      } else {
        setState({ user: null, session: null, loading: false });
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};
