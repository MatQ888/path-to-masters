import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GiveInfoFormProps {
  onBack: () => void;
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

const GiveInfoForm = ({ onBack }: GiveInfoFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    especialidad: "",
    ubicacion: "",
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
  });

  const update = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center" style={{ background: "#2b61ee" }}>
        <div className="w-full max-w-lg text-center space-y-6 px-4">
          <CheckCircle className="h-16 w-16 text-white mx-auto" />
          <h2 className="text-3xl font-bold text-white">¡Gracias!</h2>
          <p className="text-white/80 text-lg">Tu información ha sido enviada correctamente.</p>
          <Button
            variant="outline"
            onClick={onBack}
            className="border-white/30 text-white hover:bg-white/10"
          >
            Volver al inicio
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen py-12" style={{ background: "#2b61ee" }}>
      <div className="container mx-auto px-4 max-w-2xl">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-bold text-white">Compartir información</h2>
          <p className="text-white/70">
            Ayuda a otros usuarios compartiendo tu experiencia académica o profesional.
          </p>
        </div>

        {/* Anonymity badge */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/10 mb-8">
          <Shield className="h-5 w-5 text-white/80 shrink-0" />
          <p className="text-sm text-white/70">
            Tu información será completamente anónima y se utilizará únicamente para ayudar a otros usuarios.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-6"
        >
          {/* Especialidad */}
          <FieldWrapper label="Especialidad">
            <Select value={form.especialidad} onValueChange={(v) => update("especialidad", v)}>
              <SelectTrigger className="bg-white/10 border-0 text-white placeholder:text-white/40 focus:ring-white/30 [&>svg]:text-white/60">
                <SelectValue placeholder="Selecciona una especialidad" />
              </SelectTrigger>
              <SelectContent>
                {especialidades.map((e) => (
                  <SelectItem key={e} value={e}>{e}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>

          {/* Ubicación */}
          <FieldWrapper label="Ubicación">
            <Input
              placeholder="Ej: Madrid, España"
              value={form.ubicacion}
              onChange={(e) => update("ubicacion", e.target.value)}
              maxLength={200}
              className="bg-white/10 border-0 text-white placeholder:text-white/40 focus-visible:ring-white/30"
            />
          </FieldWrapper>

          {/* Centro */}
          <FieldWrapper label="Universidad, Centro de Máster o Empresa">
            <Input
              placeholder="Nombre donde estudias o trabajas"
              value={form.centro}
              onChange={(e) => update("centro", e.target.value)}
              maxLength={200}
              className="bg-white/10 border-0 text-white placeholder:text-white/40 focus-visible:ring-white/30"
            />
          </FieldWrapper>

          {/* Programa */}
          <FieldWrapper label="Grado, Máster o Puesto de trabajo">
            <Input
              placeholder="Ej: Ingeniería Aeroespacial / Data Analyst"
              value={form.programa}
              onChange={(e) => update("programa", e.target.value)}
              maxLength={200}
              className="bg-white/10 border-0 text-white placeholder:text-white/40 focus-visible:ring-white/30"
            />
          </FieldWrapper>

          {/* Sector */}
          <FieldWrapper label="Sector">
            <Select value={form.sector} onValueChange={(v) => update("sector", v)}>
              <SelectTrigger className="bg-white/10 border-0 text-white placeholder:text-white/40 focus:ring-white/30 [&>svg]:text-white/60">
                <SelectValue placeholder="Selecciona un sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Público">Público</SelectItem>
                <SelectItem value="Privado">Privado</SelectItem>
              </SelectContent>
            </Select>
          </FieldWrapper>

          {/* Formato */}
          <FieldWrapper label="¿En qué formato se imparte?">
            <Select value={form.formato} onValueChange={(v) => update("formato", v)}>
              <SelectTrigger className="bg-white/10 border-0 text-white placeholder:text-white/40 focus:ring-white/30 [&>svg]:text-white/60">
                <SelectValue placeholder="Selecciona un formato" />
              </SelectTrigger>
              <SelectContent>
                {formatos.map((f) => (
                  <SelectItem key={f} value={f}>{f}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldWrapper>

          {/* Requisitos */}
          <FieldWrapper
            label="Requisitos o Nota de corte"
            hint="Si es universidad pon la nota de corte. Si es Máster o Empresa, describe brevemente el proceso (Ej: Entrevista + Inglés B2)"
          >
            <Textarea
              placeholder="Ej: 12.5 / Entrevista + Portfolio"
              value={form.requisitos}
              onChange={(e) => update("requisitos", e.target.value)}
              maxLength={500}
              rows={2}
              className="bg-white/10 border-0 text-white placeholder:text-white/40 focus-visible:ring-white/30 min-h-[60px]"
            />
          </FieldWrapper>

          {/* Abandono */}
          <FieldWrapper label="¿Qué nivel de abandono percibes?">
            <div className="grid grid-cols-5 gap-2">
              {abandonoLevels.map((level, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => update("abandono", i)}
                  className={`p-3 rounded-xl text-xs text-center transition-all leading-tight ${
                    form.abandono === i
                      ? "bg-white text-[#2b61ee] font-semibold shadow-lg scale-105"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </FieldWrapper>

          {/* Empleabilidad */}
          <FieldWrapper label="¿Cómo ves la salida laboral?">
            <div className="grid grid-cols-5 gap-2">
              {empleabilidadLevels.map((level, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => update("empleabilidad", i)}
                  className={`p-3 rounded-xl text-xs text-center transition-all leading-tight ${
                    form.empleabilidad === i
                      ? "bg-white text-[#2b61ee] font-semibold shadow-lg scale-105"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </FieldWrapper>

          {/* Inversión */}
          <FieldWrapper label="Precio o Inversión anual aproximada (€)">
            <Input
              type="number"
              placeholder="Ej: 8000"
              value={form.inversion}
              onChange={(e) => update("inversion", e.target.value)}
              className="bg-white/10 border-0 text-white placeholder:text-white/40 focus-visible:ring-white/30"
            />
          </FieldWrapper>

          {/* Estrés */}
          <FieldWrapper label="Nivel de estrés">
            <div className="flex justify-between gap-2">
              {stressLevels.map((level, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => update("estres", i)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all flex-1 ${
                    form.estres === i
                      ? "bg-white text-[#2b61ee] shadow-lg scale-110"
                      : "bg-white/10 text-white/80 hover:bg-white/20"
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

          {/* Comentarios */}
          <FieldWrapper label="Información clave para otros usuarios">
            <Textarea
              placeholder="Cuéntanos sobre la calidad de los profesores, si es muy teórico o práctico, y si los contactos que haces valen la pena"
              value={form.comentarios}
              onChange={(e) => update("comentarios", e.target.value)}
              maxLength={2000}
              rows={4}
              className="bg-white/10 border-0 text-white placeholder:text-white/40 focus-visible:ring-white/30"
            />
            <p className="text-xs text-white/40 text-right mt-1">
              {form.comentarios.length}/2000
            </p>
          </FieldWrapper>

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-2xl bg-white text-[#2b61ee] hover:bg-white/90 font-bold text-lg py-6 shadow-lg"
          >
            Enviar información
          </Button>
        </form>
      </div>
    </section>
  );
};

/* Reusable field wrapper for consistent label styling */
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
    <Label className="text-white font-medium text-sm">{label}</Label>
    {hint && <p className="text-xs text-white/50">{hint}</p>}
    {children}
  </div>
);

export default GiveInfoForm;
