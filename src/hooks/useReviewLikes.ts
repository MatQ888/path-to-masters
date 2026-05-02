import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "futureyou.reviewLikes";
const EVENT = "futureyou:review-likes-changed";

type LikesMap = Record<string, number>; // reviewId -> count
type UserLikedSet = Record<string, true>; // reviewId -> liked by current user

const USER_KEY = "futureyou.reviewLikes.user";

const readMap = <T extends object>(key: string): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : ({} as T);
  } catch {
    return {} as T;
  }
};

const writeMap = (key: string, value: object) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(EVENT));
  } catch {
    /* noop */
  }
};

/**
 * Hook de likes por reseña, persistido en localStorage.
 * Pensado como capa frontend hasta que exista backend (Fase C).
 */
export function useReviewLikes() {
  const [counts, setCounts] = useState<LikesMap>(() => readMap<LikesMap>(STORAGE_KEY));
  const [userLiked, setUserLiked] = useState<UserLikedSet>(() => readMap<UserLikedSet>(USER_KEY));

  useEffect(() => {
    const sync = () => {
      setCounts(readMap<LikesMap>(STORAGE_KEY));
      setUserLiked(readMap<UserLikedSet>(USER_KEY));
    };
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggleLike = useCallback((reviewId: string | number) => {
    const id = String(reviewId);
    const currentCounts = readMap<LikesMap>(STORAGE_KEY);
    const currentUser = readMap<UserLikedSet>(USER_KEY);
    const isLiked = !!currentUser[id];

    if (isLiked) {
      delete currentUser[id];
      currentCounts[id] = Math.max(0, (currentCounts[id] ?? 1) - 1);
    } else {
      currentUser[id] = true;
      currentCounts[id] = (currentCounts[id] ?? 0) + 1;
    }

    writeMap(STORAGE_KEY, currentCounts);
    writeMap(USER_KEY, currentUser);
  }, []);

  const getLikes = useCallback(
    (reviewId: string | number) => counts[String(reviewId)] ?? 0,
    [counts],
  );

  const hasLiked = useCallback(
    (reviewId: string | number) => !!userLiked[String(reviewId)],
    [userLiked],
  );

  return { getLikes, hasLiked, toggleLike };
}
