import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle } from "lucide-react";

interface GiveInfoFormProps {
  onBack: () => void;
}

const GiveInfoForm = ({ onBack }: GiveInfoFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    universidad: "",
    numEstudiantes: "",
    tasaAbandono: "",
    tasaExito: "",
    presupuesto: "",
    ubicacion: "",
    sector: "",
  });

  const update = (key: string, value: string) =>
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

  return (
    <section className="min-h-screen flex items-center bg-secondary/50 py-20">
      <div className="container mx-auto px-4 max-w-lg">
        <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver
        </button>
        <div className="bg-card rounded-2xl card-shadow p-8 md:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Dar información</h2>
            <p className="text-muted-foreground">Comparte datos sobre tu universidad</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
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
            <Button type="submit" variant="cta" size="lg" className="w-full rounded-xl">Enviar información</Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default GiveInfoForm;
