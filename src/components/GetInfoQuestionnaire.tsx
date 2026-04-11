import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface GetInfoQuestionnaireProps {
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

const steps = [
  {
    key: "presupuesto",
    question: "¿Cuál es tu presupuesto anual?",
    options: ["3.000 €", "5.000 €", "10.000 €", "20.000 €"],
  },
  {
    key: "lugar",
    question: "¿Dónde te gustaría estudiar?",
    options: ["Nacional", "Internacional", "Mixto (un año dentro y otro fuera)"],
  },
  {
    key: "tipo",
    question: "¿Qué tipo de estudios buscas?",
    options: ["Máster"],
  },
  {
    key: "sector",
    question: "¿Prefieres sector público o privado?",
    options: ["Público", "Privado"],
  },
];

const GetInfoQuestionnaire = ({ onComplete, onBack }: GetInfoQuestionnaireProps) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const current = steps[step];
  const selected = answers[current.key];
  const progress = ((step + 1) / steps.length) * 100;

  const select = (value: string) => {
    const newAnswers = { ...answers, [current.key]: value };
    setAnswers(newAnswers);

    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setTimeout(() => onComplete(newAnswers), 300);
    }
  };

  return (
    <section className="min-h-screen flex items-center bg-background py-20">
      <div className="container mx-auto px-4 max-w-lg">
        <button onClick={step > 0 ? () => setStep(step - 1) : onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> {step > 0 ? "Anterior" : "Volver"}
        </button>

        <div className="bg-card rounded-2xl card-shadow p-8 md:p-10 space-y-8">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Paso {step + 1} de {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground">{current.question}</h2>

          <div className="space-y-3">
            {current.options.map((option) => (
              <button
                key={option}
                onClick={() => select(option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  selected === option
                    ? "border-primary bg-accent"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                }`}
              >
                <span className="font-medium text-foreground">{option}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInfoQuestionnaire;
