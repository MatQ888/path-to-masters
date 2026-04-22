import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import RegistrationForm from "@/components/RegistrationForm";
import ActionSelection from "@/components/ActionSelection";
import GiveInfoForm from "@/components/GiveInfoForm";
import GetInfoQuestionnaire from "@/components/GetInfoQuestionnaire";
import Results from "@/components/Results";

type Step = "hero" | "register" | "action" | "give" | "get" | "results";

const Index = () => {
  const [step, setStep] = useState<Step>("hero");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [apodo, setApodo] = useState<string>("");
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
              if (data?.apodo) setApodo(data.apodo);
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
