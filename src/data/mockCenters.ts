/**
 * Centros (universidades / escuelas) que imparten cada máster.
 * Estructura serializable para futuro Excel/Supabase.
 *
 * Para cada máster declaramos un listado de centros con su tipo,
 * ubicación, precio anual y duración.
 */

export interface MasterCenter {
  /** Nombre completo del centro o universidad. */
  name: string;
  /** Siglas o nombre corto (opcional). */
  shortName?: string;
  /** "Público" | "Privado". */
  type: string;
  /** Ciudad, país. */
  location: string;
  /** Precio anual mostrado tal cual. */
  price: string;
  /** Duración del programa. */
  duration: string;
}

/**
 * Mapa de máster → listado de centros donde se imparte.
 * Los nombres de máster deben coincidir con los de `mockReviewsByMaster`.
 */
export const mockCentersByMaster: Record<string, MasterCenter[]> = {
  "Máster en Data Science": [
    { name: "Universidad Politécnica de Madrid", shortName: "UPM", type: "Público", location: "Madrid, España", price: "4.500 €", duration: "1 año" },
    { name: "Universidad Carlos III de Madrid", shortName: "UC3M", type: "Público", location: "Madrid, España", price: "4.200 €", duration: "1 año" },
    { name: "Universidad Complutense de Madrid", shortName: "UCM", type: "Público", location: "Madrid, España", price: "3.900 €", duration: "1 año" },
    { name: "Universidad Autónoma de Madrid", shortName: "UAM", type: "Público", location: "Madrid, España", price: "4.100 €", duration: "1 año" },
    { name: "IE University", shortName: "IE", type: "Privado", location: "Madrid, España", price: "32.000 €", duration: "1 año" },
  ],
  "Máster en Inteligencia Artificial": [
    { name: "Universitat Politècnica de Catalunya", shortName: "UPC", type: "Público", location: "Barcelona, España", price: "5.200 €", duration: "2 años" },
    { name: "Universitat de Barcelona", shortName: "UB", type: "Público", location: "Barcelona, España", price: "4.800 €", duration: "2 años" },
    { name: "Universitat Pompeu Fabra", shortName: "UPF", type: "Público", location: "Barcelona, España", price: "4.900 €", duration: "1,5 años" },
    { name: "Barcelona School of AI", shortName: "BSAI", type: "Privado", location: "Barcelona, España", price: "8.900 €", duration: "2 años" },
  ],
  "Máster en Marketing Digital": [
    { name: "Universitat de València", shortName: "UV", type: "Público", location: "Valencia, España", price: "3.200 €", duration: "1 año" },
    { name: "Universitat Politècnica de València", shortName: "UPV", type: "Público", location: "Valencia, España", price: "3.400 €", duration: "1 año" },
    { name: "ESIC Business School", shortName: "ESIC", type: "Privado", location: "Valencia, España", price: "12.500 €", duration: "1 año" },
  ],
  "Máster en Finanzas Internacionales": [
    { name: "Universidade NOVA de Lisboa", shortName: "NOVA", type: "Privado", location: "Lisboa, Portugal", price: "6.000 €", duration: "1,5 años" },
    { name: "Universidade Católica Portuguesa", shortName: "UCP", type: "Privado", location: "Lisboa, Portugal", price: "8.500 €", duration: "1,5 años" },
    { name: "ISCTE Business School", shortName: "ISCTE", type: "Privado", location: "Lisboa, Portugal", price: "7.200 €", duration: "1 año" },
  ],
  "Máster en Ingeniería de Software": [
    { name: "Universidad de Sevilla", shortName: "US", type: "Público", location: "Sevilla, España", price: "4.800 €", duration: "2 años" },
    { name: "Universidad Pablo de Olavide", shortName: "UPO", type: "Público", location: "Sevilla, España", price: "4.300 €", duration: "2 años" },
    { name: "Universidad de Málaga", shortName: "UMA", type: "Público", location: "Málaga, España", price: "4.500 €", duration: "2 años" },
  ],
  "Máster en Gestión Empresarial": [
    { name: "Technische Universität München", shortName: "TUM", type: "Privado", location: "Múnich, Alemania", price: "12.000 €", duration: "2 años" },
    { name: "Ludwig-Maximilians-Universität München", shortName: "LMU", type: "Privado", location: "Múnich, Alemania", price: "10.500 €", duration: "2 años" },
    { name: "Munich Business School", shortName: "MBS", type: "Privado", location: "Múnich, Alemania", price: "24.000 €", duration: "2 años" },
  ],
};

/**
 * Devuelve los centros de un máster. Si no hay datos definidos, sintetiza
 * un único centro a partir del propio nombre del máster.
 */
export const getCentersForMaster = (masterName: string, fallback?: { type: string; location: string; price: string; duration: string }): MasterCenter[] => {
  const list = mockCentersByMaster[masterName];
  if (list && list.length > 0) return list;
  if (!fallback) return [];
  return [
    {
      name: `Centro impartidor`,
      type: fallback.type,
      location: fallback.location,
      price: fallback.price,
      duration: fallback.duration,
    },
  ];
};
