/**
 * Experience entries shared across the GiveInfo form.
 * Designed to be portable to a future Excel/Supabase persistence layer.
 */

export interface WorkExperienceEntry {
  id: string;
  empresa: string;
  puesto: string;
  anios?: string; // free text e.g. "2021-2023" or "1 año"
}
