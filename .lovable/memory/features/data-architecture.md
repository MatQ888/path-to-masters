---
name: Data architecture
description: Data layer with locations (countries, 17 CCAA, 50 provinces) and universities (50 public + 42 private Spanish + international) under src/data/
type: feature
---
Locations live in `src/data/locations.ts`: COUNTRIES, CCAA (17), PROVINCES (50, each tagged with `ccaa` code). Helpers: `getProvincesByCCAA`, `getCitiesByCountry`.

Universities live in `src/data/universities.ts`: SPANISH_PUBLIC_UNIVERSITIES (50), SPANISH_PRIVATE_UNIVERSITIES (42), INTERNATIONAL_UNIVERSITIES, ALL_UNIVERSITIES. Helpers: `getUniversitiesByCountry`, `searchUniversities`.

All entities use plain serializable interfaces, ready for Excel/Supabase export.
