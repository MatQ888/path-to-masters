---
name: Library and comparator
description: Flujo de 3 niveles (másters → centros → opiniones), Biblioteca con marcapáginas a nivel de centro, ruta /biblioteca y comparador de hasta 4 másters
type: feature
---
Flujo de navegación (3 niveles) en `Results.tsx`:
- Nivel 1: tarjetas de recomendaciones (`mockMasters`). Botón "Ver más" → nivel 2.
- Nivel 2: `CentersListing.tsx` muestra los centros que imparten ese máster, leídos de `src/data/mockCenters.ts` (`getCentersForMaster`). Cada tarjeta tiene marcapáginas que guarda en Biblioteca con `id = "{masterName}__{centerName}"` y `name = "Máster en X en Centro"`. Botón "Ver opiniones" → nivel 3.
- Nivel 3: `ReviewsListing.tsx` (con título "Máster en X en Centro" si viene del nivel 2) → `ReviewDetail.tsx` (acepta `centerName` opcional y compone título dinámico, o usa `masterName` tal cual si ya viene compuesto).

Persistencia y datos:
- `src/hooks/useCurrentUser.ts`: guarda el usuario registrado en `localStorage` (clave `futureyou.user`). El icono de Biblioteca en la navbar aparece solo si existe usuario.
- `src/hooks/useLibrary.ts`: hook + helpers para guardar/quitar items en `localStorage` (clave `futureyou.library`). Sincroniza vía evento custom `futureyou:library-changed` y `storage`. Cada `LibraryItem` incluye `savedAt` ISO.
- `src/data/mockCenters.ts`: `mockCentersByMaster` con centros (UPM, UC3M, UCM, UAM, IE, UPC, UB, UPF, etc.) y `getCentersForMaster(masterName, fallback)`.

UI:
- `Navbar.tsx` muestra link a `/biblioteca` con badge contador cuando hay items.
- `Biblioteca.tsx` (`/biblioteca`):
  - "Volver" y "Explorar másteres" navegan a `/` (no a `-1`) para llevar a la pantalla de selección.
  - Estado vacío: "No has guardado nada aún. Explora másteres para añadirlos a tu biblioteca."
  - Modo Comparar con checkbox circular (máx 4) y vista comparativa con barras horizontales para precio, salida laboral, nivel de estrés y valoración media.
- `Index.tsx`: si `useCurrentUser()` devuelve usuario, el step inicial es `"action"` (no `"hero"`) para que volver desde `/biblioteca` no obligue a registrarse de nuevo.
- `GiveInfoForm.tsx`: en la pantalla de agradecimiento, el botón "Volver al inicio" usa `variant="cta"` con `text-primary-foreground` para asegurar legibilidad.

Cálculo de métricas en el comparador: a partir de `mockReviewsByMaster` se calcula media de rating, estrés y empleabilidad (mapeo cualitativo→0-100 vía `empleabilidadScore`).
