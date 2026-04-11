import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

interface RegistrationData {
  nombre: string;
  email: string;
  telefono: string;
  password: string;
  esEstudiante: boolean | null;
  universidad: string;
  carrera: string;
}

interface RegistrationFormProps {
  onComplete: (data: RegistrationData) => void;
}

const RegistrationForm = ({ onComplete }: RegistrationFormProps) => {
  const [form, setForm] = useState<RegistrationData>({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    esEstudiante: null,
    universidad: "",
    carrera: "",
  });

  const update = (key: keyof RegistrationData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid =
    form.nombre.trim() &&
    form.email.trim() &&
    form.telefono.trim() &&
    form.password.trim() &&
    form.esEstudiante !== null &&
    (form.esEstudiante === false || (form.universidad.trim() && form.carrera.trim()));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) onComplete(form);
  };

  return (
    <section className="min-h-screen flex items-center bg-secondary/50 py-20">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="bg-card rounded-2xl card-shadow p-8 md:p-10 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Crea tu cuenta</h2>
            <p className="text-muted-foreground">Comienza a descubrir tu futuro profesional</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Datos personales
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" placeholder="Tu nombre completo" value={form.nombre} onChange={(e) => update("nombre", e.target.value)} maxLength={100} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" value={form.email} onChange={(e) => update("email", e.target.value)} maxLength={255} />
                </div>
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" type="tel" placeholder="+34 600 000 000" value={form.telefono} onChange={(e) => update("telefono", e.target.value)} maxLength={20} />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" type="password" placeholder="Crea una contraseña segura" value={form.password} onChange={(e) => update("password", e.target.value)} maxLength={128} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Información académica
              </h3>
              <div>
                <Label>¿Eres estudiante?</Label>
                <div className="flex gap-3 mt-2">
                  <Button
                    type="button"
                    variant={form.esEstudiante === true ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => update("esEstudiante", true)}
                  >
                    Sí
                  </Button>
                  <Button
                    type="button"
                    variant={form.esEstudiante === false ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => update("esEstudiante", false)}
                  >
                    No
                  </Button>
                </div>
              </div>

              {form.esEstudiante === true && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div>
                    <Label htmlFor="universidad">Universidad</Label>
                    <Input id="universidad" placeholder="Nombre de tu universidad" value={form.universidad} onChange={(e) => update("universidad", e.target.value)} maxLength={200} />
                  </div>
                  <div>
                    <Label htmlFor="carrera">Carrera</Label>
                    <Input id="carrera" placeholder="Carrera que estudias" value={form.carrera} onChange={(e) => update("carrera", e.target.value)} maxLength={200} />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/50 rounded-lg p-3">
              <Shield className="h-4 w-4 shrink-0 text-primary" />
              <span>Tus datos son confidenciales y están protegidos.</span>
            </div>

            <Button type="submit" variant="cta" size="lg" className="w-full text-base rounded-xl" disabled={!isValid}>
              Registrarse
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default RegistrationForm;
