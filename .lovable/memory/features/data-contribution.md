---
name: Data Contribution Form
description: White-themed multi-section form with autocompletes, work experience entries, update flow and fixed thank-you screen
type: feature
---
The "Compartir información" form (`src/components/GiveInfoForm.tsx`) is rendered on a white/`bg-background` surface (no more solid blue background).

Structure:
- Apodo notice at top: "Toda la información que proporciones se publicará bajo tu apodo @{apodo}". Apodo flows from `RegistrationForm` via `Index.tsx` state.
- Sections: Localización → Entidad y programa → Valoración → Experiencia laboral → Comentario.
- Country / CCAA / City use `SearchableCombobox` (`src/components/SearchableCombobox.tsx`) backed by `src/data/locations.ts`. City is disabled until country is chosen; if country = ES, an extra CCAA selector filters provinces.
- Entity/centre uses combobox backed by `src/data/universities.ts` (`getUniversitiesByCountry`), with `allowCustom` so users can type new entities.
- Work experience: dynamic list of `WorkExperienceEntry` (`src/data/experienceTypes.ts`) with add/remove.
- On submit, `publishedAt` is set to `new Date().toISOString()`. The "Actualizar información" button on the thank-you screen returns to the form and clears `publishedAt` so it refreshes on next save.
- Thank-you screen has TWO visible, clickable buttons (fixed): "Actualizar información" (outline) and "Volver al inicio" (primary). Background is `bg-background`, not blue.

Dependencies: `RegistrationForm` now exports `RegistrationData` and its `onComplete` receives the full data object so `Index.tsx` can persist `apodo`.
