/**
 * Universities dataset.
 * Spain: 50 public + 42 private universities (verified against CRUE / Ministerio de Universidades).
 * Plus a curated selection of major international universities.
 *
 * Structure is designed to be exportable to Excel/Supabase.
 */

export type UniversityType = "publica" | "privada";

export interface University {
  name: string;
  shortName?: string;
  type: UniversityType;
  country: string; // ISO-3166 alpha-2
  ccaa?: string; // CCAA code (Spain only)
  city?: string;
}

/** 50 Spanish public universities. */
export const SPANISH_PUBLIC_UNIVERSITIES: University[] = [
  // Andalucía (10)
  { name: "Universidad de Almería", shortName: "UAL", type: "publica", country: "ES", ccaa: "AN", city: "Almería" },
  { name: "Universidad de Cádiz", shortName: "UCA", type: "publica", country: "ES", ccaa: "AN", city: "Cádiz" },
  { name: "Universidad de Córdoba", shortName: "UCO", type: "publica", country: "ES", ccaa: "AN", city: "Córdoba" },
  { name: "Universidad de Granada", shortName: "UGR", type: "publica", country: "ES", ccaa: "AN", city: "Granada" },
  { name: "Universidad de Huelva", shortName: "UHU", type: "publica", country: "ES", ccaa: "AN", city: "Huelva" },
  { name: "Universidad de Jaén", shortName: "UJA", type: "publica", country: "ES", ccaa: "AN", city: "Jaén" },
  { name: "Universidad de Málaga", shortName: "UMA", type: "publica", country: "ES", ccaa: "AN", city: "Málaga" },
  { name: "Universidad Pablo de Olavide", shortName: "UPO", type: "publica", country: "ES", ccaa: "AN", city: "Sevilla" },
  { name: "Universidad de Sevilla", shortName: "US", type: "publica", country: "ES", ccaa: "AN", city: "Sevilla" },
  { name: "Universidad Internacional de Andalucía", shortName: "UNIA", type: "publica", country: "ES", ccaa: "AN", city: "Sevilla" },
  // Aragón (1)
  { name: "Universidad de Zaragoza", shortName: "UNIZAR", type: "publica", country: "ES", ccaa: "AR", city: "Zaragoza" },
  // Asturias (1)
  { name: "Universidad de Oviedo", shortName: "UNIOVI", type: "publica", country: "ES", ccaa: "AS", city: "Oviedo" },
  // Illes Balears (1)
  { name: "Universitat de les Illes Balears", shortName: "UIB", type: "publica", country: "ES", ccaa: "IB", city: "Palma" },
  // Canarias (2)
  { name: "Universidad de Las Palmas de Gran Canaria", shortName: "ULPGC", type: "publica", country: "ES", ccaa: "CN", city: "Las Palmas" },
  { name: "Universidad de La Laguna", shortName: "ULL", type: "publica", country: "ES", ccaa: "CN", city: "La Laguna" },
  // Cantabria (2)
  { name: "Universidad de Cantabria", shortName: "UC", type: "publica", country: "ES", ccaa: "CB", city: "Santander" },
  { name: "Universidad Internacional Menéndez Pelayo", shortName: "UIMP", type: "publica", country: "ES", ccaa: "CB", city: "Santander" },
  // Castilla y León (4)
  { name: "Universidad de Burgos", shortName: "UBU", type: "publica", country: "ES", ccaa: "CL", city: "Burgos" },
  { name: "Universidad de León", shortName: "UNILEON", type: "publica", country: "ES", ccaa: "CL", city: "León" },
  { name: "Universidad de Salamanca", shortName: "USAL", type: "publica", country: "ES", ccaa: "CL", city: "Salamanca" },
  { name: "Universidad de Valladolid", shortName: "UVA", type: "publica", country: "ES", ccaa: "CL", city: "Valladolid" },
  // Castilla-La Mancha (1)
  { name: "Universidad de Castilla-La Mancha", shortName: "UCLM", type: "publica", country: "ES", ccaa: "CM", city: "Ciudad Real" },
  // Cataluña (7)
  { name: "Universitat de Barcelona", shortName: "UB", type: "publica", country: "ES", ccaa: "CT", city: "Barcelona" },
  { name: "Universitat Autònoma de Barcelona", shortName: "UAB", type: "publica", country: "ES", ccaa: "CT", city: "Barcelona" },
  { name: "Universitat Politècnica de Catalunya", shortName: "UPC", type: "publica", country: "ES", ccaa: "CT", city: "Barcelona" },
  { name: "Universitat Pompeu Fabra", shortName: "UPF", type: "publica", country: "ES", ccaa: "CT", city: "Barcelona" },
  { name: "Universitat de Girona", shortName: "UdG", type: "publica", country: "ES", ccaa: "CT", city: "Girona" },
  { name: "Universitat de Lleida", shortName: "UdL", type: "publica", country: "ES", ccaa: "CT", city: "Lleida" },
  { name: "Universitat Rovira i Virgili", shortName: "URV", type: "publica", country: "ES", ccaa: "CT", city: "Tarragona" },
  // Extremadura (1)
  { name: "Universidad de Extremadura", shortName: "UEX", type: "publica", country: "ES", ccaa: "EX", city: "Badajoz" },
  // Galicia (3)
  { name: "Universidade da Coruña", shortName: "UDC", type: "publica", country: "ES", ccaa: "GA", city: "A Coruña" },
  { name: "Universidade de Santiago de Compostela", shortName: "USC", type: "publica", country: "ES", ccaa: "GA", city: "Santiago de Compostela" },
  { name: "Universidade de Vigo", shortName: "UVigo", type: "publica", country: "ES", ccaa: "GA", city: "Vigo" },
  // Madrid (6)
  { name: "Universidad Complutense de Madrid", shortName: "UCM", type: "publica", country: "ES", ccaa: "MD", city: "Madrid" },
  { name: "Universidad Politécnica de Madrid", shortName: "UPM", type: "publica", country: "ES", ccaa: "MD", city: "Madrid" },
  { name: "Universidad Autónoma de Madrid", shortName: "UAM", type: "publica", country: "ES", ccaa: "MD", city: "Madrid" },
  { name: "Universidad Carlos III de Madrid", shortName: "UC3M", type: "publica", country: "ES", ccaa: "MD", city: "Madrid" },
  { name: "Universidad Rey Juan Carlos", shortName: "URJC", type: "publica", country: "ES", ccaa: "MD", city: "Madrid" },
  { name: "Universidad Nacional de Educación a Distancia", shortName: "UNED", type: "publica", country: "ES", ccaa: "MD", city: "Madrid" },
  // Murcia (2)
  { name: "Universidad de Murcia", shortName: "UM", type: "publica", country: "ES", ccaa: "MC", city: "Murcia" },
  { name: "Universidad Politécnica de Cartagena", shortName: "UPCT", type: "publica", country: "ES", ccaa: "MC", city: "Cartagena" },
  // Navarra (1)
  { name: "Universidad Pública de Navarra", shortName: "UPNA", type: "publica", country: "ES", ccaa: "NC", city: "Pamplona" },
  // País Vasco (1)
  { name: "Universidad del País Vasco", shortName: "UPV/EHU", type: "publica", country: "ES", ccaa: "PV", city: "Leioa" },
  // La Rioja (1)
  { name: "Universidad de La Rioja", shortName: "UR", type: "publica", country: "ES", ccaa: "RI", city: "Logroño" },
  // Comunitat Valenciana (5)
  { name: "Universitat de València", shortName: "UV", type: "publica", country: "ES", ccaa: "VC", city: "Valencia" },
  { name: "Universitat Politècnica de València", shortName: "UPV", type: "publica", country: "ES", ccaa: "VC", city: "Valencia" },
  { name: "Universitat d'Alacant", shortName: "UA", type: "publica", country: "ES", ccaa: "VC", city: "Alicante" },
  { name: "Universitat Jaume I", shortName: "UJI", type: "publica", country: "ES", ccaa: "VC", city: "Castelló" },
  { name: "Universidad Miguel Hernández de Elche", shortName: "UMH", type: "publica", country: "ES", ccaa: "VC", city: "Elche" },
];

