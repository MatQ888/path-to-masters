import { useCallback, useEffect, useState } from "react";

/**
 * Item guardado en la Biblioteca del usuario.
 * Diseñado para ser serializable (futuro Excel/Supabase).
 */
export interface LibraryItem {
  /** Identificador único: nombre del máster (slug-friendly). */
  id: string;
  /** Nombre del máster para mostrar (ej. "Máster en Data Science"). */
  name: string;
  /** Localización resumida (ciudad, país). */
  location: string;
  /** Precio anual mostrado tal cual en la tarjeta. */
  price: string;
  /** Tipo de centro: "Público" | "Privado". */
  type: string;
  /** Duración del programa. */
  duration: string;
  /** Timestamp ISO del momento en que se guardó. */
  savedAt: string;
}

const STORAGE_KEY = "futureyou.library";
const STORAGE_EVENT = "futureyou:library-changed";

const readStorage = (): LibraryItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LibraryItem[]) : [];
  } catch {
    return [];
  }
};

const writeStorage = (items: LibraryItem[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
};

/**
 * Hook para gestionar la biblioteca del usuario.
 * Sincroniza cambios entre componentes vía evento custom + 'storage'.
 */
export const useLibrary = () => {
  const [items, setItems] = useState<LibraryItem[]>(() => readStorage());

  useEffect(() => {
    const sync = () => setItems(readStorage());
    window.addEventListener(STORAGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(STORAGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isSaved = useCallback(
    (id: string) => items.some((it) => it.id === id),
    [items]
  );

  const toggle = useCallback(
    (item: Omit<LibraryItem, "savedAt">) => {
      const current = readStorage();
      const exists = current.some((it) => it.id === item.id);
      const next = exists
        ? current.filter((it) => it.id !== item.id)
        : [...current, { ...item, savedAt: new Date().toISOString() }];
      writeStorage(next);
      return !exists; // true si se acaba de guardar
    },
    []
  );

  const remove = useCallback((id: string) => {
    const next = readStorage().filter((it) => it.id !== id);
    writeStorage(next);
  }, []);

  const clear = useCallback(() => writeStorage([]), []);

  return { items, isSaved, toggle, remove, clear };
};
