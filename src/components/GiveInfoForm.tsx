import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  CheckCircle,
  Shield,
  AtSign,
  Plus,
  X,
  Save,
  RefreshCcw,
  Building2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchableCombobox, { ComboboxOption } from "./SearchableCombobox";
import {
  COUNTRIES,
  CCAA,
  PROVINCES,
  getProvincesByCCAA,
  getCitiesByCountry,
} from "@/data/locations";
import {
  ALL_UNIVERSITIES,
  getUniversitiesByCountry,
} from "@/data/universities";
import { WorkExperienceEntry } from "@/data/experienceTypes";

interface GiveInfoFormProps {
  onBack: () => void;
  apodo?: string;
}

const especialidades = [
  "Ingeniería y Tecnología",
  "Ciencias sociales y jurídicas",
  "Artes y humanidades",
  "Ciencias de la salud",
];

const formatos = ["Presencial", "Semipresencial", "Online"];

const abandonoLevels = [
  "Muy bajo (Nadie se va)",
  "Bajo",
  "Normal",
  "Alto",
  "Muy alto (Muchos dejan el camino)",
];

const empleabilidadLevels = [
  "Muy difícil",
  "Difícil",
  "Normal",
  "Fácil",
  "Muy fácil (Te contratan antes de acabar)",
];

const stressLevels = [
  { emoji: "😊", label: "Muy relajado" },
  { emoji: "🙂", label: "Relajado" },
  { emoji: "😐", label: "Normal" },
  { emoji: "😰", label: "Estresado" },
  { emoji: "🥵", label: "Muy estresado" },
];

interface FormState {
  pais: string;
  ciudad: string;
  ccaa: string; // only when pais === "ES"
  especialidad: string;
  centro: string;
  programa: string;
  sector: string;
  formato: string;
  requisitos: string;
  abandono: number;
  empleabilidad: number;
  inversion: string;
  estres: number;
  comentarios: string;
  experiencia: WorkExperienceEntry[];
  publishedAt: string | null;
}

const initialForm: FormState = {
  pais: "",
  ciudad: "",
  ccaa: "",
  especialidad: "",
  centro: "",
  programa: "",
  sector: "",
  formato: "",
  requisitos: "",
  abandono: -1,
  empleabilidad: -1,
  inversion: "",
  estres: -1,
  comentarios: "",
  experiencia: [],
  publishedAt: null,
};

