import { SupabaseReview } from "@/hooks/useReviews";
import { Review } from "@/data/mockReviews";
import { tCountryByCode } from "@/lib/i18nData";
import { empleabilidadLevels } from "@/components/GiveInfoForm";

export interface ReviewSummary {
  location: string;
  price: string;
  type: string;
  duration: string;
}

export interface CompanyStat {
  name: string;
  percent: number;
}

type ReviewPredicate = (review: SupabaseReview) => boolean;

// answers.sectorAcademico (id de sectorOptions) -> SupabaseReview.especialidad
const especialidadBySector: Record<string, string> = {
  ingenieria: "Ingeniería y Tecnología",
  sociales: "Ciencias sociales y jurídicas",
  artes: "Artes y humanidades",
  salud: "Ciencias de la salud",
};

// answers.tipoEstudio -> prefijo esperado en SupabaseReview.programa
const programaPrefixByTipo: Record<string, string> = {
  "Carrera Universitaria": "Grado en",
  "Máster": "Máster en",
};

// Genera un id numérico estable a partir del uuid de Supabase, ya que
// Review.id es number pero las filas reales usan uuid (string).
const hashId = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
};

const formatLocation = (sr: Pick<SupabaseReview, "ciudad" | "pais">): string => {
  const country = sr.pais ? tCountryByCode(sr.pais) : "";
  if (sr.ciudad && country) return `${sr.ciudad}, ${country}`;
  return sr.ciudad || country || "No especificado";
};

const formatPrice = (inversion: number | null): string =>
  inversion != null ? `${inversion.toLocaleString("es-ES")} €` : "No especificado";

const formatDuration = (years: number | null): string =>
  years != null ? `${years} año${years === 1 ? "" : "s"}` : "No especificado";

/**
 * Resume un grupo de reseñas (mismo programa o mismo centro) en los campos
 * usados por las tarjetas de Nivel 1/2. Si se pasa `preferredSector`, prioriza
 * una reseña de ese sector para que la tarjeta case con el filtro aplicado.
 */
export const summarizeReviews = (
  reviews: SupabaseReview[],
  preferredSector?: string,
): ReviewSummary => {
  const pick =
    (preferredSector && reviews.find((r) => r.sector === preferredSector)) || reviews[0];
  if (!pick) {
    return { location: "No especificado", price: "No especificado", type: "", duration: "No especificado" };
  }
  return {
    location: formatLocation(pick),
    price: formatPrice(pick.inversion),
    type: pick.sector || "",
    duration: formatDuration(pick.duracion_oficial),
  };
};

/**
 * Calcula, para un conjunto de reseñas de un mismo programa, en qué
 * porcentaje de esas reseñas aparece cada empresa mencionada en `experiencia`.
 * Debe recibir todas las reseñas del programa (no solo las de un centro) para
 * que el porcentaje se actualice solo según entren más reseñas.
 */
export const computeCompanyStats = (reviews: SupabaseReview[]): CompanyStat[] => {
  const total = reviews.length;
  if (total === 0) return [];

  const counts = new Map<string, number>();
  for (const review of reviews) {
    const names = new Set(
      (review.experiencia || [])
        .map((e) => e.empresa?.trim())
        .filter((name): name is string => !!name),
    );
    names.forEach((name) => counts.set(name, (counts.get(name) ?? 0) + 1));
  }

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, percent: Math.round((count / total) * 100) }))
    .sort((a, b) => b.percent - a.percent);
};

/**
 * Convierte una reseña de Supabase al tipo `Review` que consumen
 * ReviewsListing/ReviewDetail. Campos sin fuente de datos real todavía
 * (rating, dificultad, prácticas, networking, salario, DAFO) quedan en un
 * valor neutro/"No especificado" en vez de inventarse.
 */
