---
name: Library and comparator
description: Sistema de Biblioteca con marcapáginas en tarjetas, ruta /biblioteca y comparador de hasta 4 másters con tarjetas en paralelo y barras visuales
type: feature
---
Persistencia y datos:
- `src/hooks/useCurrentUser.ts`: guarda el usuario registrado en `localStorage` (clave `futureyou.user`). El icono de Biblioteca en la navbar aparece solo si existe usuario.
- `src/hooks/useLibrary.ts`: hook + helpers para guardar/quitar items en `localStorage` (clave `futureyou.library`). Sincroniza vía evento custom `futureyou:library-changed` y `storage`. Cada `LibraryItem` incluye `savedAt` ISO.

UI:
- Navbar muestra Link a `/biblioteca` con badge contador cuando hay items.
- `Results.tsx`: cada tarjeta tiene un botón marcapáginas (icon `Bookmark`, fill cuando está guardado) con toast.
- `Biblioteca.tsx` (`/biblioteca`): estado vacío con CTA, listado en grid de 2 columnas, modo comparar con checkbox circular (máx 4) y vista comparativa con tarjetas en paralelo y barras horizontales para precio, salida laboral, nivel de estrés y valoración media.
- `ReviewDetail.tsx`: título dinámico "Máster en [Nombre] en [Universidad/Centro]" usando `review.centro || review.ubicacion`.

Cálculo de métricas en el comparador: a partir de `mockReviewsByMaster` se calcula media de rating, estrés y empleabilidad (mapeo cualitativo→0-100 vía `empleabilidadScore`).
