export const sectorOptions = [
  {
    id: "ingenieria",
    label: "Ingeniería y Tecnología",
    icon: "🔧",
    description: "Aeroespacial, IA, datos, robótica y más",
  },
  {
    id: "sociales",
    label: "Ciencias Sociales y Jurídicas",
    icon: "⚖️",
    description: "Derecho, MBA, finanzas, marketing",
  },
  {
    id: "artes",
    label: "Artes y Humanidades",
    icon: "🎨",
    description: "Filosofía, historia, literatura, traducción",
  },
  {
    id: "salud",
    label: "Ciencias de la Salud",
    icon: "🩺",
    description: "Psicología, enfermería, biomedicina",
  },
];

export const mastersBySector: Record<string, string[]> = {
  ingenieria: [
    "Máster en Ingeniería Aeroespacial",
    "Máster en Inteligencia Artificial",
    "Máster en Ciencia de Datos",
    "Máster en Ingeniería Industrial",
    "Máster en Ingeniería Informática",
    "Máster en Robótica",
    "Máster en Energías Renovables",
    "Máster en Telecomunicaciones",
    "Máster en Big Data",
  ],
  sociales: [
    "Máster en Derecho",
    "Máster en Abogacía",
    "Máster en Marketing Digital",
    "Máster en Administración de Empresas (MBA)",
    "Máster en Finanzas",
    "Máster en Recursos Humanos",
    "Máster en Relaciones Internacionales",
    "Máster en Economía",
  ],
  artes: [
    "Máster en Filosofía",
    "Máster en Historia",
    "Máster en Literatura",
    "Máster en Estudios Culturales",
    "Máster en Traducción",
    "Máster en Lingüística",
    "Máster en Profesorado",
  ],
  salud: [
    "Máster en Psicología",
    "Máster en Psicología Clínica",
    "Máster en Enfermería",
    "Máster en Salud Pública",
    "Máster en Nutrición",
    "Máster en Biomedicina",
    "Máster en Farmacia",
  ],
};

export function searchMasters(sector: string, query: string): string[] {
  const masters = mastersBySector[sector] || [];
  if (!query.trim()) return masters.slice(0, 5);

  const q = query.toLowerCase();
  const scored = masters
    .map((m) => {
      const lower = m.toLowerCase();
      const startsWith = lower.includes(q) ? (lower.indexOf(q) === 0 ? 3 : 2) : 0;
      const words = q.split(/\s+/).filter(Boolean);
      const wordMatch = words.filter((w) => lower.includes(w)).length;
      return { name: m, score: startsWith + wordMatch };
    })
    .filter((m) => m.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((m) => m.name);

  return scored;
}
