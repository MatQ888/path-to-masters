import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-illustration.png";

interface HeroSectionProps {
  onStart: () => void;
}

const HeroSection = ({ onStart }: HeroSectionProps) => {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center text-center space-y-10 max-w-2xl mx-auto">
          <img
            src={heroImage}
            alt="Estudiante frente a dos caminos: dar u obtener información"
            className="w-full max-w-lg"
          />
          <Button
            variant="cta"
            size="lg"
            className="text-lg px-12 py-6 rounded-xl"
            onClick={onStart}
          >
            Comenzar
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
