import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MapPin, Euro, Building2, ArrowLeft, Clock } from "lucide-react";
import { mockReviewsByMaster, Review } from "@/data/mockReviews";
import { getCentersForMaster, MasterCenter } from "@/data/mockCenters";
import CentersListing from "@/components/CentersListing";
import ReviewsListing from "@/components/ReviewsListing";
import ReviewDetail from "@/components/ReviewDetail";
import { tQuestionnaireOption } from "@/lib/i18nData";

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

type View = "list" | "centers" | "reviews" | "detail";

const Results = ({ answers, onBack }: ResultsProps) => {
  const { t } = useTranslation();
  const [view, setView] = useState<View>("list");
  const [selectedMasterName, setSelectedMasterName] = useState<string>("");
  const [selectedCenter, setSelectedCenter] = useState<MasterCenter | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const isPublic = answers.sector === "Público";
  const filtered = mockMasters.filter((m) =>
    isPublic ? m.type === "Público" : m.type === "Privado"
  );
  const results = filtered.length > 0 ? filtered : mockMasters.slice(0, 3);

  // Nivel 1 → Nivel 2: del listado de másters al listado de centros.
  const handleViewMore = (masterName: string, fallback: typeof mockMasters[number]) => {
    setSelectedMasterName(masterName);
    setSelectedCenter(null);
    setView("centers");
    // Pre-cargamos el fallback para getCentersForMaster si fuese necesario.
    void fallback;
  };

  // Nivel 2 → Nivel 3: del centro elegido al listado de opiniones.
  const handleSelectCenter = (center: MasterCenter) => {
    setSelectedCenter(center);
    setView("reviews");
  };

  const handleSelectReview = (review: Review) => {
    setSelectedReview(review);
    setView("detail");
  };

  // Nivel 3 (detalle de una reseña).
  if (view === "detail" && selectedReview) {
    return (
      <ReviewDetail
        review={selectedReview}
        masterName={selectedMasterName}
        centerName={selectedCenter?.name}
        onBack={() => {
          setSelectedReview(null);
          setView("reviews");
        }}
      />
    );
  }

  // Nivel 3 (listado de opiniones del centro elegido).
  if (view === "reviews") {
    const reviews = mockReviewsByMaster[selectedMasterName] || [];
    const cleanName = selectedMasterName.replace(/^M[áa]ster en\s*/i, "").trim();
    const headingName = selectedCenter
      ? `Máster en ${cleanName} en ${selectedCenter.name}`
      : selectedMasterName;
    return (
      <ReviewsListing
        masterName={headingName}
        reviews={reviews}
        onBack={() => setView("centers")}
        onSelectReview={handleSelectReview}
      />
    );
  }

  // Nivel 2: listado de centros.
  if (view === "centers") {
    const fallback = results.find((m) => m.name === selectedMasterName);
    const centers = getCentersForMaster(selectedMasterName, fallback);
    return (
      <CentersListing
        masterName={selectedMasterName}
        centers={centers}
        onBack={() => setView("list")}
        onSelectCenter={handleSelectCenter}
      />
    );
  }

  return (
    <section className="min-h-screen bg-secondary/50 py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> {t("common.back")}
        </button>

        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{t("results.title")}</h2>
          <p className="text-muted-foreground text-lg">
            {t("results.subtitleBase")} {answers.presupuesto} · {tQuestionnaireOption(answers.lugar || "")} · {tQuestionnaireOption(answers.sector || "")}
          </p>
        </div>

        <div className="space-y-4">
          {results.map((master, i) => (
            <div key={i} className="bg-card rounded-2xl card-shadow p-6 md:p-8 hover:card-shadow-hover transition-all duration-300 border border-border">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <h3 className="text-xl font-semibold text-foreground">{master.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {master.location}</span>
                    <span className="flex items-center gap-1.5"><Euro className="h-4 w-4" /> {master.price}</span>
                    <span className="flex items-center gap-1.5"><Building2 className="h-4 w-4" /> {master.type}</span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {master.duration}</span>
                  </div>
                </div>
                <Button
                  variant="cta"
                  className="rounded-xl shrink-0"
                  onClick={() => handleViewMore(master.name, master)}
                >
                  {t("results.viewMore")}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground mb-4">{t("results.notFound")}</p>
          <Button variant="outline" onClick={onBack}>{t("results.repeatQuestionnaire")}</Button>
        </div>
      </div>
    </section>
  );
};

export default Results;
