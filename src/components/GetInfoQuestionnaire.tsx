import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GetInfoQuestionnaireProps {
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

type StepType = "options" | "autocomplete";

interface StepDef {
  key: string;
  question: string;
  type: StepType;
  options?: string[];
  getOptions?: (answers: Record<string, string>) => string[];
  condition?: (answers: Record<string, string>) => boolean;
}

const provincias = ["Madrid", "Barcelona", "Andalucía", "Galicia"];

const ciudadesPorProvincia: Record<string, string[]> = {
  Madrid: ["Madrid"],
  Barcelona: ["Barcelona"],
  Andalucía: ["Sevilla", "Málaga", "Granada", "Córdoba", "Almería", "Cádiz", "Huelva", "Jaén"],
  Galicia: ["Santiago de Compostela", "A Coruña", "Vigo", "Ourense", "Lugo", "Pontevedra"],
};

const paises = [
  "Estados Unidos", "Argentina", "Alemania", "Francia", "Noruega",
  "Reino Unido", "Países Bajos", "Suiza", "Canadá", "Australia",
  "Japón", "Suecia", "Italia", "Dinamarca", "Singapur",
];

const ciudadesPorPais: Record<string, string[]> = {
  "Estados Unidos": ["Nueva York", "Boston", "San Francisco", "Los Ángeles", "Chicago", "Cambridge"],
  "Argentina": ["Buenos Aires", "Córdoba", "Rosario", "Mendoza"],
  "Alemania": ["Berlín", "Múnich", "Hamburgo", "Frankfurt", "Heidelberg"],
  "Francia": ["París", "Lyon", "Toulouse", "Marsella", "Estrasburgo"],
  "Noruega": ["Oslo", "Bergen", "Trondheim", "Tromsø"],
  "Reino Unido": ["Londres", "Oxford", "Cambridge", "Edimburgo", "Mánchester"],
  "Países Bajos": ["Ámsterdam", "Róterdam", "La Haya", "Utrecht", "Leiden"],
  "Suiza": ["Zúrich", "Ginebra", "Lausana", "Basilea", "Berna"],
  "Canadá": ["Toronto", "Montreal", "Vancouver", "Ottawa"],
  "Australia": ["Sídney", "Melbourne", "Brisbane", "Canberra"],
  "Japón": ["Tokio", "Kioto", "Osaka", "Nagoya"],
  "Suecia": ["Estocolmo", "Gotemburgo", "Lund", "Upsala"],
  "Italia": ["Milán", "Roma", "Bolonia", "Turín", "Florencia"],
  "Dinamarca": ["Copenhague", "Aarhus", "Odense"],
  "Singapur": ["Singapur"],
};

const isInternational = (a: Record<string, string>) =>
  a.lugar === "Internacional" || a.lugar === "Mixto (un año dentro y otro fuera)";
const isNational = (a: Record<string, string>) =>
  a.lugar === "Nacional" || a.lugar === "Mixto (un año dentro y otro fuera)";

const allSteps: StepDef[] = [
  {
    key: "presupuesto",
    question: "¿Cuál es tu presupuesto anual?",
    type: "options",
    options: ["3.000 €", "5.000 €", "10.000 €", "20.000 €"],
  },
  {
    key: "lugar",
    question: "¿Dónde te gustaría estudiar?",
    type: "options",
    options: ["Nacional", "Internacional", "Mixto (un año dentro y otro fuera)"],
  },
  {
    key: "provincia",
    question: "¿En qué provincia te gustaría estudiar?",
    type: "autocomplete",
    getOptions: () => provincias,
    condition: (a) => isNational(a),
  },
  {
    key: "ciudad",
    question: "¿En qué ciudad te gustaría estudiar?",
    type: "autocomplete",
    getOptions: (a) => ciudadesPorProvincia[a.provincia] || [],
    condition: (a) => isNational(a) && !!a.provincia,
  },
  {
    key: "pais",
    question: "¿En qué país te gustaría estudiar?",
    type: "autocomplete",
    getOptions: () => paises,
    condition: (a) => isInternational(a),
  },
  {
    key: "ciudadInternacional",
    question: "¿En qué ciudad te gustaría estudiar?",
    type: "autocomplete",
    getOptions: (a) => ciudadesPorPais[a.pais] || [],
    condition: (a) => isInternational(a) && !!a.pais,
  },
  {
    key: "tipo",
    question: "¿Qué tipo de estudios buscas?",
    type: "options",
    options: ["Máster"],
  },
  {
    key: "sector",
    question: "¿Prefieres sector público o privado?",
    type: "options",
    options: ["Público", "Privado"],
  },
];

const GetInfoQuestionnaire = ({ onComplete, onBack }: GetInfoQuestionnaireProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [searchText, setSearchText] = useState("");

  const visibleSteps = useMemo(
    () => allSteps.filter((s) => !s.condition || s.condition(answers)),
    [answers]
  );

  const current = visibleSteps[stepIndex];
  if (!current) return null;

  const totalSteps = visibleSteps.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;
  const selected = answers[current.key];

  const currentOptions = current.type === "autocomplete"
    ? (current.getOptions?.(answers) || [])
    : (current.options || []);

  const filteredOptions = current.type === "autocomplete" && searchText.length > 0
    ? currentOptions.filter((o) => o.toLowerCase().includes(searchText.toLowerCase()))
    : current.type === "autocomplete"
    ? []
    : currentOptions;

  const selectOption = (value: string) => {
    const newAnswers = { ...answers, [current.key]: value };
    if (current.key === "provincia" && answers.provincia !== value) {
      delete newAnswers.ciudad;
    }
    if (current.key === "pais" && answers.pais !== value) {
      delete newAnswers.ciudadInternacional;
    }
    setAnswers(newAnswers);
    setSearchText("");

    if (stepIndex < totalSteps - 1) {
      setTimeout(() => setStepIndex(stepIndex + 1), 300);
    } else {
      setTimeout(() => onComplete(newAnswers), 300);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setSearchText("");
      setStepIndex(stepIndex - 1);
    } else {
      onBack();
    }
  };

  return (
    <section className="min-h-screen flex items-center bg-background py-20">
      <div className="container mx-auto px-4 max-w-lg">
        <button onClick={goBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" /> {stepIndex > 0 ? "Anterior" : "Volver"}
        </button>

        <div className="bg-card rounded-2xl card-shadow p-8 md:p-10 space-y-8">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Paso {stepIndex + 1} de {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground">{current.question}</h2>

          {current.type === "autocomplete" && (
            <div className="space-y-2">
              <Input
                placeholder="Escribe para buscar..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="text-base"
              />
              {selected && searchText.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Seleccionado: <span className="font-semibold text-foreground">{selected}</span>
                </p>
              )}
            </div>
          )}

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {filteredOptions.map((option) => (
              <button
                key={option}
                onClick={() => selectOption(option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  selected === option
                    ? "border-primary bg-accent"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                }`}
              >
                <span className="font-medium text-foreground">{option}</span>
              </button>
            ))}
            {current.type === "autocomplete" && searchText.length > 0 && filteredOptions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No se encontraron resultados para "{searchText}"
              </p>
            )}
            {current.type === "autocomplete" && searchText.length === 0 && !selected && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Empieza a escribir para ver las opciones disponibles
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInfoQuestionnaire;
