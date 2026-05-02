import { Home, Globe, Library, User, LogOut, FileText, Settings, LogIn, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();

  const goHome = () => {
    setSessionStarted(true);
    navigate("/");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  const setLang = (lang: "es" | "en") => {
    void i18n.changeLanguage(lang);
  };
  const currentLang = (i18n.resolvedLanguage ?? i18n.language ?? "es").slice(0, 2);

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
              <DropdownMenuLabel>{t("nav.language")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLang("es")}>
                <span className="flex-1">Español</span>
                {currentLang === "es" && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang("en")}>
                <span className="flex-1">English</span>
                {currentLang === "en" && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
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
              <span className="hidden sm:inline">{t("nav.library")}</span>
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
                <DropdownMenuLabel>{t("nav.myAccount")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/perfil")}>
                  <User className="h-4 w-4 mr-2" /> {t("nav.myProfile")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/mis-publicaciones")}>
                  <FileText className="h-4 w-4 mr-2" /> {t("nav.myPublications")}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/configuracion")}>
                  <Settings className="h-4 w-4 mr-2" /> {t("nav.settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> {t("nav.logout")}
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
              <span className="hidden sm:inline">{t("nav.login")}</span>
              <span className="sm:hidden">{t("nav.loginShort")}</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
