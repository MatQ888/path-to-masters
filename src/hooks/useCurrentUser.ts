import { useEffect, useState } from "react";

const STORAGE_KEY = "futureyou.user";
const STORAGE_EVENT = "futureyou:user-changed";

export interface StoredUser {
  apodo: string;
  nombre?: string;
}

const readUser = (): StoredUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: StoredUser | null) => {
  if (typeof window === "undefined") return;
  if (user) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
};

/** Hook reactivo que expone el usuario actualmente registrado. */
export const useCurrentUser = () => {
  const [user, setUser] = useState<StoredUser | null>(() => readUser());

  useEffect(() => {
    const sync = () => setUser(readUser());
    window.addEventListener(STORAGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(STORAGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return user;
};
