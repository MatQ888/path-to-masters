import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  GitCompareArrows,
  Library as LibraryIcon,
  MapPin,
  Euro,
  Building2,
  Clock,
  X,
  Briefcase,
  Heart,
  Star,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useLibrary, LibraryItem } from "@/hooks/useLibrary";
import { mockReviewsByMaster, Review } from "@/data/mockReviews";
import { toast } from "sonner";

const MAX_COMPARE = 4;

/** Métricas agregadas a partir de las reseñas de un máster. */
interface MasterMetrics {
  reviewsCount: number;
  avgRating: number;
  avgEstres: number;
  avgEmpleabilidad: number; // 0-100
  topCompanies: string[];
}

const empleabilidadScore = (text: string): number => {
  const t = (text || "").toLowerCase();
  if (t.includes("muy alta")) return 95;
  if (t.includes("alta")) return 80;
  if (t.includes("media-alta")) return 70;
  if (t.includes("media")) return 60;
  if (t.includes("baja")) return 40;
  return 65;
};

const computeMetrics = (masterName: string): MasterMetrics => {
  const reviews: Review[] = mockReviewsByMaster[masterName] || [];
  if (!reviews.length) {
    return {
      reviewsCount: 0,
      avgRating: 0,
      avgEstres: 0,
      avgEmpleabilidad: 0,
      topCompanies: [],
    };
  }
  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
  return {
    reviewsCount: reviews.length,
    avgRating: avg(reviews.map((r) => r.rating)),
    avgEstres: avg(reviews.map((r) => r.estres)),
    avgEmpleabilidad: avg(reviews.map((r) => empleabilidadScore(r.empleabilidad))),
    topCompanies: Array.from(
      new Set(reviews.flatMap((r) => r.companies.map((c) => c.name)))
    ).slice(0, 3),
  };
};

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`h-3.5 w-3.5 ${
          s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
        }`}
      />
    ))}
  </div>
);

const Bar = ({ value, color = "bg-primary" }: { value: number; color?: string }) => (
  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
    <div
      className={`h-full ${color} rounded-full transition-all duration-500`}
      style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
    />
  </div>
);

