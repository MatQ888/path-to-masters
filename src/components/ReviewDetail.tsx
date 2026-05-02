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
  const { t } = useTranslation();
  const { getLikes, hasLiked, toggleLike } = useReviewLikes();
  const { translate, clear, getTranslation, isLoading } = useReviewTranslation();
  const liked = hasLiked(review.id);
  const likeCount = getLikes(review.id);
  const translated = getTranslation(review.id);
  const loading = isLoading(review.id);

  return (
    <section className="min-h-screen bg-secondary/30 py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a reseñas
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
                  {new Date(review.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Bloque 1: Ficha Técnica */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-5">
              <BookOpen className="h-5 w-5 text-primary" /> Ficha Técnica
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <InfoItem icon={GraduationCap} label="Especialidad" value={review.especialidad} />
              <InfoItem icon={Building2} label="Sector" value={review.sector} />
              <InfoItem icon={MapPin} label="Ubicación" value={review.ubicacion} />
              <InfoItem icon={Monitor} label="Formato" value={review.formato} />
              <InfoItem icon={Languages} label="Idiomas" value={review.idiomas} />
            </div>
          </div>

          {/* Bloque 2: Inversión y Tiempo */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-5">
              <Clock className="h-5 w-5 text-primary" /> Inversión y Tiempo
            </h3>
            <div className="grid grid-cols-2 gap-5">
              <InfoItem icon={Clock} label="Duración total" value={review.duracion} />
              <InfoItem icon={Euro} label="Precio anual" value={review.precioAnual} />
            </div>
          </div>

          {/* Bloque 3: Metodología y Exigencia */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-5">
              <BarChart3 className="h-5 w-5 text-primary" /> Metodología y Exigencia
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              <InfoItem icon={BarChart3} label="Nivel de dificultad" value={review.dificultad} />
              <InfoItem icon={Users} label="Asistencia" value={review.asistencia} />
              <div className="flex items-start gap-3">
                <Heart className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Nivel de estrés</p>
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
              <Handshake className="h-5 w-5 text-primary" /> Valor Añadido
            </h3>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-secondary/40 rounded-xl p-4">
                <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-primary" /> Prácticas
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.practicas}</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-4">
                <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" /> Networking
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.networking}</p>
              </div>
            </div>
          </div>

          {/* Bloque 5: Resultados */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-5">
              <Target className="h-5 w-5 text-primary" /> Resultados y Empleabilidad
            </h3>

            <div className="bg-secondary/40 rounded-xl p-4 mb-5">
              <p className="text-xs font-semibold text-foreground mb-1">Empleabilidad percibida</p>
              <p className="text-sm text-muted-foreground">{review.empleabilidad}</p>
            </div>

            {/* Companies */}
            <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-primary" /> Oportunidades con empresas
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
              <DollarSign className="h-4 w-4 text-primary" /> Dinero medio al salir
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-secondary/40 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">🟢 Novato</p>
                <p className="text-lg font-bold text-foreground">{review.salary.beginner.toLocaleString()} €</p>
                <p className="text-xs text-muted-foreground">/mes</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">🟡 Mid (4-7a)</p>
                <p className="text-lg font-bold text-foreground">{review.salary.mid.toLocaleString()} €</p>
                <p className="text-xs text-muted-foreground">/mes</p>
              </div>
              <div className="bg-secondary/40 rounded-xl p-3 text-center">
                <p className="text-xs text-muted-foreground mb-0.5">🔴 Senior (10+a)</p>
                <p className="text-lg font-bold text-foreground">{review.salary.advance.toLocaleString()} €</p>
                <p className="text-xs text-muted-foreground">/mes</p>
              </div>
            </div>
          </div>

          {/* DAFO */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-primary" /> Análisis DAFO
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-green-500/10 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-2">💪 Fortalezas</h4>
                <ul className="space-y-1">
                  {review.dafo.fortalezas.map((f, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {f}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-red-500/10 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-2">⚠️ Debilidades</h4>
                <ul className="space-y-1">
                  {review.dafo.debilidades.map((d, i) => (
                    <li key={i} className="text-sm text-muted-foreground">• {d}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-blue-500/10 rounded-xl p-4">
                <h4 className="font-semibold text-sm mb-2">🚀 Oportunidades</h4>
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
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" /> Comentario del Usuario
            </h3>
            <div className="bg-secondary/40 rounded-xl p-5">
              <p className="text-sm text-foreground leading-relaxed italic">"{review.fullComment}"</p>
              <p className="text-xs text-muted-foreground mt-3">— {review.userName}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewDetail;
