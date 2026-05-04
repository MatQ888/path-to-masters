import { ArrowLeft, Bookmark, MapPin, Euro, Building2, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { MasterCenter } from "@/data/mockCenters";
import { useLibrary } from "@/hooks/useLibrary";
import { toast } from "sonner";

interface CentersListingProps {
  masterName: string;
  centers: MasterCenter[];
  onBack: () => void;
  onSelectCenter: (center: MasterCenter) => void;
}

/**
 * Nivel 2: lista de centros / universidades que imparten un máster.
 * Cada tarjeta tiene un botón marcapáginas para guardarla en la Biblioteca.
 */
const CentersListing = ({ masterName, centers, onBack, onSelectCenter }: CentersListingProps) => {
  const { t } = useTranslation();
  const { isSaved, toggle } = useLibrary();

  // Quitamos el prefijo "Máster en" para componer "Máster en X en Y".
  const cleanName = masterName.replace(/^M[áa]ster en\s*/i, "").trim();

  return (
    <section className="min-h-screen bg-secondary/30 py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {t("centers.back")}
        </button>

        <div className="text-center space-y-3 mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">{masterName}</h2>
          <p className="text-muted-foreground text-lg">
            {t("centers.subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          {centers.map((center) => {
            // ID único combinando nombre del máster + centro para evitar colisiones.
            const itemId = `${masterName}__${center.name}`;
            const saved = isSaved(itemId);
            const displayName = `Máster en ${cleanName} en ${center.name}`;

            const handleBookmark = (e: React.MouseEvent) => {
              e.stopPropagation();
              const isNowSaved = toggle({
                id: itemId,
                name: displayName,
                location: center.location,
                price: center.price,
                type: center.type,
                duration: center.duration,
              });
              toast(isNowSaved ? t("centers.savedToast") : t("centers.removedToast"));
            };

            return (
              <article
                key={itemId}
                className="bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {center.name}
                          {center.shortName && (
                            <span className="ml-2 text-sm font-medium text-muted-foreground">
                              ({center.shortName})
                            </span>
                          )}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={handleBookmark}
                        aria-label={saved ? t("centers.remove") : t("centers.save")}
                        aria-pressed={saved}
                        className={`shrink-0 rounded-full p-2 transition-colors md:hidden ${
                          saved
                            ? "text-primary bg-primary/10"
                            : "text-muted-foreground hover:text-primary hover:bg-accent"
                        }`}
                      >
                        <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" /> {center.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Euro className="h-4 w-4" /> {center.price}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Building2 className="h-4 w-4" /> {center.type}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> {center.duration}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleBookmark}
                      aria-label={saved ? t("centers.remove") : t("centers.save")}
                      aria-pressed={saved}
                      className={`hidden md:inline-flex rounded-full p-2 transition-colors ${
                        saved
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-primary hover:bg-accent"
                      }`}
                    >
                      <Bookmark className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
                    </button>
                    <Button
                      variant="cta"
                      className="rounded-xl"
                      onClick={() => onSelectCenter(center)}
                    >
                      {t("centers.viewReviews")}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}

          {centers.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p>{t("centers.empty")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CentersListing;
