import { Rocket, Library } from "lucide-react";
import { Link } from "react-router-dom";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useLibrary } from "@/hooks/useLibrary";

const Navbar = () => {
  const user = useCurrentUser();
  const { items } = useLibrary();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Rocket className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-foreground">Futureyou</span>
        </Link>

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
      </div>
    </nav>
  );
};

export default Navbar;
