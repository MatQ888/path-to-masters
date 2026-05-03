-- Add new profile columns
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS apellido TEXT,
  ADD COLUMN IF NOT EXISTS genero TEXT,
  ADD COLUMN IF NOT EXISTS es_estudiante BOOLEAN,
  ADD COLUMN IF NOT EXISTS universidad TEXT,
  ADD COLUMN IF NOT EXISTS carrera TEXT,
  ADD COLUMN IF NOT EXISTS acepto_politica BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS acepto_politica_at TIMESTAMPTZ;

-- Validate genero values via trigger (avoid CHECK with future flexibility)
CREATE OR REPLACE FUNCTION public.validate_profile_genero()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.genero IS NOT NULL AND NEW.genero NOT IN ('masculino','femenino','no_indicar') THEN
    RAISE EXCEPTION 'Valor de genero no válido: %', NEW.genero;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS validate_profile_genero_trigger ON public.profiles;
CREATE TRIGGER validate_profile_genero_trigger
BEFORE INSERT OR UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.validate_profile_genero();

-- Update handle_new_user to persist all signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  meta JSONB := NEW.raw_user_meta_data;
  v_es_est BOOLEAN;
  v_acepto BOOLEAN;
BEGIN
  -- Coerce booleans (metadata arrives as text or bool)
  v_es_est := CASE
    WHEN meta->>'es_estudiante' IN ('true','t','1') THEN TRUE
    WHEN meta->>'es_estudiante' IN ('false','f','0') THEN FALSE
    ELSE NULL
  END;
  v_acepto := CASE
    WHEN meta->>'acepto_politica' IN ('true','t','1') THEN TRUE
    ELSE FALSE
  END;

  INSERT INTO public.profiles (
    id, apodo, nombre, apellido, genero,
    es_estudiante, universidad, carrera,
    acepto_politica, acepto_politica_at
  )
  VALUES (
    NEW.id,
    COALESCE(meta->>'apodo', split_part(NEW.email, '@', 1)),
    meta->>'nombre',
    meta->>'apellido',
    meta->>'genero',
    v_es_est,
    meta->>'universidad',
    meta->>'carrera',
    v_acepto,
    CASE WHEN v_acepto THEN now() ELSE NULL END
  );
  RETURN NEW;
END;
$$;

-- Ensure trigger exists on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();