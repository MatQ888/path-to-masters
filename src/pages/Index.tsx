import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ActionSelection from "@/components/ActionSelection";
import GiveInfoForm from "@/components/GiveInfoForm";
import GetInfoQuestionnaire from "@/components/GetInfoQuestionnaire";
import Results from "@/components/Results";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { setSessionStarted, useSessionStarted } from "@/hooks/useSessionStarted";

type Step = "hero" | "action" | "give" | "get" | "results";

const Index = () => {
  // Si ya se pulsó "Comenzar" en esta pestaña, o si hay un usuario registrado,
  // saltamos el landing y mostramos directamente la selección Dar/Obtener.
  const sessionStarted = useSessionStarted();
  const existingUser = useCurrentUser();
  const skipHero = sessionStarted || !!existingUser;

  const [step, setStep] = useState<Step>(skipHero ? "action" : "hero");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const apodo = existingUser?.apodo ?? "";
  const mainRef = useRef<HTMLDivElement>(null);

  const goTo = (s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStart = () => {
    setSessionStarted(true);
    goTo("action");
  };

  return (
    <div ref={mainRef} className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        {step === "hero" && <HeroSection onStart={handleStart} />}
        {step === "action" && (
          <ActionSelection onSelect={(action) => goTo(action === "give" ? "give" : "get")} />
        )}
        {step === "give" && <GiveInfoForm onBack={() => goTo("action")} apodo={apodo} />}
        {step === "get" && (
          <GetInfoQuestionnaire
            onComplete={(a) => { setAnswers(a); goTo("results"); }}
            onBack={() => goTo("action")}
          />
        )}
        {step === "results" && <Results answers={answers} onBack={() => goTo("get")} />}
      </div>
    </div>
  );
};

export default Index;
