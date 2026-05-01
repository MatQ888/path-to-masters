import { Home, Globe, Library, User, LogOut, FileText, Settings, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser, setCurrentUser } from "@/hooks/useCurrentUser";
import { useLibrary } from "@/hooks/useLibrary";
import { setSessionStarted } from "@/hooks/useSessionStarted";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const user = useCurrentUser();
  const { items } = useLibrary();
  const navigate = useNavigate();

  const goHome = () => {
    // Vuelve a la pantalla de selección Dar/Obtener (no al landing).
    setSessionStarted(true);
    navigate("/");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  // TODO: cambio real de idioma en Fase B (i18n).
  const setLang = (_lang: "es" | "en") => {
    // Placeholder hasta que se conecte react-i18next.
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 grid grid-cols-3 items-center">
        {/* Izquierda: Home + Idioma */}
        <div className="flex items-center gap-1 justify-self-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={goHome}
            aria-label="Ir al inicio"
            className="text-foreground"
          >
            <Home className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Cambiar idioma" className="text-foreground">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Idioma</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLang("es")}>Español</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("en")}>English</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Centro: logo marca de agua */}
        <button
          onClick={goHome}
          className="justify-self-center select-none"
          aria-label="Futureyou"
        >
          <span className="font-bold text-xl tracking-tight text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors">
            Futureyou
          </span>
        </button>

        {/* Derecha: biblioteca + usuario */}
        <div className="flex items-center gap-2 justify-self-end">
          {user && (
            <Link
              to="/biblioteca"
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
              aria-label="Abrir Biblioteca"
            >
              <Library className="h-5 w-5 text-primary" />
              <span className="hidden sm:inline">Biblioteca</span>
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 sm:static sm:ml-1 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  {items.length}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center text-xs font-semibold">
                    {user.apodo.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline text-sm font-medium">{user.apodo}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/perfil")}>
                  <User className="h-4 w-4 mr-2" /> Mi Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/mis-publicaciones")}>
                  <FileText className="h-4 w-4 mr-2" /> Mis Publicaciones
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/configuracion")}>
                  <Settings className="h-4 w-4 mr-2" /> Configuración
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="cta"
              size="sm"
              onClick={() => navigate("/auth")}
              className="gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Iniciar sesión</span>
              <span className="sm:hidden">Entrar</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
