import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Euro, Building2, ArrowLeft, Briefcase, Globe, DollarSign, Heart, Clock, MessageSquare, Target } from "lucide-react";

interface ResultsProps {
  answers: Record<string, string>;
  onBack: () => void;
}

const mockMasters = [
  {
    name: "Máster en Data Science",
    location: "Madrid, España",
    price: "4.500 €",
    type: "Público",
    companies: [
      { name: "Airbus", percent: 10 },
      { name: "AIRNOVA", percent: 40 },
      { name: "Telefónica", percent: 25 },
      { name: "Accenture", percent: 25 },
    ],
    studyLocation: { abroad: 10, national: 80, twoMonthsAbroad: 10 },
    salary: { beginner: 1500, mid: 3600, advance: 9000 },
    quality: { stress: 70, freeTime: 30 },
    duration: "1 año",
    experiences: [
      "Excelente contenido práctico, los profesores son muy accesibles.",
      "Muy intenso pero vale la pena. Las prácticas en empresa son el punto fuerte.",
      "Buen máster, aunque el primer trimestre es muy teórico.",
    ],
    dafo: {
      fortalezas: ["Prestigio internacional", "Profesorado de alto nivel", "Prácticas garantizadas"],
      debilidades: ["Carga de trabajo elevada", "Pocas plazas disponibles"],
      oportunidades: ["Alta demanda en el mercado laboral", "Conexiones con grandes empresas"],
    },
  },
  {
    name: "Máster en Inteligencia Artificial",
    location: "Barcelona, España",
    price: "8.900 €",
    type: "Privado",
    companies: [
      { name: "Google", percent: 15 },
      { name: "Meta", percent: 20 },
      { name: "Amazon", percent: 30 },
      { name: "Startup local", percent: 35 },
    ],
    studyLocation: { abroad: 20, national: 60, twoMonthsAbroad: 20 },
    salary: { beginner: 1800, mid: 4200, advance: 11000 },
    quality: { stress: 80, freeTime: 20 },
    duration: "2 años",
    experiences: [
      "Increíble programa, muy orientado a la investigación.",
      "Los proyectos finales son realmente desafiantes.",
    ],
    dafo: {
      fortalezas: ["Investigación puntera", "Laboratorios equipados"],
      debilidades: ["Precio elevado", "Muy exigente"],
      oportunidades: ["Sector en crecimiento exponencial", "Posibilidad de doctorado"],
    },
  },
  {
    name: "Máster en Marketing Digital",
    location: "Valencia, España",
    price: "3.200 €",
    type: "Público",
    companies: [
      { name: "Coca-Cola", percent: 15 },
      { name: "L'Oréal", percent: 25 },
      { name: "Agencia local", percent: 60 },
    ],
    studyLocation: { abroad: 5, national: 90, twoMonthsAbroad: 5 },
    salary: { beginner: 1300, mid: 3000, advance: 7000 },
    quality: { stress: 40, freeTime: 55 },
    duration: "1 año",
    experiences: [
      "Muy práctico y con buen ambiente entre compañeros.",
      "Ideal si quieres emprender en marketing.",
    ],
    dafo: {
      fortalezas: ["Precio asequible", "Enfoque práctico"],
      debilidades: ["Menos reconocimiento internacional"],
      oportunidades: ["Sector digital en expansión"],
    },
  },
  {
    name: "Máster en Finanzas Internacionales",
    location: "Lisboa, Portugal",
    price: "6.000 €",
    type: "Privado",
    companies: [
      { name: "JPMorgan", percent: 10 },
      { name: "Deloitte", percent: 30 },
      { name: "KPMG", percent: 30 },
      { name: "Banco local", percent: 30 },
    ],
    studyLocation: { abroad: 30, national: 50, twoMonthsAbroad: 20 },
    salary: { beginner: 1600, mid: 3800, advance: 9500 },
    quality: { stress: 65, freeTime: 35 },
    duration: "1,5 años",
    experiences: [
      "Excelente networking internacional.",
      "Lisboa es una ciudad perfecta para estudiantes.",
    ],
    dafo: {
      fortalezas: ["Red internacional de contactos", "Ciudad asequible"],
      debilidades: ["Idioma puede ser barrera"],
      oportunidades: ["Hub fintech europeo en crecimiento"],
    },
  },
  {
    name: "Máster en Ingeniería de Software",
    location: "Sevilla, España",
    price: "4.800 €",
    type: "Público",
    companies: [
      { name: "Airbus", percent: 20 },
      { name: "Everis", percent: 35 },
      { name: "Indra", percent: 25 },
      { name: "Startup", percent: 20 },
    ],
    studyLocation: { abroad: 15, national: 75, twoMonthsAbroad: 10 },
    salary: { beginner: 1500, mid: 3600, advance: 9000 },
    quality: { stress: 60, freeTime: 35 },
    duration: "2 años",
    experiences: [
      "Buen equilibrio entre teoría y práctica.",
      "Las instalaciones son modernas y el profesorado muy competente.",
    ],
    dafo: {
      fortalezas: ["Buena relación calidad-precio", "Profesorado investigador"],
      debilidades: ["Ciudad con menos oportunidades que Madrid/Barcelona"],
      oportunidades: ["Sector tech en expansión en Andalucía"],
    },
  },
  {
    name: "Máster en Gestión Empresarial",
    location: "Múnich, Alemania",
    price: "12.000 €",
    type: "Privado",
    companies: [
      { name: "BMW", percent: 20 },
      { name: "Siemens", percent: 25 },
      { name: "McKinsey", percent: 15 },
      { name: "SAP", percent: 40 },
    ],
    studyLocation: { abroad: 40, national: 40, twoMonthsAbroad: 20 },
    salary: { beginner: 2200, mid: 5000, advance: 12000 },
    quality: { stress: 75, freeTime: 25 },
    duration: "2 años",
    experiences: [
      "Experiencia transformadora, el nivel es altísimo.",
      "Vivir en Alemania te abre muchas puertas profesionales.",
    ],
    dafo: {
      fortalezas: ["Prestigio mundial", "Acceso a empresas alemanas top"],
      debilidades: ["Coste de vida alto", "Idioma alemán necesario"],
      oportunidades: ["Economía más fuerte de Europa", "Alta empleabilidad"],
    },
  },
];

