import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  const update = (key: keyof RegistrationData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const isValid =
    form.nombre.trim() &&
    form.email.trim() &&
    form.telefono.trim() &&
    form.password.trim() &&
    form.esEstudiante !== null &&
    (form.esEstudiante === false || (form.universidad.trim() && form.carrera.trim())) &&
    acceptedPolicy;

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

            {/* Política de privacidad */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="policy"
                checked={acceptedPolicy}
                onCheckedChange={(checked) => setAcceptedPolicy(checked === true)}
                className="mt-0.5"
              />
              <label htmlFor="policy" className="text-sm text-muted-foreground leading-snug">
                He leído y acepto la{" "}
                <button
                  type="button"
                  className="text-primary underline hover:text-primary/80 font-medium"
                  onClick={() => setPolicyOpen(true)}
                >
                  Política de Privacidad
                </button>
              </label>
            </div>

            <Button type="submit" variant="cta" size="lg" className="w-full text-base rounded-xl" disabled={!isValid}>
              Registrarse
            </Button>
          </form>
        </div>
      </div>

      {/* Dialog de Política de Privacidad */}
      <Dialog open={policyOpen} onOpenChange={setPolicyOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold">Política de Privacidad</DialogTitle>
            <DialogDescription>Lee detenidamente antes de aceptar</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] px-6 pb-6">
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed pr-4">
              <p>
                La presente Política de Privacidad establece los términos en que <strong className="text-foreground">Futureyou</strong> usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web. Estamos comprometidos con la seguridad de los datos de nuestros usuarios. usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web. Estamos comprometidos con la seguridad de los datos de nuestros usuarios.
              </p>

              <h3 className="text-base font-semibold text-foreground">1. Información que es recogida</h3>
              <p>Nuestro sitio web podrá recoger información personal como:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-foreground">Identificación:</strong> Nombre completo.</li>
                <li><strong className="text-foreground">Información de contacto:</strong> Correo electrónico y número de teléfono.</li>
                <li><strong className="text-foreground">Datos académicos:</strong> Institución o lugar de estudio.</li>
                <li><strong className="text-foreground">Seguridad:</strong> Contraseña (la cual será encriptada mediante algoritmos de hashing para su protección).</li>
              </ul>

              <h3 className="text-base font-semibold text-foreground">2. Uso de la información recogida</h3>
              <p><p>Futureyou emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para:</p> la información con el fin de proporcionar el mejor servicio posible, particularmente para:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Mantener un registro de usuarios y perfiles personalizados.</li>
                <li>Procesar y personalizar las recomendaciones de mercado basadas en el perfil académico y las respuestas del usuario.</li>
                <li>Enviar notificaciones sobre actualizaciones del servicio o información relevante solicitada por el usuario.</li>
                <li>Garantizar el acceso seguro a la plataforma mediante la verificación de credenciales.</li>
              </ul>

              <h3 className="text-base font-semibold text-foreground">3. Seguridad de los datos</h3>
              <p><p>Futureyou está altamente comprometido para cumplir con el compromiso de mantener su información segura. Usamos los protocolos de seguridad web más actuales y estándares de encriptación avanzados para asegurarnos que no exista ningún acceso no autorizado.</p> comprometido para cumplir con el compromiso de mantener su información segura. Usamos los protocolos de seguridad web más actuales y estándares de encriptación avanzados para asegurarnos que no exista ningún acceso no autorizado.</p>
              <p className="italic">Nota sobre la seguridad: Su contraseña se almacena de forma irreversible; ningún administrador de este sitio tiene acceso a su contraseña en texto plano.</p>

              <h3 className="text-base font-semibold text-foreground">4. Control de su información personal</h3>
              <p>En cualquier momento usted puede restringir la recopilación o el uso de la información personal que es proporcionada a nuestro sitio web.</p>
              <p>Usted tiene derecho a solicitar el acceso, rectificación o eliminación definitiva de sus datos de nuestra base de datos.</p>
              <p>Esta compañía no venderá, cederá ni distribuirá la información personal que es recopilada sin su consentimiento explícito, salvo que sea requerido por una autoridad judicial mediante una orden legal.</p>

              <h3 className="text-base font-semibold text-foreground">5. Enlaces a Terceros</h3>
              <p>Este sitio web pudiera contener enlaces a otros sitios de interés. Una vez que usted haga clic en estos enlaces y abandone nuestra página, <p>Este sitio web pudiera contener enlaces a otros sitios de interés. Una vez que usted haga clic en estos enlaces y abandone nuestra página, Futureyou deja de tener control sobre el sitio al que es redirigido. Por lo tanto, no somos responsables de los términos de privacidad ni de la protección de sus datos en esos otros sitios terceros.</p> control sobre el sitio al que es redirigido. Por lo tanto, no somos responsables de los términos de privacidad ni de la protección de sus datos en esos otros sitios terceros.</p>

              <h3 className="text-base font-semibold text-foreground">6. Actualización de la Política</h3>
              <p>Nos reservamos el derecho de cambiar los términos de la presente Política de Privacidad en cualquier momento para adaptarla a novedades legislativas, jurisprudenciales o prácticas del mercado.</p>

              <p className="pt-2 text-xs border-t border-border mt-4">
                <strong className="text-foreground">Futureyou</strong><br />
                Contacto: [Inserta aquí tu correo de soporte]<br />
                Última actualización: 12/04/2026
              </p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default RegistrationForm;
