---
name: Likes, popular sort and i18n
description: Review likes (BookHeart icon) persisted in localStorage, "Más populares" sort option, react-i18next setup with ES/EN, and stub translation hook for review comments
type: feature
---
- Likes: `useReviewLikes` (src/hooks/useReviewLikes.ts) stores like counts and per-user liked set in localStorage (`futureyou.reviewLikes` + `futureyou.reviewLikes.user`). UI: `BookHeart` lucide icon with counter on each review card and inside `ReviewDetail`.
- Sort: `ReviewsListing` exposes `relevance | recent | popular`; popular orders by like count desc.
- i18n: react-i18next + browser-languagedetector. Config in `src/i18n/index.ts`, locales in `src/i18n/locales/{es,en}.json`. Initialized once from `src/main.tsx`. Language is persisted in localStorage key `futureyou.lang`. Navbar globe dropdown shows current language with a check mark.
- Comment translation: `useReviewTranslation` is a stub that simulates async translation and exposes `translate / clear / getTranslation / isLoading`. To wire a real backend (n8n / DeepL / Lovable AI Gateway) replace the simulated block inside `translate()`.
