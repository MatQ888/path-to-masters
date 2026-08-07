import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MapPin, Euro, Building2, ArrowLeft, Clock, Loader2 } from "lucide-react";
import { Review } from "@/data/mockReviews";
import { MasterCenter } from "@/data/mockCenters";
import CentersListing from "@/components/CentersListing";
import ReviewsListing from "@/components/ReviewsListing";
import ReviewDetail from "@/components/ReviewDetail";
import { tQuestionnaireOption } from "@/lib/i18nData";
import { useReviews, groupByPrograma, groupByCentro } from "@/hooks/useReviews";
import {
  summarizeReviews,
  computeCompanyStats,
  supabaseReviewToReview,
  filterReviewsByAnswers,
  ReviewSummary,
} from "@/lib/reviewAdapter";

interface ResultsProps {
  answers: Record<string, string>;
  onBack: () => void;
}

type View = "list" | "centers" | "reviews" | "detail";

interface ProgramCard extends ReviewSummary {
  name: string;
}

const Results = ({ answers, onBack }: ResultsProps) => {
  const { t } = useTranslation();
  const { reviews, loading, error } = useReviews();
  const [view, setView] = useState<View>("list");
  const [selectedMasterName, setSelectedMasterName] = useState<string>("");
  const [selectedCenter, setSelectedCenter] = useState<MasterCenter | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Reseñas que cumplen las respuestas del cuestionario, con relajación
  // progresiva de prioridad (ver filterReviewsByAnswers). Nunca queda vacío
  // salvo que `reviews` en sí esté vacío.
  const filteredReviews = useMemo(
    () => filterReviewsByAnswers(reviews, answers),
    [reviews, answers],
  );

  // Nivel 1: una tarjeta por programa, agregando las reseñas ya filtradas.
  const results = useMemo<ProgramCard[]>(() => {
    const groups = groupByPrograma(filteredReviews);
    return Object.entries(groups).map(([programa, revs]) => ({
      name: programa,
      ...summarizeReviews(revs, answers.sectorPublicoPrivado),
    }));
  }, [filteredReviews, answers.sectorPublicoPrivado]);

  // Nivel 1 → Nivel 2: del listado de másters al listado de centros.
  const handleViewMore = (masterName: string) => {
    setSelectedMasterName(masterName);
    setSelectedCenter(null);
    setView("centers");
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

  if (loading) {
    return (
      <section className="min-h-screen bg-secondary/50 py-20 flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{t("common.loading")}</span>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen bg-secondary/50 py-20">
        <div className="container mx-auto px-4 max-w-3xl text-center space-y-4">
          <p className="text-muted-foreground">{error}</p>
          <Button variant="outline" onClick={onBack}>{t("common.back")}</Button>
        </div>
      </section>
    );
  }

  // Nivel 3 (detalle de una reseña).
  if (view === "detail" && selectedReview) {
    const programReviews = reviews.filter((r) => r.programa === selectedMasterName);
    const tiempos = programReviews
      .map((r) => r.tiempo_real)
      .filter((v): v is number => typeof v === "number" && v > 0);
    const tiempoMedio =
      tiempos.length > 0
        ? tiempos.reduce((a, b) => a + b, 0) / tiempos.length
        : null;
    return (
      <ReviewDetail
        review={selectedReview}
        masterName={selectedMasterName}
        centerName={selectedCenter?.name}
        tiempoMedio={tiempoMedio}
        onBack={() => {
          setSelectedReview(null);
          setView("reviews");
        }}
      />
    );
  }

  // Nivel 3 (listado de opiniones del centro elegido).
  if (view === "reviews") {
    const programReviews = reviews.filter((r) => r.programa === selectedMasterName);
    const centerReviews = programReviews.filter((r) => r.centro === selectedCenter?.name);
    // % de empresas calculado sobre TODAS las reseñas del programa, no solo
    // las del centro, para que se actualice solo según entren más reseñas.
    const companies = computeCompanyStats(programReviews);
    const adaptedReviews = centerReviews.map((r) => supabaseReviewToReview(r, companies));
    const cleanName = selectedMasterName.replace(/^M[áa]ster en\s*/i, "").trim();
    const headingName = selectedCenter
      ? `Máster en ${cleanName} en ${selectedCenter.name}`
      : selectedMasterName;
    return (
      <ReviewsListing
        masterName={headingName}
        reviews={adaptedReviews}
        onBack={() => setView("centers")}
        onSelectReview={handleSelectReview}
      />
    );
  }

  // Nivel 2: listado de centros.
  if (view === "centers") {
    const programReviews = reviews.filter((r) => r.programa === selectedMasterName);
    const centerGroups = groupByCentro(programReviews);
    const centers: MasterCenter[] = Object.entries(centerGroups).map(([centro, revs]) => ({
      name: centro,
      ...summarizeReviews(revs),
    }));
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
            {t("results.subtitleBase")} {answers.presupuesto} · {tQuestionnaireOption(answers.lugar || "")} · {tQuestionnaireOption(answers.sectorPublicoPrivado || "")}
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
                  onClick={() => handleViewMore(master.name)}
                >
                  {t("results.viewMore")}
                </Button>
              </div>
            </div>
          ))}

          {results.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>{t("common.noResults")}</p>
            </div>
          )}
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
