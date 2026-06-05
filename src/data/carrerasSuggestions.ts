export const carreraSectorOptions = [
  {
    id: "ingenieria",
    label: "Ingeniería y Tecnología",
    icon: "🔧",
    description: "Aeroespacial, industrial, informática, telecomunicaciones",
  },
  {
    id: "sociales",
    label: "Ciencias Sociales y Jurídicas",
    icon: "⚖️",
    description: "Derecho, ADE, economía, marketing",
  },
  {
    id: "artes",
    label: "Artes y Humanidades",
    icon: "🎨",
    description: "Bellas artes, historia, filosofía, periodismo",
  },
  {
    id: "salud",
    label: "Ciencias de la Salud",
    icon: "🩺",
    description: "Medicina, enfermería, fisioterapia, farmacia",
  },
];

export const carrerasBySector: Record<string, string[]> = {
  ingenieria: [
    "Grado en Ingeniería Aeroespacial",
    "Grado en Ingeniería Informática",
    "Grado en Ingeniería de Telecomunicaciones",
    "Grado en Ingeniería Industrial",
    "Grado en Ingeniería Mecánica",
    "Grado en Ingeniería Eléctrica",
    "Grado en Ingeniería Electrónica",
    "Grado en Ingeniería Civil",
    "Grado en Ingeniería Química",
    "Grado en Ingeniería de Materiales",
    "Grado en Ingeniería Biomédica",
    "Grado en Ingeniería de Sistemas",
    "Grado en Ingeniería Robótica",
    "Grado en Ciencias de la Computación",
    "Grado en Matemáticas",
    "Grado en Física",
    "Grado en Química",
    "Grado en Biotecnología",
    "Grado en Arquitectura",
    "Grado en Arquitectura Técnica",
  ],
  sociales: [
    "Grado en Derecho",
    "Grado en Administración y Dirección de Empresas (ADE)",
    "Grado en Economía",
    "Grado en Finanzas y Contabilidad",
    "Grado en Marketing",
    "Grado en Relaciones Laborales",
    "Grado en Recursos Humanos",
    "Grado en Relaciones Internacionales",
    "Grado en Criminología",
    "Grado en Ciencias Políticas",
    "Grado en Sociología",
    "Grado en Trabajo Social",
    "Grado en Turismo",
    "Grado en Publicidad y Relaciones Públicas",
    "Grado en Comunicación Audiovisual",
    "Grado en Periodismo",
    "Grado en Comercio Internacional",
    "Grado en Gestión y Administración Pública",
  ],
  artes: [
    "Grado en Bellas Artes",
    "Grado en Historia",
    "Grado en Historia del Arte",
    "Grado en Filosofía",
    "Grado en Filología Hispánica",
    "Grado en Filología Inglesa",
    "Grado en Traducción e Interpretación",
    "Grado en Lenguas Modernas",
    "Grado en Educación Primaria",
    "Grado en Educación Infantil",
    "Grado en Pedagogía",
    "Grado en Diseño",
    "Grado en Diseño Gráfico",
    "Grado en Música",
    "Grado en Teatro",
    "Grado en Geografía",
    "Grado en Arqueología",
    "Grado en Ciencias de la Información",
  ],
  salud: [
    "Grado en Medicina",
    "Grado en Enfermería",
    "Grado en Fisioterapia",
    "Grado en Farmacia",
    "Grado en Odontología",
    "Grado en Veterinaria",
    "Grado en Psicología",
    "Grado en Nutrición y Dietética",
    "Grado en Terapia Ocupacional",
    "Grado en Logopedia",
    "Grado en Óptica y Optometría",
    "Grado en Podología",
    "Grado en Ciencias Biomédicas",
    "Grado en Biología",
    "Grado en Bioquímica",
    "Grado en Ciencias Ambientales",
    "Grado en Radiología",
    "Grado en Ciencias de la Actividad Física y el Deporte (CAFYD)",
  ],
};

export function searchCarreras(sector: string, query: string): string[] {
  const carreras = carrerasBySector[sector] || [];
  if (!query.trim()) return carreras.slice(0, 5);
  const q = query.toLowerCase();
  const scored = carreras
    .map((c) => {
      const lower = c.toLowerCase();
      const startsWith = lower.includes(q) ? (lower.indexOf(q) === 0 ? 3 : 2) : 0;
      const words = q.split(/\s+/).filter(Boolean);
      const wordMatch = words.filter((w) => lower.includes(w)).length;
      return { name: c, score: startsWith + wordMatch };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((c) => c.name);
  return scored;
}