export const supabaseReviewToReview = (sr: SupabaseReview, companies: CompanyStat[]): Review => {
  const empleabilidadLabel =
    sr.empleabilidad != null && sr.empleabilidad >= 0 && sr.empleabilidad < empleabilidadLevels.length
      ? empleabilidadLevels[sr.empleabilidad]
      : "No especificado";

  return {
    id: hashId(sr.id),
    userName: sr.apodo || "Anónimo",
    // Sin sistema de valoraciones todavía: las estrellas vendrán de votos de
    // otros usuarios (tabla `ratings`, pendiente). 0 = placeholder neutro.
    rating: 0,
    date: sr.published_at || sr.created_at || new Date().toISOString(),
    summary: sr.comentarios || "",
    fullComment: sr.comentarios || "",
    especialidad: sr.especialidad || "",
    sector: sr.sector || "",
    ubicacion: formatLocation(sr),
    centro: sr.centro || undefined,
    formato: sr.formato || "",
    idiomas: sr.idiomas || "",
    duracion: formatDuration(sr.duracion_oficial),
    tiempoReal: sr.tiempo_real ?? undefined,
    linkPrograma: sr.link_programa || undefined,
    linkCentro: sr.link_centro || undefined,
    precioAnual: formatPrice(sr.inversion),
    dificultad: "No especificado",
    asistencia: sr.asistencia || "",
    estres: sr.estres != null ? Math.round((sr.estres / 4) * 100) : 0,
    practicas: "No especificado",
    networking: "No especificado",
    empleabilidad: empleabilidadLabel,
    companies,
    salary: { beginner: 0, mid: 0, advance: 0 },
    dafo: { fortalezas: [], debilidades: [], oportunidades: [] },
  };
};

/**
 * Filtra las reseñas según las respuestas del cuestionario "Obtener
 * información".
 *
 * `sectorAcademico` (-> especialidad) es el filtro primario: siempre se
 * aplica si hay respuesta, y si deja 0 reseñas se devuelve `[]` directamente
 * (sin fallback), porque especialidad es un campo controlado y fiable.
 *
 * tipoEstudio, sectorPublicoPrivado, formatoEstudio y lugar son filtros
 * secundarios: se aplican uno a uno, en ese orden, sobre el resultado
 * acumulado, pero solo se conservan si no lo dejan en 0; si un filtro
 * secundario deja 0 resultados se descarta y se sigue con el siguiente.
 *
 * `masterBuscado` no se usa para filtrar: `programa` es texto libre que el
 * usuario escribe al dar información, así que nunca hace match fiable.
 */
export const filterReviewsByAnswers = (
  reviews: SupabaseReview[],
  answers: Record<string, string>,
): SupabaseReview[] => {
  let current = reviews;

  if (answers.sectorAcademico) {
    const especialidad = especialidadBySector[answers.sectorAcademico];
    if (especialidad) {
      current = current.filter((r) => r.especialidad === especialidad);
      if (current.length === 0) return [];
    }
  }

  const secondaryFilters: ReviewPredicate[] = [];

  if (answers.tipoEstudio) {
    const prefix = programaPrefixByTipo[answers.tipoEstudio];
    if (prefix) secondaryFilters.push((r) => !!r.programa?.startsWith(prefix));
  }

  if (answers.sectorPublicoPrivado) {
    const sector = answers.sectorPublicoPrivado;
    secondaryFilters.push((r) => r.sector === sector);
  }

  if (answers.formatoEstudio) {
    const formato = answers.formatoEstudio;
    secondaryFilters.push((r) => r.formato === formato);
  }

  if (answers.lugar === "Nacional") {
    secondaryFilters.push((r) => r.pais === "ES");
  } else if (answers.lugar === "Internacional") {
    secondaryFilters.push((r) => !!r.pais && r.pais !== "ES");
  }

  for (const test of secondaryFilters) {
    const narrowed = current.filter(test);
    if (narrowed.length > 0) current = narrowed;
  }

  return current;
};
