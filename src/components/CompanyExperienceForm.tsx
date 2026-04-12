import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, CheckCircle, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CompanyExperienceFormProps {
  onBack: () => void;
}

const sectores = [
  "Tecnología",
  "Ingeniería",
  "Finanzas",
  "Consultoría",
  "Salud",
  "Educación",
  "Industria",
  "Otros",
];

const salaryRanges = [
  "< 15.000 €",
  "15.000 – 25.000 €",
  "25.000 – 40.000 €",
  "40.000 – 60.000 €",
  "> 60.000 €",
];

const stressLevels = [
  { emoji: "😊", label: "Muy bajo" },
  { emoji: "🙂", label: "Bajo" },
  { emoji: "😐", label: "Medio" },
  { emoji: "😰", label: "Alto" },
  { emoji: "🥵", label: "Muy alto" },
];

const growthLevels = [
  { label: "Muy difícil", color: "border-destructive bg-destructive/10" },
  { label: "Difícil", color: "border-orange-400 bg-orange-50" },
  { label: "Normal", color: "border-border" },
  { label: "Fácil", color: "border-green-400 bg-green-50" },
  { label: "Muy fácil", color: "border-primary bg-primary/10" },
];

const recommendOptions = [
  { label: "Sí", emoji: "👍" },
  { label: "No", emoji: "👎" },
  { label: "Depende", emoji: "🤔" },
];

const experienceYears = ["< 1 año", "1-2 años", "3-5 años", "5-10 años", "> 10 años"];

const CompanyExperienceForm = ({ onBack }: CompanyExperienceFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [showExactSalary, setShowExactSalary] = useState(false);
  const [form, setForm] = useState({
    empresa: "",
    sectorEmpresa: "",
    puesto: "",
    anosExperiencia: "",
    rangoSalario: "",
    salarioExacto: "",
    nivelEstres: -1,
    experiencia: "",
    crecimiento: -1,
    recomendacion: "",
  });

  const update = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid =
    form.empresa.trim() &&
    form.sectorEmpresa &&
    form.puesto.trim() &&
    form.anosExperiencia &&
    (form.rangoSalario || form.salarioExacto) &&
    form.nivelEstres >= 0 &&
    form.crecimiento >= 0 &&
    form.recomendacion;

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center bg-secondary/50 py-20">
        <div className="container mx-auto px-4 max-w-lg text-center space-y-6">
          <CheckCircle className="h-16 w-16 text-primary mx-auto" />
          <h2 className="text-3xl font-bold text-foreground">¡Gracias!</h2>
          <p className="text-muted-foreground text-lg">
            Tu experiencia profesional ha sido registrada de forma anónima.
          </p>
          <Button variant="outline" onClick={onBack}>
            Volver al inicio
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center bg-secondary/50 py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>

        <div className="bg-card rounded-2xl card-shadow p-8 md:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Comparte tu experiencia profesional
            </h2>
            <p className="text-muted-foreground">
              Ayuda a otros usuarios a conocer cómo es realmente trabajar en una empresa.
            </p>
          </div>

          {/* Anonymity badge */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
            <Shield className="h-5 w-5 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              Tu información será completamente anónima y se utilizará únicamente para ayudar a otros usuarios.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isValid) setSubmitted(true);
            }}
            className="space-y-8"
          >
            {/* Block 1: Basic Info */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                📋 Información básica
              </h3>
              <div>
                <Label>Nombre de la empresa</Label>
                <Input
                  placeholder="Ej: Accenture, Telefónica..."
                  value={form.empresa}
                  onChange={(e) => update("empresa", e.target.value)}
                  maxLength={200}
                />
              </div>
              <div>
                <Label>Sector de la empresa</Label>
                <Select value={form.sectorEmpresa} onValueChange={(v) => update("sectorEmpresa", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectores.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Puesto desempeñado</Label>
                <Input
                  placeholder="Ej: Analista de datos, Ingeniero de software..."
                  value={form.puesto}
                  onChange={(e) => update("puesto", e.target.value)}
                  maxLength={200}
                />
              </div>
              <div>
                <Label>Años de experiencia en la empresa</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {experienceYears.map((y) => (
                    <Button
                      key={y}
                      type="button"
                      variant={form.anosExperiencia === y ? "default" : "outline"}
                      size="sm"
                      onClick={() => update("anosExperiencia", y)}
                    >
                      {y}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Block 2: Salary */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                💰 Condiciones económicas
              </h3>
              <div>
                <Label>¿Cuál era tu salario medio anual?</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {salaryRanges.map((r) => (
                    <Button
                      key={r}
                      type="button"
                      variant={form.rangoSalario === r ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        update("rangoSalario", r);
                        setShowExactSalary(false);
                        update("salarioExacto", "");
                      }}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
                <button
                  type="button"
                  className="text-sm text-primary hover:underline mt-2"
                  onClick={() => {
                    setShowExactSalary(!showExactSalary);
                    update("rangoSalario", "");
                  }}
                >
                  {showExactSalary ? "Seleccionar rango" : "Introducir cifra exacta"}
                </button>
                {showExactSalary && (
                  <Input
                    type="number"
                    placeholder="Ej: 35000"
                    value={form.salarioExacto}
                    onChange={(e) => update("salarioExacto", e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>
            </div>

            {/* Block 3: Stress */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                🧠 Nivel de estrés
              </h3>
              <div>
                <Label>¿Cómo valorarías el nivel de estrés en tu trabajo?</Label>
                <div className="flex justify-between mt-3 gap-2">
                  {stressLevels.map((level, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => update("nivelEstres", i)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all flex-1 ${
                        form.nivelEstres === i
                          ? "border-primary bg-primary/10 scale-110"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className="text-2xl">{level.emoji}</span>
                      <span className="text-[10px] text-muted-foreground leading-tight text-center">
                        {level.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Block 4: Experience */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                📝 Experiencia laboral
              </h3>
              <div>
                <Label>Describe tu experiencia en la empresa</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Ambiente, carga de trabajo, aprendizaje, conciliación, cultura de empresa...
                </p>
                <Textarea
                  placeholder="Cuéntanos cómo ha sido tu experiencia..."
                  value={form.experiencia}
                  onChange={(e) => update("experiencia", e.target.value)}
                  maxLength={2000}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground text-right mt-1">
                  {form.experiencia.length}/2000
                </p>
              </div>
            </div>

            {/* Block 5: Growth */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                📈 Escalabilidad / Crecimiento
              </h3>
              <div>
                <Label>¿Cómo de fácil es crecer profesionalmente en esta empresa?</Label>
                <div className="flex flex-wrap gap-2 mt-3">
                  {growthLevels.map((level, i) => (
                    <Button
                      key={i}
                      type="button"
                      variant={form.crecimiento === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => update("crecimiento", i)}
                    >
                      {level.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Block 6: Recommendation */}
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-foreground border-b border-border pb-2">
                ⭐ Recomendación
              </h3>
              <div>
                <Label>¿Recomendarías esta empresa?</Label>
                <div className="flex gap-3 mt-3">
                  {recommendOptions.map((opt) => (
                    <Button
                      key={opt.label}
                      type="button"
                      variant={form.recomendacion === opt.label ? "default" : "outline"}
                      className="flex-1 h-auto py-4 flex flex-col gap-1"
                      onClick={() => update("recomendacion", opt.label)}
                    >
                      <span className="text-2xl">{opt.emoji}</span>
                      <span className="text-sm">{opt.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="cta"
              size="lg"
              className="w-full rounded-xl"
              disabled={!isValid}
            >
              Enviar información
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CompanyExperienceForm;
