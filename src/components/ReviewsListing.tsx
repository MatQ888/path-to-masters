import { useState, useMemo } from "react";
import { ArrowLeft, Star, SlidersHorizontal } from "lucide-react";
import { Review } from "@/data/mockReviews";

interface ReviewsListingProps {
  masterName: string;
  reviews: Review[];
  onBack: () => void;
  onSelectReview: (review: Review) => void;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
      />
    ))}
  </div>
);

const ReviewsListing = ({ masterName, reviews, onBack, onSelectReview }: ReviewsListingProps) => {
  const [sortBy, setSortBy] = useState<"relevance" | "recent">("relevance");

  const sorted = useMemo(() => {
    const copy = [...reviews];
    if (sortBy === "relevance") {
      copy.sort((a, b) => b.rating - a.rating);
    } else {
      copy.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    return copy;
  }, [reviews, sortBy]);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <section className="min-h-screen bg-secondary/30 py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a recomendaciones
        </button>

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">{masterName}</h2>
          <div className="flex items-center gap-3 text-muted-foreground">
            <StarRating rating={Math.round(Number(avgRating))} />
            <span className="text-sm font-medium">{avgRating} de media</span>
            <span className="text-sm">·</span>
            <span className="text-sm">{reviews.length} reseñas</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-56 shrink-0">
            <div className="bg-card rounded-2xl p-5 border border-border sticky top-24">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-4 w-4 text-primary" /> Ordenar por
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "relevance" | "recent")}
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="relevance">Más relevantes</option>
                <option value="recent">Más recientes</option>
              </select>
            </div>
          </aside>

          {/* Reviews Feed */}
          <div className="flex-1 space-y-4">
            {sorted.map((review) => (
              <button
                key={review.id}
                onClick={() => onSelectReview(review)}
                className="w-full text-left bg-card rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {review.userName.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{review.userName}</p>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(review.date).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {review.summary}
                </p>
                <span className="inline-block mt-3 text-xs font-medium text-primary group-hover:underline">
                  Ver detalle completo →
                </span>
              </button>
            ))}

            {sorted.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <p>No hay reseñas disponibles para este programa todavía.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsListing;
