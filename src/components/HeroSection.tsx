import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-illustration.png";

interface HeroSectionProps {
  onStart: () => void;
}

const HeroSection = ({ onStart }: HeroSectionProps) => {
  const { t } = useTranslation();
  return (
    <section className="hero-gradient min-h-[calc(100vh-4rem)] flex items-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-foreground rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-foreground rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight">
            {t("hero.title")}
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl">
            {t("hero.subtitle")}
          </p>
          <img
            src={heroImage}
            alt={t("hero.imageAlt")}
            className="w-full max-w-md drop-shadow-lg"
          />
          <Button
            variant="hero"
            size="lg"
            className="text-lg px-12 py-6 rounded-xl"
            onClick={onStart}
          >
            {t("hero.start")}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
