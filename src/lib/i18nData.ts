import i18n from "@/i18n";

/** Traduce un nombre de país (almacenado en español) usando su código ISO si lo encontramos. */
import { COUNTRIES, CCAA } from "@/data/locations";

export const tCountryByCode = (code: string): string => {
  const fallback = COUNTRIES.find((c) => c.code === code)?.name ?? code;
  return i18n.t(`countries.${code}`, { defaultValue: fallback });
};

export const tCountryByName = (name: string): string => {
  const found = COUNTRIES.find((c) => c.name === name);
  return found ? tCountryByCode(found.code) : name;
};

export const tCcaaByCode = (code: string): string => {
  const fallback = CCAA.find((c) => c.code === code)?.name ?? code;
  return i18n.t(`ccaa.${code}`, { defaultValue: fallback });
};

export const tCcaaByName = (name: string): string => {
  const found = CCAA.find((c) => c.name === name);
  return found ? tCcaaByCode(found.code) : name;
};

export const tProvince = (name: string): string =>
  i18n.t(`provinces.${name}`, { defaultValue: name });

export const tFormat = (name: string): string =>
  i18n.t(`formats.${name}`, { defaultValue: name });

export const tQuestionnaireOption = (name: string): string =>
  i18n.t(`questionnaire.options.${name}`, { defaultValue: name });

export const tSpecialty = (name: string): string =>
  i18n.t(`giveForm.specialties.${name}`, { defaultValue: name });
