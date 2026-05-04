import { ArrowLeft, MapPin, Building2, BookOpen, Monitor, Languages, Clock, Euro, BarChart3, Users, Briefcase, Target, DollarSign, MessageSquare, Heart, GraduationCap, Handshake, Star, BookHeart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Review } from "@/data/mockReviews";
import { useReviewLikes } from "@/hooks/useReviewLikes";
import { useReviewTranslation } from "@/hooks/useReviewTranslation";

interface ReviewDetailProps {
  review: Review;
  /**
   * Si el flujo viene del nivel 2 (centro elegido), `masterName` ya contiene
   * "Máster en X en Y" y se renderiza tal cual. Si no, se compone con
   * `centerName` o, en su defecto, con la ubicación de la reseña.
   */
  masterName: string;
  /** Centro/universidad seleccionado en el nivel 2. Opcional. */
  centerName?: string;
  onBack: () => void;
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

const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value}</p>
    </div>
  </div>
);

const ReviewDetail = ({ review, masterName, centerName, onBack }: ReviewDetailProps) => {
  const { t, i18n } = useTranslation();
  const { getLikes, hasLiked, toggleLike } = useReviewLikes();
  const { translate, clear, getTranslation, isLoading } = useReviewTranslation();
  const liked = hasLiked(review.id);
  const likeCount = getLikes(review.id);
  const lang = (i18n.resolvedLanguage ?? i18n.language ?? "es").slice(0, 2);
  // Si la reseña trae una traducción precargada para el idioma actual, úsala como base.
  const baseComment =
    lang === "en" && review.translations?.en?.fullComment
      ? review.translations.en.fullComment
      : review.fullComment;
  const translated = getTranslation(review.id);
  const loading = isLoading(review.id);

  return (
    <section className="min-h-screen bg-secondary/30 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> {t("reviews.backToReviews")}
        </button>

        {/* Header */}
        <div className="mb-10">
          {(() => {
            // Si masterName ya incluye " en ", lo mostramos tal cual.
            // Si no, componemos con centerName o, en su defecto, con la ubicación.
            const alreadyComposed = / en /i.test(masterName.replace(/^M[áa]ster en\s*/i, ""));
            if (alreadyComposed) {
              return (
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {masterName}
                </h2>
              );
            }
            const cleanName = masterName.replace(/^M[áa]ster en\s*/i, "").trim();
            const centro = centerName || review.centro || review.ubicacion;
            return (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Máster en {cleanName} <span className="text-muted-foreground font-semibold">en</span> {centro}
              </h2>
            );
          })()}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
              {review.userName.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{review.userName}</p>
              <div className="flex items-center gap-2">
                <StarRating rating={review.rating} />
                <span className="text-xs text-muted-foreground">
                  {new Date(review.date).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Bloque 1: Ficha Técnica */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-5">
              <BookOpen className="h-5 w-5 text-primary" /> {t("reviews.blocks.ficha")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <InfoItem icon={GraduationCap} label={t("reviews.fields.specialty")} value={review.especialidad} />
              <InfoItem icon={Building2} label={t("reviews.fields.sector")} value={review.sector} />
              <InfoItem icon={MapPin} label={t("reviews.fields.location")} value={review.ubicacion} />
              <InfoItem icon={Monitor} label={t("reviews.fields.format")} value={review.formato} />
              <InfoItem icon={Languages} label={t("reviews.fields.languages")} value={review.idiomas} />
            </div>
          </div>

          {/* Bloque 2: Inversión y Tiempo */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-5">
              <Clock className="h-5 w-5 text-primary" /> {t("reviews.blocks.inversion")}
            </h3>
            <div className="grid grid-cols-2 gap-5">
              <InfoItem icon={Clock} label={t("reviews.fields.totalDuration")} value={review.duracion} />
              <InfoItem icon={Euro} label={t("reviews.fields.annualPrice")} value={review.precioAnual} />
            </div>
          </div>

          {/* Bloque 3: Metodología y Exigencia */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-5">
              <BarChart3 className="h-5 w-5 text-primary" /> {t("reviews.blocks.metodologia")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <InfoItem icon={BarChart3} label={t("reviews.fields.difficulty")} value={review.dificultad} />
              <InfoItem icon={Users} label={t("reviews.fields.attendance")} value={review.asistencia} />
              <div className="flex items-start gap-3">
                <Heart className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">{t("reviews.fields.stress")}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-secondary rounded-full h-2.5 w-24 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-destructive/70"
                        style={{ width: `${review.estres}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">{review.estres}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bloque 4: Valor Añadido */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-5">
              <Handshake className="h-5 w-5 text-primary" /> {t("reviews.blocks.valor")}
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-secondary/40 rounded-xl p-4">
                <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-primary" /> {t("reviews.fields.internships")}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.practicas}</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-4">
                <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" /> {t("reviews.fields.networking")}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.networking}</p>
              </div>
            </div>
          </div>

          {/* Bloque 5: Resultados */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-5">
              <Target className="h-5 w-5 text-primary" /> {t("reviews.blocks.resultados")}
            </h3>

            <div className="bg-secondary/40 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-foreground mb-1">{t("reviews.fields.perceivedEmployability")}</p>
              <p className="text-sm text-muted-foreground">{review.empleabilidad}</p>
            </div>

            {/* Companies */}
            <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-primary" /> {t("reviews.fields.companyOpportunities")}
            </p>
            <div className="space-y-2.5 mb-6">
              {review.companies.map((c, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm w-28 shrink-0 truncate">{c.name}</span>
                  <div className="flex-1 bg-secondary rounded-full h-5 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full flex items-center justify-end pr-2 transition-all"
                      style={{ width: `${c.percent}%` }}
                    >
                      {c.percent >= 15 && (
                        <span className="text-xs font-bold text-primary-foreground">{c.percent}%</span>
                      )}
                    </div>
                  </div>
                  {c.percent < 15 && <span className="text-xs font-medium text-muted-foreground">{c.percent}%</span>}
                </div>
              ))}
            </div>

            {/* Salary */}
            <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-primary" /> {t("reviews.fields.avgSalary")}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-secondary/40 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">{t("reviews.fields.beginner")}</p>
                <p className="text-lg font-bold text-foreground">{review.salary.beginner.toLocaleString()} €</p>
                <p className="text-xs text-muted-foreground">{t("reviews.fields.perMonth")}</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">{t("reviews.fields.mid")}</p>
                <p className="text-lg font-bold text-foreground">{review.salary.mid.toLocaleString()} €</p>
                <p className="text-xs text-muted-foreground">{t("reviews.fields.perMonth")}</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">{t("reviews.fields.senior")}</p>
                <p className="text-lg font-bold text-foreground">{review.salary.advance.toLocaleString()} €</p>
                <p className="text-xs text-muted-foreground">{t("reviews.fields.perMonth")}</p>
              </div>
            </div>
          </div>

          {/* DAFO */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" /> {t("reviews.blocks.dafo")}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-500/10 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-2">{t("reviews.fields.strengths")}</h4>
                <ul className="space-y-1">
                  {review.dafo.fortalezas.map((f, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {f}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-500/10 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-2">{t("reviews.fields.weaknesses")}</h4>
                <ul className="space-y-1">
                  {review.dafo.debilidades.map((d, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {d}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-2">{t("reviews.fields.opportunities")}</h4>
                <ul className="space-y-1">
                  {review.dafo.oportunidades.map((o, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {o}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bloque 6: Comentario del Usuario */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> {t("reviews.blocks.comentario")}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    translated ? clear(review.id) : void translate(review.id, baseComment)
                  }
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-60"
                >
                  <Languages className="h-3.5 w-3.5" />
                  {loading
                    ? t("reviews.translating")
                    : translated
                      ? t("reviews.showOriginal")
                      : t("reviews.translate")}
                </button>
                <button
                  type="button"
                  onClick={() => toggleLike(review.id)}
                  aria-pressed={liked}
                  aria-label={liked ? t("reviews.unlike") : t("reviews.like")}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    liked
                      ? "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10"
                  }`}
                >
                  <BookHeart
                    className={`h-4 w-4 ${liked ? "fill-primary/20" : ""}`}
                    strokeWidth={liked ? 2.5 : 2}
                  />
                  <span>{likeCount}</span>
                </button>
              </div>
            </div>
            <div className="bg-secondary/40 rounded-xl p-5">
              <p className="text-sm text-foreground leading-relaxed italic">
                "{translated ?? baseComment}"
              </p>
              <p className="text-xs text-muted-foreground mt-3">— {review.userName}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewDetail;
