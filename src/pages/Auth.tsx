import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Rocket, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";

type Genero = "masculino" | "femenino" | "no_indicar" | "";

const Auth = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPwd, setLoginPwd] = useState("");

  // Signup state
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [apodo, setApodo] = useState("");
  const [genero, setGenero] = useState<Genero>("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [esEstudiante, setEsEstudiante] = useState<boolean | null>(null);
  const [universidad, setUniversidad] = useState("");
  const [carrera, setCarrera] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/", { replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate("/", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const signupValid =
    nombre.trim() &&
    apellido.trim() &&
    apodo.trim() &&
    genero !== "" &&
    email.trim() &&
    password.trim().length >= 6 &&
    esEstudiante !== null &&
    (esEstudiante === false || (universidad.trim() && carrera.trim())) &&
    acceptedPolicy;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupValid) {
      toast.error("Completa todos los campos obligatorios");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          apodo: apodo.trim(),
          nombre: nombre.trim(),
          apellido: apellido.trim(),
          genero,
          telefono: telefono.trim(),
          es_estudiante: esEstudiante ? "true" : "false",
          universidad: esEstudiante ? universidad.trim() : "",
          carrera: esEstudiante ? carrera.trim() : "",
          acepto_politica: "true",
        },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("registered") ? "Este email ya está registrado" : error.message);
      return;
    }
    toast.success("¡Cuenta creada!");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPwd });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("Invalid") ? "Email o contraseña incorrectos" : error.message);
      return;
    }
    toast.success("¡Bienvenido!");
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setLoading(false);
      toast.error("No se pudo iniciar sesión con Google");
      return;
    }
    if (result.redirected) return;
  };

  const handleForgot = async () => {
    if (!loginEmail) {
      toast.error("Introduce tu email primero");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Te hemos enviado un email para restablecer la contraseña");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-12 min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground inline-flex items-center justify-center mb-3">
              <Rocket className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">{t("auth.title")}</h1>
            <p className="text-sm text-muted-foreground">{t("auth.subtitle")}</p>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as "login" | "signup")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t("auth.tabLogin")}</TabsTrigger>
              <TabsTrigger value="signup">{t("auth.tabSignup")}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-l">{t("auth.email")}</Label>
                  <Input id="email-l" type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pwd-l">{t("auth.password")}</Label>
                  <Input id="pwd-l" type="password" required value={loginPwd} onChange={(e) => setLoginPwd(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? t("auth.loggingIn") : t("auth.loginBtn")}
                </Button>
                <button
                  type="button"
                  onClick={handleForgot}
                  className="text-xs text-muted-foreground hover:text-primary block mx-auto"
                >
                  {t("auth.forgot")}
                </button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-5">
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("auth.personalData")}
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="nombre">{t("auth.name")}</Label>
                        <Input id="nombre" placeholder={t("auth.namePh")} value={nombre} onChange={(e) => setNombre(e.target.value)} maxLength={100} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="apellido">{t("auth.lastName")}</Label>
                        <Input id="apellido" placeholder={t("auth.lastNamePh")} value={apellido} onChange={(e) => setApellido(e.target.value)} maxLength={100} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="apodo">{t("auth.nickname")}</Label>
                      <Input id="apodo" placeholder={t("auth.nicknamePh")} value={apodo} onChange={(e) => setApodo(e.target.value)} maxLength={50} />
                      <p className="text-xs text-muted-foreground leading-snug">
                        {t("auth.nicknameHint")}
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="genero">{t("auth.gender")}</Label>
                      <Select value={genero} onValueChange={(v) => setGenero(v as Genero)}>
                        <SelectTrigger id="genero">
                          <SelectValue placeholder={t("auth.genderPh")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">{t("auth.male")}</SelectItem>
                          <SelectItem value="femenino">{t("auth.female")}</SelectItem>
                          <SelectItem value="no_indicar">{t("auth.preferNot")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email-s">{t("auth.email")}</Label>
                      <Input id="email-s" type="email" placeholder={t("auth.emailPh")} value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="telefono">{t("auth.phone")}</Label>
                      <Input id="telefono" type="tel" placeholder={t("auth.phonePh")} value={telefono} onChange={(e) => setTelefono(e.target.value)} maxLength={20} />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="pwd-s">{t("auth.password")}</Label>
                      <Input id="pwd-s" type="password" placeholder={t("auth.passwordPh")} minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} maxLength={128} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("auth.academicData")}
                  </h3>
                  <div className="space-y-2">
                    <Label>{t("auth.isStudent")}</Label>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant={esEstudiante === true ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setEsEstudiante(true)}
                      >
                        {t("auth.yes")}
                      </Button>
                      <Button
                        type="button"
                        variant={esEstudiante === false ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setEsEstudiante(false)}
                      >
                        {t("auth.no")}
                      </Button>
                    </div>
                  </div>

                  {esEstudiante === true && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="space-y-1.5">
                        <Label htmlFor="universidad">{t("auth.studyCenter")}</Label>
                        <Input id="universidad" placeholder={t("auth.studyCenterPh")} value={universidad} onChange={(e) => setUniversidad(e.target.value)} maxLength={200} />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="carrera">{t("auth.degree")}</Label>
                        <Input id="carrera" placeholder={t("auth.degreePh")} value={carrera} onChange={(e) => setCarrera(e.target.value)} maxLength={200} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent/50 rounded-lg p-3">
                  <Shield className="h-4 w-4 shrink-0 text-primary" />
                  <span>{t("auth.dataProtected")}</span>
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="policy"
                    checked={acceptedPolicy}
                    onCheckedChange={(checked) => setAcceptedPolicy(checked === true)}
                    className="mt-0.5"
                  />
                  <label htmlFor="policy" className="text-sm text-muted-foreground leading-snug">
                    {t("auth.policyAccept")}{" "}
                    <button
                      type="button"
                      className="text-primary underline hover:text-primary/80 font-medium"
                      onClick={() => setPolicyOpen(true)}
                    >
                      {t("auth.privacyPolicy")}
                    </button>
                  </label>
                </div>

                <Button type="submit" className="w-full" disabled={loading || !signupValid}>
                  {loading ? t("auth.creating") : t("auth.createBtn")}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">{t("auth.or")}</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t("auth.google")}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link to="/" className="hover:text-primary">{t("nav.backHome")}</Link>
          </p>
        </div>
      </div>

      {/* Política de Privacidad */}
      <Dialog open={policyOpen} onOpenChange={setPolicyOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold">Política de Privacidad</DialogTitle>
            <DialogDescription>Lee detenidamente antes de aceptar</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] px-6 pb-6">
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed pr-4">
              <p>
                La presente Política de Privacidad establece los términos en que <strong className="text-foreground">Futureyou</strong> usa y protege la información que es proporcionada por sus usuarios al momento de utilizar su sitio web. Estamos comprometidos con la seguridad de los datos de nuestros usuarios.
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
              <p>Futureyou emplea la información con el fin de proporcionar el mejor servicio posible, particularmente para:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Mantener un registro de usuarios y perfiles personalizados.</li>
                <li>Procesar y personalizar las recomendaciones de mercado basadas en el perfil académico y las respuestas del usuario.</li>
                <li>Enviar notificaciones sobre actualizaciones del servicio o información relevante solicitada por el usuario.</li>
                <li>Garantizar el acceso seguro a la plataforma mediante la verificación de credenciales.</li>
              </ul>

              <h3 className="text-base font-semibold text-foreground">3. Seguridad de los datos</h3>
              <p>Futureyou está altamente comprometido para cumplir con el compromiso de mantener su información segura. Usamos los protocolos de seguridad web más actuales y estándares de encriptación avanzados para asegurarnos que no exista ningún acceso no autorizado.</p>
              <p className="italic">Nota sobre la seguridad: Su contraseña se almacena de forma irreversible; ningún administrador de este sitio tiene acceso a su contraseña en texto plano.</p>

              <h3 className="text-base font-semibold text-foreground">4. Control de su información personal</h3>
              <p>En cualquier momento usted puede restringir la recopilación o el uso de la información personal que es proporcionada a nuestro sitio web.</p>
              <p>Usted tiene derecho a solicitar el acceso, rectificación o eliminación definitiva de sus datos de nuestra base de datos.</p>
              <p>Esta compañía no venderá, cederá ni distribuirá la información personal que es recopilada sin su consentimiento explícito, salvo que sea requerido por una autoridad judicial mediante una orden legal.</p>

              <h3 className="text-base font-semibold text-foreground">5. Enlaces a Terceros</h3>
              <p>Este sitio web pudiera contener enlaces a otros sitios de interés. Una vez que usted haga clic en estos enlaces y abandone nuestra página, Futureyou deja de tener control sobre el sitio al que es redirigido. Por lo tanto, no somos responsables de los términos de privacidad ni de la protección de sus datos en esos otros sitios terceros.</p>

              <h3 className="text-base font-semibold text-foreground">6. Actualización de la Política</h3>
              <p>Nos reservamos el derecho de cambiar los términos de la presente Política de Privacidad en cualquier momento para adaptarla a novedades legislativas, jurisprudenciales o prácticas del mercado.</p>

              <p className="pt-2 text-xs border-t border-border mt-4">
                <strong className="text-foreground">Futureyou</strong><br />
                Última actualización: 12/04/2026
              </p>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
