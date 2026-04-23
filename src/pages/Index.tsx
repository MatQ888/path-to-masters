import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RegistrationForm from "@/components/RegistrationForm";
import ActionSelection from "@/components/ActionSelection";
import GiveInfoForm from "@/components/GiveInfoForm";
import GetInfoQuestionnaire from "@/components/GetInfoQuestionnaire";
import Results from "@/components/Results";
import { setCurrentUser, useCurrentUser } from "@/hooks/useCurrentUser";

type Step = "hero" | "register" | "action" | "give" | "get" | "results";

const Index = () => {
  // Si el usuario ya se registró, saltamos directos a la selección de acción.
  // Esto permite que botones como "Volver" o "Explorar másters" desde la
  // Biblioteca lleven al usuario a la pantalla de elegir entre Dar/Obtener
  // información, en lugar de obligarle a registrarse de nuevo.
  const existingUser = useCurrentUser();
  const [step, setStep] = useState<Step>(existingUser ? "action" : "hero");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [apodo, setApodo] = useState<string>(existingUser?.apodo ?? "");
  const mainRef = useRef<HTMLDivElement>(null);

  const goTo = (s: Step) => {
    setStep(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={mainRef} className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        {step === "hero" && <HeroSection onStart={() => goTo("register")} />}
        {step === "register" && (
          <RegistrationForm
            onComplete={(data) => {
              if (data?.apodo) {
                setApodo(data.apodo);
                setCurrentUser({ apodo: data.apodo, nombre: data.nombre });
              }
              goTo("action");
            }}
          />
        )}
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
