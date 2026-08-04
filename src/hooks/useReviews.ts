import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseReview {
  id: string;
  user_id: string;
  apodo: string;
  pais: string;
  ccaa: string;
  ciudad: string;
  centro: string;
  programa: string;
  especialidad: string;
  sector: string;
  formato: string;
  idiomas: string;
  asistencia: string;
  requisitos: string;
  abandono: number;
  empleabilidad: number;
  inversion: number;
  estres: number;
  duracion_oficial: number;
  tiempo_real: number;
  experiencia: { empresa: string; puesto: string; anios: string }[];
  comentarios: string;
  link_programa: string;
  link_centro: string;
  published_at: string;
  created_at: string;
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<SupabaseReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setReviews(data || []);
      }
      setLoading(false);
    };

    fetchReviews();
  }, []);

  return { reviews, loading, error };
};

// Agrupa reviews por programa
export const groupByPrograma = (reviews: SupabaseReview[]) => {
  return reviews.reduce((acc, review) => {
    const key = review.programa || "Sin programa";
    if (!acc[key]) acc[key] = [];
    acc[key].push(review);
    return acc;
  }, {} as Record<string, SupabaseReview[]>);
};

// Agrupa reviews por centro dentro de un programa
export const groupByCentro = (reviews: SupabaseReview[]) => {
  return reviews.reduce((acc, review) => {
    const key = review.centro || "Sin centro";
    if (!acc[key]) acc[key] = [];
    acc[key].push(review);
    return acc;
  }, {} as Record<string, SupabaseReview[]>);
};