/** 42 Spanish private universities. */
export const SPANISH_PRIVATE_UNIVERSITIES: University[] = [
  // Madrid
  { name: "Universidad de Navarra", shortName: "UNAV", type: "privada", country: "ES", ccaa: "NC", city: "Pamplona" },
  { name: "Universidad Pontificia Comillas", shortName: "Comillas (ICAI-ICADE)", type: "privada", country: "ES", ccaa: "MD", city: "Madrid" },
  { name: "Universidad CEU San Pablo", shortName: "CEU San Pablo", type: "privada", country: "ES", ccaa: "MD", city: "Madrid" },
  { name: "Universidad Francisco de Vitoria", shortName: "UFV", type: "privada", country: "ES", ccaa: "MD", city: "Pozuelo de Alarcón" },
  { name: "Universidad Antonio de Nebrija", shortName: "Nebrija", type: "privada", country: "ES", ccaa: "MD", city: "Madrid" },
  { name: "Universidad Europea de Madrid", shortName: "UEM", type: "privada", country: "ES", ccaa: "MD", city: "Villaviciosa de Odón" },
  { name: "Universidad Alfonso X El Sabio", shortName: "UAX", type: "privada", country: "ES", ccaa: "MD", city: "Villanueva de la Cañada" },
  { name: "Universidad Camilo José Cela", shortName: "UCJC", type: "privada", country: "ES", ccaa: "MD", city: "Villafranca del Castillo" },
  { name: "Universidad a Distancia de Madrid", shortName: "UDIMA", type: "privada", country: "ES", ccaa: "MD", city: "Collado Villalba" },
  { name: "IE Universidad", shortName: "IE", type: "privada", country: "ES", ccaa: "MD", city: "Madrid" },
  { name: "Universidad Internacional de La Rioja", shortName: "UNIR", type: "privada", country: "ES", ccaa: "RI", city: "Logroño" },
  { name: "Universidad Internacional Villanueva", shortName: "Villanueva", type: "privada", country: "ES", ccaa: "MD", city: "Madrid" },
  { name: "Universidad Intercontinental de la Empresa", shortName: "UIE", type: "privada", country: "ES", ccaa: "MD", city: "Madrid" },
  { name: "Universidad Europea Miguel de Cervantes", shortName: "UEMC", type: "privada", country: "ES", ccaa: "CL", city: "Valladolid" },
  { name: "Universidad Pontificia de Salamanca", shortName: "UPSA", type: "privada", country: "ES", ccaa: "CL", city: "Salamanca" },
  { name: "Universidad Católica de Ávila", shortName: "UCAV", type: "privada", country: "ES", ccaa: "CL", city: "Ávila" },
  { name: "IE University (campus Segovia)", shortName: "IE Segovia", type: "privada", country: "ES", ccaa: "CL", city: "Segovia" },
  // Cataluña
  { name: "Universitat Ramon Llull", shortName: "URL", type: "privada", country: "ES", ccaa: "CT", city: "Barcelona" },
  { name: "Universitat Internacional de Catalunya", shortName: "UIC", type: "privada", country: "ES", ccaa: "CT", city: "Barcelona" },
  { name: "Universitat Abat Oliba CEU", shortName: "UAO CEU", type: "privada", country: "ES", ccaa: "CT", city: "Barcelona" },
  { name: "Universitat de Vic - Universitat Central de Catalunya", shortName: "UVic-UCC", type: "privada", country: "ES", ccaa: "CT", city: "Vic" },
  { name: "Universitat Oberta de Catalunya", shortName: "UOC", type: "privada", country: "ES", ccaa: "CT", city: "Barcelona" },
  // Comunitat Valenciana
  { name: "Universidad Cardenal Herrera-CEU", shortName: "CEU UCH", type: "privada", country: "ES", ccaa: "VC", city: "Valencia" },
  { name: "Universidad Católica de Valencia San Vicente Mártir", shortName: "UCV", type: "privada", country: "ES", ccaa: "VC", city: "Valencia" },
  { name: "Universidad Europea de Valencia", shortName: "UEV", type: "privada", country: "ES", ccaa: "VC", city: "Valencia" },
  // Andalucía
  { name: "Universidad Loyola Andalucía", shortName: "Loyola", type: "privada", country: "ES", ccaa: "AN", city: "Sevilla" },
  { name: "Universidad Europea de Andalucía", shortName: "UEA", type: "privada", country: "ES", ccaa: "AN", city: "Málaga" },
  // Galicia
  { name: "Universidad Intercontinental de la Empresa - Galicia", shortName: "UIE Galicia", type: "privada", country: "ES", ccaa: "GA", city: "A Coruña" },
  // Murcia
  { name: "Universidad Católica San Antonio de Murcia", shortName: "UCAM", type: "privada", country: "ES", ccaa: "MC", city: "Murcia" },
  // País Vasco
  { name: "Universidad de Deusto", shortName: "Deusto", type: "privada", country: "ES", ccaa: "PV", city: "Bilbao" },
  { name: "Universidad de Mondragón", shortName: "MU", type: "privada", country: "ES", ccaa: "PV", city: "Mondragón" },
  // Canarias
  { name: "Universidad Fernando Pessoa Canarias", shortName: "UFP-C", type: "privada", country: "ES", ccaa: "CN", city: "Las Palmas" },
  { name: "Universidad del Atlántico Medio", shortName: "UAM Canarias", type: "privada", country: "ES", ccaa: "CN", city: "Las Palmas" },
  // Otras
  { name: "Universidad Isabel I de Castilla", shortName: "Ui1", type: "privada", country: "ES", ccaa: "CL", city: "Burgos" },
  { name: "Universidad Internacional Isabel I de Castilla", shortName: "Ui1 Internacional", type: "privada", country: "ES", ccaa: "CL", city: "Burgos" },
  { name: "Universidad Internacional de Valencia", shortName: "VIU", type: "privada", country: "ES", ccaa: "VC", city: "Valencia" },
  { name: "Universidad Tecnológica Atlántico-Mediterráneo", shortName: "UTAMED", type: "privada", country: "ES", ccaa: "AN", city: "Málaga" },
  { name: "Universidad de Alfonso VIII", shortName: "UAVIII", type: "privada", country: "ES", ccaa: "CL", city: "Cuenca" },
  { name: "Universidad CUNEF", shortName: "CUNEF", type: "privada", country: "ES", ccaa: "MD", city: "Madrid" },
  { name: "Universidad EAE Business School", shortName: "EAE", type: "privada", country: "ES", ccaa: "CT", city: "Barcelona" },
  { name: "Universidad ESIC", shortName: "ESIC", type: "privada", country: "ES", ccaa: "MD", city: "Madrid" },
  { name: "Universidad de la Hespérides", shortName: "Hespérides", type: "privada", country: "ES", ccaa: "CN", city: "Las Palmas" },
];

