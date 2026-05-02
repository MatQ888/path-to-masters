import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Stub de traducción de comentarios. Estructura preparada para conectar
 * en el futuro un endpoint (n8n / DeepL / Lovable AI Gateway).
 *
 * Por ahora simula una traducción devolviendo el texto original tras un
 * pequeño delay, manteniendo la API que usaremos cuando haya backend.
 */
export function useReviewTranslation() {
  const { i18n } = useTranslation();
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const translate = useCallback(
    async (reviewId: string | number, text: string) => {
      const id = String(reviewId);
      setLoadingId(id);
      try {
        // TODO: reemplazar por llamada real (n8n / DeepL / AI Gateway)
        // const res = await fetch("/api/translate", {
        //   method: "POST",
        //   body: JSON.stringify({ text, target: i18n.language }),
        // });
        // const { translated } = await res.json();
        await new Promise((r) => setTimeout(r, 400));
        const translated = `[${i18n.language.toUpperCase()}] ${text}`;
        setTranslations((prev) => ({ ...prev, [id]: translated }));
      } finally {
        setLoadingId(null);
      }
    },
    [i18n.language],
  );

  const clear = useCallback((reviewId: string | number) => {
    const id = String(reviewId);
    setTranslations((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  return {
    translate,
    clear,
    getTranslation: (id: string | number) => translations[String(id)],
    isLoading: (id: string | number) => loadingId === String(id),
  };
}
