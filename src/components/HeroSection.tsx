import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.jpg";

interface HeroSectionProps {
  onStart: () => void;
}

const HeroSection = ({ onStart }: HeroSectionProps) => {
  return (
    <section className="hero-gradient min-h-[90vh] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            Buscamos facilitar la elección de tu futuro profesional
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl">
            Te recomendamos másteres personalizados según tu perfil, presupuesto y objetivos profesionales. Descubre el camino que mejor se adapta a ti.
          </p>
          <img
            src={heroImage}
            alt="Ilustración de orientación académica y profesional"
            className="rounded-2xl shadow-2xl w-full max-w-lg"
          />
          <Button variant="hero" size="lg" className="text-lg px-10 py-6 rounded-xl" onClick={onStart}>
            Empieza ahora
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