const GiveInfoForm = ({ onBack, apodo }: GiveInfoFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Country / location options
  const countryOptions: ComboboxOption[] = useMemo(
    () => COUNTRIES.map((c) => ({ value: c.code, label: c.name })),
    [],
  );

  // City/province options depend on country
  const cityOptions: ComboboxOption[] = useMemo(() => {
    if (!form.pais) return [];
    if (form.pais === "ES") {
      const provinces = form.ccaa ? getProvincesByCCAA(form.ccaa) : PROVINCES;
      return provinces
        .map((p) => ({ value: p.name, label: p.name }))
        .sort((a, b) => a.label.localeCompare(b.label, "es"));
    }
    return getCitiesByCountry(form.pais).map((c) => ({ value: c, label: c }));
  }, [form.pais, form.ccaa]);

  // Entity (university/centre) options filtered by country
  const entityOptions: ComboboxOption[] = useMemo(() => {
    const pool = form.pais
      ? getUniversitiesByCountry(form.pais)
      : ALL_UNIVERSITIES;
    return pool.map((u) => ({
      value: u.name,
      label: u.name,
      hint: [u.shortName, u.city].filter(Boolean).join(" · "),
    }));
  }, [form.pais]);

  const ccaaOptions: ComboboxOption[] = useMemo(
    () => CCAA.map((c) => ({ value: c.code, label: c.name })),
    [],
  );

  // Work experience handlers
  const addExperience = () =>
    setForm((p) => ({
      ...p,
      experiencia: [
        ...p.experiencia,
        { id: crypto.randomUUID(), empresa: "", puesto: "", anios: "" },
      ],
    }));

  const updateExperience = (
    id: string,
    field: keyof Omit<WorkExperienceEntry, "id">,
    value: string,
  ) =>
    setForm((p) => ({
      ...p,
      experiencia: p.experiencia.map((e) =>
        e.id === id ? { ...e, [field]: value } : e,
      ),
    }));

  const removeExperience = (id: string) =>
    setForm((p) => ({
      ...p,
      experiencia: p.experiencia.filter((e) => e.id !== id),
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update published date on every submit (creation or update)
    setForm((p) => ({ ...p, publishedAt: new Date().toISOString() }));
    setSubmitted(true);
  };

  const handleUpdate = () => {
    setIsUpdate(true);
    setSubmitted(false);
    // Reset publishedAt so user knows it'll be refreshed on save
    setForm((p) => ({ ...p, publishedAt: null }));
  };

  // ===== THANK-YOU SCREEN (FIXED) =====
  if (submitted) {
    const fechaTexto = form.publishedAt
      ? new Date(form.publishedAt).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "";

    return (
      <section className="min-h-screen flex items-center justify-center bg-background py-20 px-4">
        <div className="w-full max-w-lg text-center space-y-6">
          <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            {isUpdate ? "¡Información actualizada!" : "¡Gracias por contribuir!"}
          </h2>
          <p className="text-muted-foreground text-base">
            {isUpdate
              ? "Tus cambios se han guardado correctamente."
              : "Tu información ha sido publicada correctamente."}
          </p>
          {apodo && (
            <p className="text-sm text-muted-foreground">
              Publicado bajo el apodo{" "}
              <span className="font-semibold text-foreground">@{apodo}</span>
              {fechaTexto && <> · {fechaTexto}</>}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleUpdate}
              className="rounded-xl gap-2"
            >
              <RefreshCcw className="h-4 w-4" /> Actualizar información
            </Button>
            <Button
              type="button"
              onClick={onBack}
              className="rounded-xl gap-2 bg-primary hover:bg-primary/90"
            >
              Volver al inicio
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-3xl font-bold text-foreground">
            Compartir información
          </h2>
          <p className="text-muted-foreground">
            Ayuda a otros usuarios compartiendo tu experiencia académica o profesional.
          </p>
        </div>

        {/* Apodo notice */}
        {apodo && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-accent/60 border border-border mb-4">
            <AtSign className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-foreground">
              Toda la información que proporciones se publicará bajo tu apodo{" "}
              <span className="font-semibold">@{apodo}</span>.
            </p>
          </div>
        )}

        {/* Anonymity badge */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/60 border border-border mb-8">
          <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            Tus datos personales son confidenciales. Solo se publica la información
            del programa o experiencia bajo tu apodo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ---------- LOCALIZACIÓN ---------- */}
          <SectionTitle>Localización</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWrapper label="País">
              <SearchableCombobox
                options={countryOptions}
                value={form.pais}
                onChange={(v) => {
                  update("pais", v);
                  // Reset dependent fields
                  update("ciudad", "");
                  update("ccaa", "");
                  update("centro", "");
                }}
                placeholder="Selecciona un país"
                emptyMessage="País no encontrado"
              />
            </FieldWrapper>

            {form.pais === "ES" && (
              <FieldWrapper label="Comunidad Autónoma">
                <SearchableCombobox
                  options={ccaaOptions}
                  value={form.ccaa}
                  onChange={(v) => {
                    update("ccaa", v);
                    update("ciudad", "");
                  }}
                  placeholder="Selecciona una CC.AA."
                />
              </FieldWrapper>
            )}

            <FieldWrapper
              label={form.pais === "ES" ? "Provincia" : "Ciudad"}
              hint={!form.pais ? "Elige primero un país" : undefined}
            >
              <SearchableCombobox
                options={cityOptions}
                value={form.ciudad}
                onChange={(v) => update("ciudad", v)}
                placeholder={
                  form.pais === "ES"
                    ? "Selecciona provincia"
                    : "Escribe la ciudad"
                }
                disabled={!form.pais}
                allowCustom={form.pais !== "ES"}
                emptyMessage="Sin resultados"
              />
            </FieldWrapper>
          </div>

          {/* ---------- ENTIDAD Y PROGRAMA ---------- */}
          <SectionTitle>Entidad y programa</SectionTitle>
          <FieldWrapper label="Universidad, centro de máster o empresa">
            <SearchableCombobox
              options={entityOptions}
              value={form.centro}
              onChange={(v) => update("centro", v)}
              placeholder="Busca por nombre o siglas (ej. UPM, Carlos III)"
              emptyMessage="Sin resultados"
              allowCustom
            />
          </FieldWrapper>

          <FieldWrapper label="Grado, máster o puesto">
            <Input
              placeholder="Ej: Ingeniería Aeroespacial / Data Analyst"
              value={form.programa}
              onChange={(e) => update("programa", e.target.value)}
              maxLength={200}
            />
          </FieldWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWrapper label="Especialidad">
              <Select
                value={form.especialidad}
                onValueChange={(v) => update("especialidad", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWrapper>

            <FieldWrapper label="Sector">
              <Select value={form.sector} onValueChange={(v) => update("sector", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Público / Privado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Público">Público</SelectItem>
                  <SelectItem value="Privado">Privado</SelectItem>
                </SelectContent>
              </Select>
            </FieldWrapper>
          </div>

          <FieldWrapper label="¿En qué formato se imparte?">
            <Select value={form.formato} onValueChange={(v) => update("formato", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un formato" />
              </SelectTrigger>
              <SelectContent>
                {formatos.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>

          <FieldWrapper
            label="Requisitos o nota de corte"
            hint="Si es universidad, pon la nota de corte. Si es máster o empresa, describe brevemente el proceso (ej. Entrevista + Inglés B2)."
          >
            <Textarea
              placeholder="Ej: 12.5 / Entrevista + Portfolio"
              value={form.requisitos}
              onChange={(e) => update("requisitos", e.target.value)}
              maxLength={500}
              rows={2}
              className="min-h-[60px]"
            />
          </FieldWrapper>

          {/* ---------- VALORACIÓN ---------- */}
          <SectionTitle>Valoración</SectionTitle>

          <FieldWrapper label="¿Qué nivel de abandono percibes?">
            <ChipGroup
              items={abandonoLevels}
              selected={form.abandono}
              onSelect={(i) => update("abandono", i)}
            />
          </FieldWrapper>

          <FieldWrapper label="¿Cómo ves la salida laboral?">
            <ChipGroup
              items={empleabilidadLevels}
              selected={form.empleabilidad}
              onSelect={(i) => update("empleabilidad", i)}
            />
          </FieldWrapper>

          <FieldWrapper label="Precio o inversión anual aproximada (€)">
            <Input
              type="number"
              placeholder="Ej: 8000"
              value={form.inversion}
              onChange={(e) => update("inversion", e.target.value)}
            />
          </FieldWrapper>

          <FieldWrapper label="Nivel de estrés">
            <div className="flex justify-between gap-2">
              {stressLevels.map((level, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => update("estres", i)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all flex-1 border ${
                    form.estres === i
                      ? "bg-primary text-primary-foreground border-primary shadow-md scale-105"
                      : "bg-background border-border text-foreground hover:bg-accent"
                  }`}
                >
                  <span className="text-2xl">{level.emoji}</span>
                  <span className="text-[10px] leading-tight text-center font-medium">
                    {level.label}
                  </span>
                </button>
              ))}
            </div>
          </FieldWrapper>

          {/* ---------- EXPERIENCIA LABORAL ---------- */}
          <SectionTitle>Experiencia laboral</SectionTitle>
          <p className="text-sm text-muted-foreground -mt-4">
            Añade empresas u ofertas en las que has trabajado. Esto nos ayudará a
            construir el comparador de salidas profesionales.
          </p>

          <div className="space-y-3">
            {form.experiencia.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
                <Building2 className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Aún no has añadido ninguna experiencia laboral.
                </p>
              </div>
            )}

            {form.experiencia.map((exp, idx) => (
              <div
                key={exp.id}
                className="rounded-2xl border border-border bg-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Experiencia #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="Eliminar experiencia"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Empresa"
                    value={exp.empresa}
                    onChange={(e) =>
                      updateExperience(exp.id, "empresa", e.target.value)
                    }
                    maxLength={200}
                  />
                  <Input
                    placeholder="Puesto / Rol"
                    value={exp.puesto}
                    onChange={(e) =>
                      updateExperience(exp.id, "puesto", e.target.value)
                    }
                    maxLength={200}
                  />
                </div>
                <Input
                  placeholder="Periodo (ej. 2021-2023 o 1 año)"
                  value={exp.anios ?? ""}
                  onChange={(e) =>
                    updateExperience(exp.id, "anios", e.target.value)
                  }
                  maxLength={50}
                />
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={addExperience}
              className="w-full rounded-xl gap-2"
            >
              <Plus className="h-4 w-4" /> Añadir experiencia laboral
            </Button>
          </div>

          {/* ---------- COMENTARIOS ---------- */}
          <SectionTitle>Comentario para otros usuarios</SectionTitle>
          <FieldWrapper label="Información clave">
            <Textarea
              placeholder="Cuéntanos sobre la calidad de los profesores, si es muy teórico o práctico, y si los contactos que haces valen la pena"
              value={form.comentarios}
              onChange={(e) => update("comentarios", e.target.value)}
              maxLength={2000}
              rows={4}
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {form.comentarios.length}/2000
            </p>
          </FieldWrapper>

          {/* ---------- ACTIONS ---------- */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="submit"
              size="lg"
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90 font-semibold gap-2"
            >
              <Save className="h-4 w-4" /> Enviar información
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

/* --------------------------- Subcomponents --------------------------- */

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pt-2 border-t border-border">
    <span className="inline-block pt-4">{children}</span>
  </h3>
);

const FieldWrapper = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <Label className="text-foreground font-medium text-sm">{label}</Label>
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    {children}
  </div>
);

const ChipGroup = ({
  items,
  selected,
  onSelect,
}: {
  items: string[];
  selected: number;
  onSelect: (i: number) => void;
}) => (
  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
    {items.map((label, i) => (
      <button
        key={i}
        type="button"
        onClick={() => onSelect(i)}
        className={`p-3 rounded-xl text-xs text-center transition-all leading-tight border ${
          selected === i
            ? "bg-primary text-primary-foreground border-primary shadow-md scale-[1.02] font-semibold"
            : "bg-background border-border text-foreground hover:bg-accent"
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

export default GiveInfoForm;