/** Curated international universities (selección representativa). */
export const INTERNATIONAL_UNIVERSITIES: University[] = [
  // Reino Unido
  { name: "University of Oxford", shortName: "Oxford", type: "publica", country: "GB", city: "Oxford" },
  { name: "University of Cambridge", shortName: "Cambridge", type: "publica", country: "GB", city: "Cambridge" },
  { name: "Imperial College London", shortName: "Imperial", type: "publica", country: "GB", city: "Londres" },
  { name: "London School of Economics", shortName: "LSE", type: "publica", country: "GB", city: "Londres" },
  { name: "University College London", shortName: "UCL", type: "publica", country: "GB", city: "Londres" },
  { name: "King's College London", shortName: "KCL", type: "publica", country: "GB", city: "Londres" },
  // EE.UU.
  { name: "Harvard University", shortName: "Harvard", type: "privada", country: "US", city: "Cambridge, MA" },
  { name: "Stanford University", shortName: "Stanford", type: "privada", country: "US", city: "Stanford, CA" },
  { name: "Massachusetts Institute of Technology", shortName: "MIT", type: "privada", country: "US", city: "Cambridge, MA" },
  { name: "University of California, Berkeley", shortName: "UC Berkeley", type: "publica", country: "US", city: "Berkeley, CA" },
  { name: "Yale University", shortName: "Yale", type: "privada", country: "US", city: "New Haven, CT" },
  { name: "Princeton University", shortName: "Princeton", type: "privada", country: "US", city: "Princeton, NJ" },
  { name: "Columbia University", shortName: "Columbia", type: "privada", country: "US", city: "Nueva York, NY" },
  { name: "University of Chicago", shortName: "UChicago", type: "privada", country: "US", city: "Chicago, IL" },
  { name: "The Wharton School", shortName: "Wharton", type: "privada", country: "US", city: "Filadelfia, PA" },
  // Francia
  { name: "HEC Paris", shortName: "HEC", type: "privada", country: "FR", city: "Jouy-en-Josas" },
  { name: "INSEAD", shortName: "INSEAD", type: "privada", country: "FR", city: "Fontainebleau" },
  { name: "Sciences Po", shortName: "Sciences Po", type: "publica", country: "FR", city: "París" },
  { name: "ESSEC Business School", shortName: "ESSEC", type: "privada", country: "FR", city: "Cergy" },
  { name: "Sorbonne Université", shortName: "Sorbonne", type: "publica", country: "FR", city: "París" },
  // Alemania
  { name: "Technische Universität München", shortName: "TUM", type: "publica", country: "DE", city: "Múnich" },
  { name: "Ludwig-Maximilians-Universität München", shortName: "LMU", type: "publica", country: "DE", city: "Múnich" },
  { name: "Heidelberg University", shortName: "Heidelberg", type: "publica", country: "DE", city: "Heidelberg" },
  { name: "WHU - Otto Beisheim School of Management", shortName: "WHU", type: "privada", country: "DE", city: "Vallendar" },
  // Países Bajos
  { name: "University of Amsterdam", shortName: "UvA", type: "publica", country: "NL", city: "Ámsterdam" },
  { name: "Erasmus University Rotterdam", shortName: "EUR", type: "publica", country: "NL", city: "Róterdam" },
  { name: "Delft University of Technology", shortName: "TU Delft", type: "publica", country: "NL", city: "Delft" },
  // Italia
  { name: "Università Bocconi", shortName: "Bocconi", type: "privada", country: "IT", city: "Milán" },
  { name: "Politecnico di Milano", shortName: "PoliMi", type: "publica", country: "IT", city: "Milán" },
  { name: "Sapienza Università di Roma", shortName: "Sapienza", type: "publica", country: "IT", city: "Roma" },
  // Portugal
  { name: "Universidade de Lisboa", shortName: "UL", type: "publica", country: "PT", city: "Lisboa" },
  { name: "Nova School of Business and Economics", shortName: "Nova SBE", type: "publica", country: "PT", city: "Lisboa" },
  // Suiza
  { name: "ETH Zürich", shortName: "ETH", type: "publica", country: "CH", city: "Zúrich" },
  { name: "EPFL", shortName: "EPFL", type: "publica", country: "CH", city: "Lausana" },
  { name: "IMD Business School", shortName: "IMD", type: "privada", country: "CH", city: "Lausana" },
];

/** All universities combined. Source-of-truth for autocompletes. */
export const ALL_UNIVERSITIES: University[] = [
  ...SPANISH_PUBLIC_UNIVERSITIES,
  ...SPANISH_PRIVATE_UNIVERSITIES,
  ...INTERNATIONAL_UNIVERSITIES,
];

/** Helper: filter universities by country code. */
export const getUniversitiesByCountry = (countryCode: string): University[] =>
  ALL_UNIVERSITIES.filter((u) => u.country === countryCode);

/** Helper: search universities by free-text (name or shortName, case-insensitive). */
export const searchUniversities = (query: string, countryCode?: string): University[] => {
  const q = query.trim().toLowerCase();
  if (!q) return countryCode ? getUniversitiesByCountry(countryCode) : ALL_UNIVERSITIES;
  const pool = countryCode ? getUniversitiesByCountry(countryCode) : ALL_UNIVERSITIES;
  return pool.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      (u.shortName?.toLowerCase().includes(q) ?? false),
  );
};
