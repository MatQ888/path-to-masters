/**
 * Locations data: countries, Spanish autonomous communities (CCAA) and provinces.
 * Structured for future Excel/Supabase export and easy expansion.
 */

export interface Country {
  code: string; // ISO-3166 alpha-2
  name: string;
}

export interface AutonomousCommunity {
  code: string;
  name: string;
}

export interface Province {
  name: string;
  ccaa: string; // AutonomousCommunity.code
}

/** Most-used countries in the platform. Easily extensible. */
export const COUNTRIES: Country[] = [
  { code: "ES", name: "España" },
  { code: "FR", name: "Francia" },
  { code: "PT", name: "Portugal" },
  { code: "IT", name: "Italia" },
  { code: "DE", name: "Alemania" },
  { code: "GB", name: "Reino Unido" },
  { code: "IE", name: "Irlanda" },
  { code: "NL", name: "Países Bajos" },
  { code: "BE", name: "Bélgica" },
  { code: "CH", name: "Suiza" },
  { code: "AT", name: "Austria" },
  { code: "DK", name: "Dinamarca" },
  { code: "SE", name: "Suecia" },
  { code: "NO", name: "Noruega" },
  { code: "FI", name: "Finlandia" },
  { code: "PL", name: "Polonia" },
  { code: "US", name: "Estados Unidos" },
  { code: "CA", name: "Canadá" },
  { code: "MX", name: "México" },
  { code: "AR", name: "Argentina" },
  { code: "CL", name: "Chile" },
  { code: "CO", name: "Colombia" },
  { code: "PE", name: "Perú" },
  { code: "BR", name: "Brasil" },
  { code: "AU", name: "Australia" },
  { code: "NZ", name: "Nueva Zelanda" },
  { code: "JP", name: "Japón" },
  { code: "CN", name: "China" },
  { code: "SG", name: "Singapur" },
  { code: "AE", name: "Emiratos Árabes Unidos" },
];

/** 17 Spanish autonomous communities. */
export const CCAA: AutonomousCommunity[] = [
  { code: "AN", name: "Andalucía" },
  { code: "AR", name: "Aragón" },
  { code: "AS", name: "Principado de Asturias" },
  { code: "IB", name: "Illes Balears" },
  { code: "CN", name: "Canarias" },
  { code: "CB", name: "Cantabria" },
  { code: "CL", name: "Castilla y León" },
  { code: "CM", name: "Castilla-La Mancha" },
  { code: "CT", name: "Cataluña" },
  { code: "EX", name: "Extremadura" },
  { code: "GA", name: "Galicia" },
  { code: "MD", name: "Comunidad de Madrid" },
  { code: "MC", name: "Región de Murcia" },
  { code: "NC", name: "Comunidad Foral de Navarra" },
  { code: "PV", name: "País Vasco" },
  { code: "RI", name: "La Rioja" },
  { code: "VC", name: "Comunitat Valenciana" },
];

/** 50 Spanish provinces mapped to their CCAA. */
export const PROVINCES: Province[] = [
  // Andalucía
  { name: "Almería", ccaa: "AN" },
  { name: "Cádiz", ccaa: "AN" },
  { name: "Córdoba", ccaa: "AN" },
  { name: "Granada", ccaa: "AN" },
  { name: "Huelva", ccaa: "AN" },
  { name: "Jaén", ccaa: "AN" },
  { name: "Málaga", ccaa: "AN" },
  { name: "Sevilla", ccaa: "AN" },
  // Aragón
  { name: "Huesca", ccaa: "AR" },
  { name: "Teruel", ccaa: "AR" },
  { name: "Zaragoza", ccaa: "AR" },
  // Asturias
  { name: "Asturias", ccaa: "AS" },
  // Illes Balears
  { name: "Illes Balears", ccaa: "IB" },
  // Canarias
  { name: "Las Palmas", ccaa: "CN" },
  { name: "Santa Cruz de Tenerife", ccaa: "CN" },
  // Cantabria
  { name: "Cantabria", ccaa: "CB" },
  // Castilla y León
  { name: "Ávila", ccaa: "CL" },
  { name: "Burgos", ccaa: "CL" },
  { name: "León", ccaa: "CL" },
  { name: "Palencia", ccaa: "CL" },
  { name: "Salamanca", ccaa: "CL" },
  { name: "Segovia", ccaa: "CL" },
  { name: "Soria", ccaa: "CL" },
  { name: "Valladolid", ccaa: "CL" },
  { name: "Zamora", ccaa: "CL" },
  // Castilla-La Mancha
  { name: "Albacete", ccaa: "CM" },
  { name: "Ciudad Real", ccaa: "CM" },
  { name: "Cuenca", ccaa: "CM" },
  { name: "Guadalajara", ccaa: "CM" },
  { name: "Toledo", ccaa: "CM" },
  // Cataluña
  { name: "Barcelona", ccaa: "CT" },
  { name: "Girona", ccaa: "CT" },
  { name: "Lleida", ccaa: "CT" },
  { name: "Tarragona", ccaa: "CT" },
  // Extremadura
  { name: "Badajoz", ccaa: "EX" },
  { name: "Cáceres", ccaa: "EX" },
  // Galicia
  { name: "A Coruña", ccaa: "GA" },
  { name: "Lugo", ccaa: "GA" },
  { name: "Ourense", ccaa: "GA" },
  { name: "Pontevedra", ccaa: "GA" },
  // Madrid
  { name: "Madrid", ccaa: "MD" },
  // Murcia
  { name: "Murcia", ccaa: "MC" },
  // Navarra
  { name: "Navarra", ccaa: "NC" },
  // País Vasco
  { name: "Álava", ccaa: "PV" },
  { name: "Gipuzkoa", ccaa: "PV" },
  { name: "Bizkaia", ccaa: "PV" },
  // La Rioja
  { name: "La Rioja", ccaa: "RI" },
  // Comunitat Valenciana
  { name: "Alicante", ccaa: "VC" },
  { name: "Castellón", ccaa: "VC" },
  { name: "Valencia", ccaa: "VC" },
];

/** Helper: get provinces that belong to a given CCAA code. */
export const getProvincesByCCAA = (ccaaCode: string): Province[] =>
  PROVINCES.filter((p) => p.ccaa === ccaaCode);

/** Helper: list of province names for a country. For now only Spain is detailed. */
export const getCitiesByCountry = (countryCode: string): string[] => {
  if (countryCode === "ES") return PROVINCES.map((p) => p.name).sort((a, b) => a.localeCompare(b, "es"));
  return [];
};