const Biblioteca = () => {
  const navigate = useNavigate();
  const { items, remove } = useLibrary();
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= MAX_COMPARE) {
        toast(`Solo puedes comparar hasta ${MAX_COMPARE} opciones`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const compareItems = useMemo(
    () => items.filter((it) => selectedIds.includes(it.id)),
    [items, selectedIds]
  );

  const startComparison = () => {
    if (selectedIds.length < 2) {
      toast("Selecciona al menos 2 opciones para comparar");
      return;
    }
    setShowComparison(true);
  };

  const exitCompareMode = () => {
    setCompareMode(false);
    setSelectedIds([]);
    setShowComparison(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <section className="container mx-auto px-4 max-w-5xl py-12">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Volver
          </button>

          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LibraryIcon className="h-7 w-7 text-primary" />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">Tu Biblioteca</h1>
              </div>
              <p className="text-muted-foreground">
                {items.length === 0
                  ? "Aquí aparecerán los másters que vayas guardando."
                  : `${items.length} opci${items.length === 1 ? "ón guardada" : "ones guardadas"}`}
              </p>
            </div>

            {items.length >= 2 && (
              <div className="flex items-center gap-2">
                {compareMode ? (
                  <>
                    <Button variant="outline" onClick={exitCompareMode} className="rounded-xl">
                      Cancelar
                    </Button>
                    <Button
                      variant="cta"
                      onClick={startComparison}
                      disabled={selectedIds.length < 2}
                      className="rounded-xl"
                    >
                      Comparar ({selectedIds.length})
                    </Button>
                  </>
                ) : (
                  <Button variant="cta" onClick={() => setCompareMode(true)} className="rounded-xl">
                    <GitCompareArrows className="h-4 w-4 mr-2" /> Comparar
                  </Button>
                )}
              </div>
            )}
          </header>

          {/* Estado vacío */}
          {items.length === 0 && (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <Bookmark className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">
                No has guardado ninguna opción todavía.
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Pulsa el icono de marcapáginas en cualquier máster para añadirlo aquí.
              </p>
              <Link to="/">
                <Button variant="cta" className="rounded-xl">
                  Explorar másters
                </Button>
              </Link>
            </div>
          )}

          {/* Aviso modo comparar */}
          {compareMode && items.length > 0 && !showComparison && (
            <div className="bg-accent/60 border border-primary/20 rounded-xl p-4 mb-6 text-sm text-foreground">
              Selecciona hasta <strong>{MAX_COMPARE}</strong> opciones para comparar.
              Llevas <strong>{selectedIds.length}</strong>.
            </div>
          )}

          {/* Listado de tarjetas guardadas */}
          {items.length > 0 && !showComparison && (
            <div className="grid gap-4 md:grid-cols-2">
              {items.map((item) => {
                const selected = selectedIds.includes(item.id);
                const metrics = computeMetrics(item.name);
                return (
                  <article
                    key={item.id}
                    className={`relative bg-card rounded-2xl border-2 p-6 transition-all duration-200 ${
                      compareMode
                        ? selected
                          ? "border-primary shadow-md cursor-pointer"
                          : "border-border hover:border-primary/50 cursor-pointer"
                        : "border-border hover:shadow-md"
                    }`}
                    onClick={() => compareMode && toggleSelect(item.id)}
                  >
                    {/* Checkbox circular del comparador */}
                    {compareMode && (
                      <div className="absolute top-4 right-4">
                        <div
                          className={`h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                            selected
                              ? "bg-primary border-primary"
                              : "border-muted-foreground/40 bg-background"
                          }`}
                        >
                          {selected && (
                            <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Botón quitar (solo fuera del modo comparar) */}
                    {!compareMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(item.id);
                          toast("Eliminado de tu Biblioteca");
                        }}
                        aria-label="Quitar de la Biblioteca"
                        className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}

                    <h3 className="text-lg font-semibold text-foreground pr-8 mb-2">
                      {item.name}
                    </h3>

                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {item.location}</span>
                      <span className="flex items-center gap-1"><Euro className="h-3.5 w-3.5" /> {item.price}</span>
                      <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {item.type}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {item.duration}</span>
                    </div>

                    {metrics.reviewsCount > 0 && (
                      <div className="flex items-center gap-2 pt-3 border-t border-border">
                        <StarRating rating={metrics.avgRating} />
                        <span className="text-xs text-muted-foreground">
                          {metrics.avgRating.toFixed(1)} · {metrics.reviewsCount} reseña
                          {metrics.reviewsCount === 1 ? "" : "s"}
                        </span>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}

          {/* Vista de comparación */}
          {showComparison && (
            <ComparisonView items={compareItems} onClose={exitCompareMode} />
          )}
        </section>
      </main>
    </div>
  );
};

/** Vista del comparador: tarjetas en paralelo con barras visuales. */
const ComparisonView = ({
  items,
  onClose,
}: {
  items: LibraryItem[];
  onClose: () => void;
}) => {
  const enriched = items.map((it) => ({ item: it, metrics: computeMetrics(it.name) }));
  const maxPrice = Math.max(
    ...enriched.map(({ item }) => parseFloat(item.price.replace(/[^\d.,]/g, "").replace(",", ".")) || 0),
    1
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Comparativa</h2>
        <Button variant="outline" onClick={onClose} className="rounded-xl">
          <X className="h-4 w-4 mr-2" /> Cerrar
        </Button>
      </div>

      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${enriched.length}, minmax(0, 1fr))` }}
      >
        {enriched.map(({ item, metrics }) => {
          const priceNum =
            parseFloat(item.price.replace(/[^\d.,]/g, "").replace(",", ".")) || 0;
          const pricePct = (priceNum / maxPrice) * 100;
          return (
            <div
              key={item.id}
              className="bg-card rounded-2xl border border-border p-5 space-y-5"
            >
              {/* Cabecera */}
              <div>
                <h3 className="font-semibold text-foreground text-base leading-tight mb-2">
                  {item.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {item.location}
                </div>
              </div>

              {/* Lugar */}
              <Metric label="Lugar" valueText={item.location} icon={<MapPin className="h-3.5 w-3.5" />} />

              {/* Precio medio */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Euro className="h-3.5 w-3.5" /> Precio anual
                  </span>
                  <span className="text-sm font-semibold text-foreground">{item.price}</span>
                </div>
                <Bar value={pricePct} />
              </div>

              {/* Salida laboral */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5" /> Salida laboral
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {Math.round(metrics.avgEmpleabilidad)}%
                  </span>
                </div>
                <Bar value={metrics.avgEmpleabilidad} />
              </div>

              {/* Nivel de estrés */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Heart className="h-3.5 w-3.5" /> Nivel de estrés
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {metrics.reviewsCount > 0 ? `${Math.round(metrics.avgEstres)}%` : "—"}
                  </span>
                </div>
                <Bar value={metrics.avgEstres} color="bg-destructive/70" />
              </div>

              {/* Valoración media */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5" /> Valoración media
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {metrics.reviewsCount > 0 ? metrics.avgRating.toFixed(1) : "—"}
                  </span>
                </div>
                <Bar value={(metrics.avgRating / 5) * 100} color="bg-yellow-400" />
                <p className="text-[11px] text-muted-foreground mt-1">
                  {metrics.reviewsCount > 0
                    ? `Basado en ${metrics.reviewsCount} reseña${metrics.reviewsCount === 1 ? "" : "s"}`
                    : "Sin reseñas todavía"}
                </p>
              </div>

              {/* Tipo / duración */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
                <div>
                  <p className="text-[11px] text-muted-foreground">Tipo</p>
                  <p className="text-sm font-medium text-foreground">{item.type}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Duración</p>
                  <p className="text-sm font-medium text-foreground">{item.duration}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Metric = ({
  label,
  valueText,
  icon,
}: {
  label: string;
  valueText: string;
  icon: React.ReactNode;
}) => (
  <div>
    <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mb-1">
      {icon} {label}
    </p>
    <p className="text-sm font-medium text-foreground">{valueText}</p>
  </div>
);

export default Biblioteca;
