import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle } from "lucide-react";
import CompanyExperienceForm from "./CompanyExperienceForm";

interface GiveInfoFormProps {
  onBack: () => void;
}

const stressLevels = [
  { emoji: "😊", label: "Muy relajado" },
  { emoji: "🙂", label: "Relajado" },
  { emoji: "😐", label: "Normal" },
  { emoji: "😰", label: "Estresado" },
  { emoji: "🥵", label: "Muy estresado" },
];

const GiveInfoForm = ({ onBack }: GiveInfoFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [userType, setUserType] = useState<"universidad" | "master" | "empresa" | "">(
    ""
  );
  const [form, setForm] = useState({
    universidad: "",
    numEstudiantes: "",
    tasaAbandono: "",
    tasaExito: "",
    tasaEmpleo: "",
    presupuesto: "",
    ubicacion: "",
    sector: "",
    nivelEstres: -1,
    comentarios: "",
    // Master student fields
    nombreMaster: "",
    experiencia: "",
    satisfaccion: -1,
  });

  const update = (key: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center bg-secondary/50 py-20">
        <div className="container mx-auto px-4 max-w-lg text-center space-y-6">
          <CheckCircle className="h-16 w-16 text-primary mx-auto" />
          <h2 className="text-3xl font-bold text-foreground">¡Gracias!</h2>
          <p className="text-muted-foreground text-lg">Tu información ha sido enviada correctamente.</p>
          <Button variant="outline" onClick={onBack}>Volver al inicio</Button>
        </div>
      </section>
    );
  }

  if (!userType) {
    return (
      <section className="min-h-screen flex items-center bg-secondary/50 py-20">
        <div className="container mx-auto px-4 max-w-lg">
          <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver
          </button>
          <div className="bg-card rounded-2xl card-shadow p-8 md:p-10 space-y-6 text-center">
            <h2 className="text-3xl font-bold text-foreground">Dar información</h2>
            <p className="text-muted-foreground">Comparte datos sobre tu centro de estudios para ayudar a otros estudiantes</p>
            <div className="grid gap-4">
              <Button variant="outline" size="lg" className="h-auto py-6 flex flex-col gap-2" onClick={() => setUserType("universidad")}>
                <span className="text-2xl">🏛️</span>
                <span className="font-semibold">Soy parte de una universidad</span>
                <span className="text-sm text-muted-foreground">Aporta datos institucionales</span>
              </Button>
              <Button variant="outline" size="lg" className="h-auto py-6 flex flex-col gap-2" onClick={() => setUserType("master")}>
                <span className="text-2xl">🎓</span>
                <span className="font-semibold">Estudio o estudié un máster</span>
                <span className="text-sm text-muted-foreground">Comparte tu experiencia</span>
              </Button>
              <Button variant="outline" size="lg" className="h-auto py-6 flex flex-col gap-2" onClick={() => setUserType("empresa")}>
                <span className="text-2xl">🏢</span>
                <span className="font-semibold">Trabajo o trabajé en una empresa</span>
                <span className="text-sm text-muted-foreground">Comparte tu experiencia profesional</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex items-center bg-secondary/50 py-20">
      <div className="container mx-auto px-4 max-w-lg">
        <button onClick={() => setUserType("")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
        <div className="bg-card rounded-2xl card-shadow p-8 md:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              {userType === "universidad" ? "Información de universidad" : "Tu experiencia en el máster"}
            </h2>
            <p className="text-muted-foreground">
              {userType === "universidad" ? "Comparte datos sobre tu universidad" : "Cuéntanos sobre tu experiencia"}
            </p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
            {userType === "universidad" ? (
              <>
                <div>
                  <Label>Universidad</Label>
                  <Input placeholder="Nombre de la universidad" value={form.universidad} onChange={(e) => update("universidad", e.target.value)} maxLength={200} />
                </div>
                <div>
                  <Label>Número aproximado de estudiantes</Label>
                  <Input type="number" placeholder="Ej: 25000" value={form.numEstudiantes} onChange={(e) => update("numEstudiantes", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tasa de abandono (%)</Label>
                    <Input type="number" placeholder="Ej: 15" value={form.tasaAbandono} onChange={(e) => update("tasaAbandono", e.target.value)} />
                  </div>
                  <div>
                    <Label>Tasa de éxito (%)</Label>
                    <Input type="number" placeholder="Ej: 85" value={form.tasaExito} onChange={(e) => update("tasaExito", e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label>Tasa de empleo al salir (%)</Label>
                  <Input type="number" placeholder="Ej: 75" value={form.tasaEmpleo} onChange={(e) => update("tasaEmpleo", e.target.value)} />
                </div>
                <div>
                  <Label>Presupuesto anual aproximado (€)</Label>
                  <Input type="number" placeholder="Ej: 500000" value={form.presupuesto} onChange={(e) => update("presupuesto", e.target.value)} />
                </div>
                <div>
                  <Label>Ubicación</Label>
                  <Input placeholder="Ciudad, País" value={form.ubicacion} onChange={(e) => update("ubicacion", e.target.value)} maxLength={200} />
                </div>
                <div>
                  <Label>Sector</Label>
                  <div className="flex gap-3 mt-2">
                    {["Público", "Privado"].map((s) => (
                      <Button key={s} type="button" variant={form.sector === s ? "default" : "outline"} className="flex-1" onClick={() => update("sector", s)}>
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label>Universidad / Centro</Label>
                  <Input placeholder="Nombre de la universidad" value={form.universidad} onChange={(e) => update("universidad", e.target.value)} maxLength={200} />
                </div>
                <div>
                  <Label>Nombre del máster</Label>
                  <Input placeholder="Ej: Máster en Data Science" value={form.nombreMaster} onChange={(e) => update("nombreMaster", e.target.value)} maxLength={200} />
                </div>
                <div>
                  <Label>Tasa de empleo al salir (%)</Label>
                  <Input type="number" placeholder="Ej: 80" value={form.tasaEmpleo} onChange={(e) => update("tasaEmpleo", e.target.value)} />
                </div>
                <div>
                  <Label>¿Cómo fue tu experiencia?</Label>
                  <Textarea placeholder="Cuéntanos sobre el máster, los profesores, el contenido..." value={form.experiencia} onChange={(e) => update("experiencia", e.target.value)} maxLength={1000} rows={4} />
                </div>
              </>
            )}

            {/* Stress Level */}
            <div>
              <Label>Nivel de estrés</Label>
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
                    <span className="text-3xl">{level.emoji}</span>
                    <span className="text-[10px] text-muted-foreground leading-tight text-center">{level.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <Label>Comentarios adicionales</Label>
              <Textarea
                placeholder="Cualquier información adicional que quieras compartir..."
                value={form.comentarios}
                onChange={(e) => update("comentarios", e.target.value)}
                maxLength={2000}
                rows={4}
              />
            </div>

            <Button type="submit" variant="cta" size="lg" className="w-full rounded-xl">Enviar información</Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GiveInfoForm;