const Results = ({ answers, onBack }: ResultsProps) => {
  const [selectedMaster, setSelectedMaster] = useState<number | null>(null);

  const isPublic = answers.sector === "Público";
  const filtered = mockMasters.filter((m) =>
    isPublic ? m.type === "Público" : m.type === "Privado"
  );
  const results = filtered.length > 0 ? filtered : mockMasters.slice(0, 3);

  if (selectedMaster !== null) {
    const master = results[selectedMaster];
    return (
      <section className="min-h-screen bg-secondary/50 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <button onClick={() => setSelectedMaster(null)} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver a recomendaciones
          </button>

          <div className="text-center space-y-3 mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">{master.name}</h2>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {master.location}</span>
              <span className="flex items-center gap-1.5"><Euro className="h-4 w-4" /> {master.price}</span>
              <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {master.type}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {master.duration}</span>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Company Opportunities */}
            <div className="bg-card rounded-2xl card-shadow p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-primary" /> Oportunidades con empresas
              </h3>
              <div className="space-y-3">
                {master.companies.map((c, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm font-medium w-32 shrink-0">{c.name}</span>
                    <div className="flex-1 bg-secondary rounded-full h-6 overflow-hidden">
                      <div className="bg-primary h-full rounded-full flex items-center justify-end pr-2 transition-all" style={{ width: `${c.percent}%` }}>
                        <span className="text-xs font-bold text-primary-foreground">{c.percent}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Study Location */}
            <div className="bg-card rounded-2xl card-shadow p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-primary" /> Lugar de estudios
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-foreground">{master.studyLocation.national}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Estudios nacionales</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-foreground">{master.studyLocation.abroad}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Posibilidad de irse fuera</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4">
                  <p className="text-3xl font-bold text-foreground">{master.studyLocation.twoMonthsAbroad}%</p>
                  <p className="text-sm text-muted-foreground mt-1">Nacional + 2 meses fuera</p>
                </div>
              </div>
            </div>

            {/* Salary */}
            <div className="bg-card rounded-2xl card-shadow p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5 text-primary" /> Dinero medio al salir
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">🟢 Beginner (novato)</p>
                  <p className="text-2xl font-bold text-foreground">{master.salary.beginner.toLocaleString()} €</p>
                  <p className="text-xs text-muted-foreground">/mes</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">🟡 Mid (4-7 años)</p>
                  <p className="text-2xl font-bold text-foreground">{master.salary.mid.toLocaleString()} €</p>
                  <p className="text-xs text-muted-foreground">/mes</p>
                </div>
                <div className="bg-secondary/50 rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">🔴 Advance (10-12 años)</p>
                  <p className="text-2xl font-bold text-foreground">{master.salary.advance.toLocaleString()} €</p>
                  <p className="text-xs text-muted-foreground">/mes</p>
                </div>
              </div>
            </div>

            {/* Quality of Life */}
            <div className="bg-card rounded-2xl card-shadow p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-primary" /> Calidad de vida del máster
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Nivel de estrés</span>
                    <span className="font-medium">{master.quality.stress}%</span>
                  </div>
                  <div className="bg-secondary rounded-full h-4 overflow-hidden">
                    <div className="h-full rounded-full transition-all bg-destructive/70" style={{ width: `${master.quality.stress}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Tiempo libre durante el máster</span>
                    <span className="font-medium">{master.quality.freeTime}%</span>
                  </div>
                  <div className="bg-secondary rounded-full h-4 overflow-hidden">
                    <div className="h-full rounded-full transition-all bg-primary" style={{ width: `${master.quality.freeTime}%` }} />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-3 flex items-center gap-1">
                <Clock className="h-4 w-4" /> Duración: {master.duration}
              </p>
            </div>

            {/* Past Experiences */}
            <div className="bg-card rounded-2xl card-shadow p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <MessageSquare className="h-5 w-5 text-primary" /> Experiencias de otros estudiantes
              </h3>
              <div className="space-y-3">
                {master.experiences.map((exp, i) => (
                  <div key={i} className="bg-secondary/50 rounded-xl p-4">
                    <p className="text-sm text-foreground italic">"{exp}"</p>
                    <p className="text-xs text-muted-foreground mt-2">— Estudiante anónimo</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DAFO */}
            <div className="bg-card rounded-2xl card-shadow p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" /> Análisis DAFO
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-500/10 rounded-xl p-4">
                  <h4 className="font-semibold text-sm mb-2">💪 Fortalezas</h4>
                  <ul className="space-y-1">
                    {master.dafo.fortalezas.map((f, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {f}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-500/10 rounded-xl p-4">
                  <h4 className="font-semibold text-sm mb-2">⚠️ Debilidades</h4>
                  <ul className="space-y-1">
                    {master.dafo.debilidades.map((d, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {d}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-500/10 rounded-xl p-4">
                  <h4 className="font-semibold text-sm mb-2">🚀 Oportunidades</h4>
                  <ul className="space-y-1">
                    {master.dafo.oportunidades.map((o, i) => (
                      <li key={i} className="text-sm text-muted-foreground">• {o}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-secondary/50 py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>

        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">Tus recomendaciones</h2>
          <p className="text-muted-foreground text-lg">
            Basadas en tu perfil: {answers.presupuesto} · {answers.lugar} · {answers.sector}
          </p>
        </div>

        <div className="space-y-4">
          {results.map((master, i) => (
            <div key={i} className="bg-card rounded-2xl card-shadow p-6 md:p-8 hover:card-shadow-hover transition-all duration-300 border border-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">{master.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {master.location}</span>
                    <span className="flex items-center gap-1.5"><Euro className="h-4 w-4" /> {master.price}</span>
                    <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {master.type}</span>
                  </div>
                </div>
                <Button variant="cta" className="shrink-0 rounded-xl" onClick={() => setSelectedMaster(i)}>Ver más</Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">¿No encuentras lo que buscas?</p>
          <Button variant="outline" onClick={onBack}>Repetir cuestionario</Button>
        </div>
      </div>
    </section>
  );
};

export default Results;
