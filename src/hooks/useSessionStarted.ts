import { useEffect, useState } from "react";

const KEY = "futureyou.sessionStarted";
const EVENT = "futureyou:session-started-changed";

const read = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(KEY) === "1";
};

export const setSessionStarted = (started: boolean) => {
  if (typeof window === "undefined") return;
  if (started) window.sessionStorage.setItem(KEY, "1");
  else window.sessionStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent(EVENT));
};

/** Si el usuario ya pulsó "Comenzar" en esta pestaña. Se borra al cerrar la pestaña. */
export const useSessionStarted = () => {
  const [started, setStarted] = useState<boolean>(() => read());
  useEffect(() => {
    const sync = () => setStarted(read());
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);
  return started;
};
