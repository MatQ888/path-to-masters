import { useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { tCountryByCode, tCcaaByCode, tProvince, tSpecialty, tFormat, tQuestionnaireOption } from "@/lib/i18nData";
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
  duracionOficial: string;
  tiempoReal: string;
  estres: number;
  comentarios: string;
  linkPrograma: string;
  linkCentro: string;
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
  duracionOficial: "",
  tiempoReal: "",
  estres: -1,
  comentarios: "",
  linkPrograma: "",
  linkCentro: "",
  experiencia: [],
  publishedAt: null,
};

const GiveInfoForm = ({ onBack, apodo }: GiveInfoFormProps) => {
  const { t, i18n } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [form, setForm] = useState<FormState>(initialForm);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Country / location options
  const countryOptions: ComboboxOption[] = useMemo(
    () => COUNTRIES.map((c) => ({ value: c.code, label: tCountryByCode(c.code) }))
      .sort((a, b) => a.label.localeCompare(b.label, i18n.language)),
    [i18n.language],
  );

  // City/province options depend on country
  const cityOptions: ComboboxOption[] = useMemo(() => {
    if (!form.pais) return [];
    if (form.pais === "ES") {
      const provinces = form.ccaa ? getProvincesByCCAA(form.ccaa) : PROVINCES;
      return provinces
        .map((p) => ({ value: p.name, label: tProvince(p.name) }))
        .sort((a, b) => a.label.localeCompare(b.label, i18n.language));
    }
    return getCitiesByCountry(form.pais).map((c) => ({ value: c, label: c }));
  }, [form.pais, form.ccaa, i18n.language]);

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
    () => CCAA.map((c) => ({ value: c.code, label: tCcaaByCode(c.code) })),
    [i18n.language],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const publishedAt = new Date().toISOString();

    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase.from('reviews').upsert({
        user_id: user.id,
        apodo: apodo ?? "",
        pais: form.pais,
        ccaa: form.ccaa,
        ciudad: form.ciudad,
        centro: form.centro,
        programa: form.programa,
        especialidad: form.especialidad,
        sector: form.sector,
        formato: form.formato,
        requisitos: form.requisitos,
        abandono: form.abandono,
        empleabilidad: form.empleabilidad,
        inversion: form.inversion ? parseFloat(form.inversion) : null,
        estres: form.estres,
        experiencia: form.experiencia,
        comentarios: form.comentarios,
        duracion_oficial: form.duracionOficial ? parseFloat(form.duracionOficial) : null,
        tiempo_real: form.tiempoReal ? parseFloat(form.tiempoReal) : null,
        link_programa: form.linkPrograma,
        link_centro: form.linkCentro,
        published_at: publishedAt,
      }, { onConflict: 'user_id' });

      if (error) {
        console.error(error);
        toast.error("Error al guardar la información");
        return;
      }
    }

    setForm((p) => ({ ...p, publishedAt }));
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
      ? new Date(form.publishedAt).toLocaleDateString(i18n.language, {
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
            {isUpdate ? t("giveForm.thankYou.titleUpdate") : t("giveForm.thankYou.titleNew")}
          </h2>
          <p className="text-muted-foreground text-base">
            {isUpdate ? t("giveForm.thankYou.messageUpdate") : t("giveForm.thankYou.messageNew")}
          </p>
          {apodo && (
            <p className="text-sm text-muted-foreground">
              {t("giveForm.thankYou.publishedAs")}{" "}
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
              <RefreshCcw className="h-4 w-4" /> {t("giveForm.thankYou.update")}
            </Button>
            <Button
              type="button"
              variant="cta"
              onClick={onBack}
              className="rounded-xl gap-2 text-primary-foreground"
            >
              {t("giveForm.thankYou.back")}
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
          <ArrowLeft className="h-4 w-4" /> {t("common.back")}
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <h2 className="text-3xl font-bold text-foreground">
            {t("giveForm.title")}
          </h2>
          <p className="text-muted-foreground">
            {t("giveForm.subtitle")}
          </p>
        </div>

        {/* Apodo notice */}
        {apodo && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-accent/60 border border-border mb-4">
            <AtSign className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-foreground">
              {t("giveForm.apodoNotice")}{" "}
              <span className="font-semibold">@{apodo}</span>.
            </p>
          </div>
        )}

        {/* Anonymity badge */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/60 border border-border mb-8">
          <Shield className="h-5 w-5 text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            {t("giveForm.anonymity")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ---------- LOCALIZACIÓN ---------- */}
          <SectionTitle>{t("giveForm.sections.location")}</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWrapper label={t("giveForm.labels.country")}>
              <SearchableCombobox
                options={countryOptions}
                value={form.pais}
                onChange={(v) => {
                  update("pais", v);
                  update("ciudad", "");
                  update("ccaa", "");
                  update("centro", "");
                }}
                placeholder={t("giveForm.placeholders.country")}
                emptyMessage={t("common.noResults")}
              />
            </FieldWrapper>

            {form.pais === "ES" && (
              <FieldWrapper label={t("giveForm.labels.ccaa")}>
                <SearchableCombobox
                  options={ccaaOptions}
                  value={form.ccaa}
                  onChange={(v) => {
                    update("ccaa", v);
                    update("ciudad", "");
                  }}
                  placeholder={t("giveForm.placeholders.ccaa")}
                />
              </FieldWrapper>
            )}

            <FieldWrapper
              label={form.pais === "ES" ? t("giveForm.labels.province") : t("giveForm.labels.city")}
              hint={!form.pais ? t("giveForm.hints.pickCountryFirst") : undefined}
            >
              <SearchableCombobox
                options={cityOptions}
                value={form.ciudad}
                onChange={(v) => update("ciudad", v)}
                placeholder={
                  form.pais === "ES"
                    ? t("giveForm.placeholders.province")
                    : t("giveForm.placeholders.city")
                }
                disabled={!form.pais}
                allowCustom={form.pais !== "ES"}
                emptyMessage={t("common.noResults")}
              />
            </FieldWrapper>
          </div>

          {/* ---------- ENTIDAD Y PROGRAMA ---------- */}
          <SectionTitle>{t("giveForm.sections.entity")}</SectionTitle>
          <FieldWrapper label={t("giveForm.labels.entity")}>
            <SearchableCombobox
              options={entityOptions}
              value={form.centro}
              onChange={(v) => update("centro", v)}
              placeholder={t("giveForm.placeholders.entity")}
              emptyMessage={t("common.noResults")}
              allowCustom
            />
          </FieldWrapper>

          <FieldWrapper label={t("giveForm.labels.program")}>
            <Input
              placeholder={t("giveForm.placeholders.program")}
              value={form.programa}
              onChange={(e) => update("programa", e.target.value)}
              maxLength={200}
            />
          </FieldWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWrapper label={t("giveForm.labels.specialty")}>
              <Select
                value={form.especialidad}
                onValueChange={(v) => update("especialidad", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("giveForm.placeholders.specialty")} />
                </SelectTrigger>
                <SelectContent>
                  {especialidades.map((e) => (
                    <SelectItem key={e} value={e}>{tSpecialty(e)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldWrapper>

            <FieldWrapper label={t("giveForm.labels.sector")}>
              <Select value={form.sector} onValueChange={(v) => update("sector", v)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("giveForm.placeholders.sector")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Público">{tQuestionnaireOption("Público")}</SelectItem>
                  <SelectItem value="Privado">{tQuestionnaireOption("Privado")}</SelectItem>
                </SelectContent>
              </Select>
            </FieldWrapper>
          </div>

          <FieldWrapper label={t("giveForm.labels.format")}>
            <Select value={form.formato} onValueChange={(v) => update("formato", v)}>
              <SelectTrigger>
                <SelectValue placeholder={t("giveForm.placeholders.format")} />
              </SelectTrigger>
              <SelectContent>
                {formatos.map((f) => (
                  <SelectItem key={f} value={f}>{tFormat(f)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>

          <FieldWrapper
            label={t("giveForm.labels.requirements")}
            hint={t("giveForm.hints.requirements")}
          >
            <Textarea
              placeholder={t("giveForm.placeholders.requirements")}
              value={form.requisitos}
              onChange={(e) => update("requisitos", e.target.value)}
              maxLength={500}
              rows={2}
              className="min-h-[60px]"
            />
          </FieldWrapper>

          {/* ---------- VALORACIÓN ---------- */}
          <SectionTitle>{t("giveForm.sections.rating")}</SectionTitle>

          <FieldWrapper label={t("giveForm.labels.dropout")}>
            <ChipGroup
              items={t("giveForm.dropoutLevels", { returnObjects: true }) as string[]}
              selected={form.abandono}
              onSelect={(i) => update("abandono", i)}
            />
          </FieldWrapper>

          <FieldWrapper label={t("giveForm.labels.employability")}>
            <ChipGroup
              items={t("giveForm.employabilityLevels", { returnObjects: true }) as string[]}
              selected={form.empleabilidad}
              onSelect={(i) => update("empleabilidad", i)}
            />
          </FieldWrapper>

          <FieldWrapper label={t("giveForm.labels.investment")}>
            <Input
              type="number"
              placeholder={t("giveForm.placeholders.investment")}
              value={form.inversion}
              onChange={(e) => update("inversion", e.target.value)}
            />
          </FieldWrapper>

          {/* ---------- DURACIÓN ---------- */}
          <SectionTitle>{t("giveForm.sections.duration")}</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldWrapper label={t("giveForm.labels.officialDuration")}>
              <Input
                type="number"
                min={0.5}
                max={10}
                step={0.5}
                placeholder={t("giveForm.placeholders.years")}
                value={form.duracionOficial}
                onChange={(e) => update("duracionOficial", e.target.value)}
              />
            </FieldWrapper>
            <FieldWrapper label={t("giveForm.labels.myDuration")}>
              <Input
                type="number"
                min={0.5}
                max={10}
                step={0.5}
                placeholder={t("giveForm.placeholders.years")}
                value={form.tiempoReal}
                onChange={(e) => update("tiempoReal", e.target.value)}
              />
            </FieldWrapper>
          </div>

          <FieldWrapper label={t("giveForm.labels.stress")}>
            <div className="flex justify-between gap-2">
              {(t("giveForm.stressLevels", { returnObjects: true }) as string[]).map((label, i) => (
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
                  <span className="text-2xl">{stressLevels[i].emoji}</span>
                  <span className="text-[10px] leading-tight text-center font-medium">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </FieldWrapper>

          {/* ---------- EXPERIENCIA LABORAL ---------- */}
          <SectionTitle>{t("giveForm.sections.experience")}</SectionTitle>
          <p className="text-sm text-muted-foreground -mt-4">
            {t("giveForm.experience.intro")}
          </p>

          <div className="space-y-3">
            {form.experiencia.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-6 text-center">
                <Building2 className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t("giveForm.experience.empty")}
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
                    {t("giveForm.experience.item", { n: idx + 1 })}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={t("giveForm.experience.remove")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder={t("giveForm.placeholders.company")}
                    value={exp.empresa}
                    onChange={(e) => updateExperience(exp.id, "empresa", e.target.value)}
                    maxLength={200}
                  />
                  <Input
                    placeholder={t("giveForm.placeholders.role")}
                    value={exp.puesto}
                    onChange={(e) => updateExperience(exp.id, "puesto", e.target.value)}
                    maxLength={200}
                  />
                </div>
                <Input
                  placeholder={t("giveForm.placeholders.period")}
                  value={exp.anios ?? ""}
                  onChange={(e) => updateExperience(exp.id, "anios", e.target.value)}
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
              <Plus className="h-4 w-4" /> {t("giveForm.experience.add")}
            </Button>
          </div>

          {/* ---------- COMENTARIOS ---------- */}
          <SectionTitle>{t("giveForm.sections.comment")}</SectionTitle>
          <FieldWrapper label={t("giveForm.labels.keyInfo")}>
            <Textarea
              placeholder={t("giveForm.placeholders.comment")}
              value={form.comentarios}
              onChange={(e) => update("comentarios", e.target.value)}
              maxLength={2000}
              rows={4}
            />
            <p className="text-xs text-muted-foreground text-right mt-1">
              {form.comentarios.length}/2000
            </p>
          </FieldWrapper>

          <FieldWrapper label={t("giveForm.labels.programLink")}>
            <Input
              type="url"
              placeholder="https://..."
              value={form.linkPrograma}
              onChange={(e) => update("linkPrograma", e.target.value)}
            />
          </FieldWrapper>

          <FieldWrapper label={t("giveForm.labels.centerLink")}>
            <Input
              type="url"
              placeholder="https://..."
              value={form.linkCentro}
              onChange={(e) => update("linkCentro", e.target.value)}
            />
          </FieldWrapper>

          {/* ---------- ACTIONS ---------- */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="submit"
              size="lg"
              className="flex-1 rounded-xl bg-primary hover:bg-primary/90 font-semibold gap-2"
            >
              <Save className="h-4 w-4" /> {t("giveForm.submit")}
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
