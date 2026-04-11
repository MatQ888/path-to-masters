import { Button } from "@/components/ui/button";
import { MapPin, Euro, Building2, ArrowLeft } from "lucide-react";

interface ResultsProps {
  answers: Record<string, string>;
  onBack: () => void;
}

const mockMasters = [
  { name: "Máster en Data Science", location: "Madrid, España", price: "4.500 €", type: "Público" },
  { name: "Máster en Inteligencia Artificial", location: "Barcelona, España", price: "8.900 €", type: "Privado" },
  { name: "Máster en Marketing Digital", location: "Valencia, España", price: "3.200 €", type: "Público" },
  { name: "Máster en Finanzas Internacionales", location: "Lisboa, Portugal", price: "6.000 €", type: "Privado" },
  { name: "Máster en Ingeniería de Software", location: "Sevilla, España", price: "4.800 €", type: "Público" },
  { name: "Máster en Gestión Empresarial", location: "Múnich, Alemania", price: "12.000 €", type: "Privado" },
];

const Results = ({ answers, onBack }: ResultsProps) => {
  // Simple simulated filtering
  const isPublic = answers.sector === "Público";
  const filtered = mockMasters.filter((m) =>
    isPublic ? m.type === "Público" : m.type === "Privado"
  );
  const results = filtered.length > 0 ? filtered : mockMasters.slice(0, 3);

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
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> {master.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Euro className="h-4 w-4" /> {master.price}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-4 w-4" /> {master.type}
                    </span>
                  </div>
                </div>
                <Button variant="cta" className="shrink-0 rounded-xl">Ver más</Button>
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
