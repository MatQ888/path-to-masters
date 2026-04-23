import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Euro, Building2, ArrowLeft, Clock, Bookmark } from "lucide-react";
import { mockReviewsByMaster, Review } from "@/data/mockReviews";
import ReviewsListing from "@/components/ReviewsListing";
import ReviewDetail from "@/components/ReviewDetail";
import { useLibrary } from "@/hooks/useLibrary";
import { toast } from "sonner";

interface ResultsProps {
  answers: Record<string, string>;
  onBack: () => void;
}

const mockMasters = [
  { name: "Máster en Data Science", location: "Madrid, España", price: "4.500 €", type: "Público", duration: "1 año" },
  { name: "Máster en Inteligencia Artificial", location: "Barcelona, España", price: "8.900 €", type: "Privado", duration: "2 años" },
  { name: "Máster en Marketing Digital", location: "Valencia, España", price: "3.200 €", type: "Público", duration: "1 año" },
  { name: "Máster en Finanzas Internacionales", location: "Lisboa, Portugal", price: "6.000 €", type: "Privado", duration: "1,5 años" },
  { name: "Máster en Ingeniería de Software", location: "Sevilla, España", price: "4.800 €", type: "Público", duration: "2 años" },
  { name: "Máster en Gestión Empresarial", location: "Múnich, Alemania", price: "12.000 €", type: "Privado", duration: "2 años" },
];

type View = "list" | "reviews" | "detail";

const Results = ({ answers, onBack }: ResultsProps) => {
  const [view, setView] = useState<View>("list");
  const [selectedMasterName, setSelectedMasterName] = useState<string>("");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const { isSaved, toggle } = useLibrary();

  const isPublic = answers.sector === "Público";
  const filtered = mockMasters.filter((m) =>
    isPublic ? m.type === "Público" : m.type === "Privado"
  );
  const results = filtered.length > 0 ? filtered : mockMasters.slice(0, 3);

  const handleViewMore = (masterName: string) => {
    setSelectedMasterName(masterName);
    setView("reviews");
  };

  const handleSelectReview = (review: Review) => {
    setSelectedReview(review);
    setView("detail");
  };

  if (view === "detail" && selectedReview) {
    return (
      <ReviewDetail
        review={selectedReview}
        masterName={selectedMasterName}
        onBack={() => {
          setSelectedReview(null);
          setView("reviews");
        }}
      />
    );
  }

  if (view === "reviews") {
    const reviews = mockReviewsByMaster[selectedMasterName] || [];
    return (
      <ReviewsListing
        masterName={selectedMasterName}
        reviews={reviews}
        onBack={() => setView("list")}
        onSelectReview={handleSelectReview}
      />
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
          {results.map((master, i) => {
            const saved = isSaved(master.name);
            const handleBookmark = (e: React.MouseEvent) => {
              e.stopPropagation();
              const isNowSaved = toggle({
                id: master.name,
                name: master.name,
                location: master.location,
                price: master.price,
                type: master.type,
                duration: master.duration,
              });
              toast(isNowSaved ? "Guardado en tu Biblioteca" : "Eliminado de tu Biblioteca");
            };
            return (
              <div key={i} className="bg-card rounded-2xl card-shadow p-6 md:p-8 hover:card-shadow-hover transition-all duration-300 border border-border">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-xl font-semibold text-foreground">{master.name}</h3>
                      <button
                        type="button"
                        onClick={handleBookmark}
                        aria-label={saved ? "Quitar de la Biblioteca" : "Guardar en la Biblioteca"}
                        aria-pressed={saved}
                        className={`shrink-0 rounded-full p-2 transition-colors md:hidden ${
                          saved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-accent"
                        }`}
                      >
                        <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {master.location}</span>
                      <span className="flex items-center gap-1.5"><Euro className="h-4 w-4" /> {master.price}</span>
                      <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {master.type}</span>
                      <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {master.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleBookmark}
                      aria-label={saved ? "Quitar de la Biblioteca" : "Guardar en la Biblioteca"}
                      aria-pressed={saved}
                      className={`hidden md:inline-flex rounded-full p-2 transition-colors ${
                        saved ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-accent"
                      }`}
                    >
                      <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
                    </button>
                    <Button variant="cta" className="rounded-xl" onClick={() => handleViewMore(master.name)}>Ver más</Button>
                  </div>
                </div>
              </div>
            );
          })}
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
