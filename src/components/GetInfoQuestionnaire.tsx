import { useState, useMemo, useRef } from "react";
import { ArrowLeft, HelpCircle, Search, Building2, Monitor, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { sectorOptions, searchMasters } from "@/data/masterSuggestions";
import { CCAA, getProvincesByCCAA, COUNTRIES, getCitiesByCountry } from "@/data/locations";

interface GetInfoQuestionnaireProps {
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

type StepType = "options" | "autocomplete" | "slider" | "sectorCards" | "masterSearch" | "iconOptions";

interface StepDef {
  key: string;
  question: string;
  type: StepType;
  options?: string[];
  iconOptions?: { label: string; icon: React.ReactNode }[];
  getOptions?: (answers: Record<string, string>) => string[];
  condition?: (answers: Record<string, string>) => boolean;
  helpText?: string;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
}

// CCAA -> nombre, mapeo derivado de los datos centralizados
const ccaaNames = CCAA.map((c) => c.name);

// Para los países internacionales: usar lista centralizada excluyendo España
const paisesInternacionales = COUNTRIES
  .filter((c) => c.code !== "ES")
  .map((c) => c.name)
  .sort((a, b) => a.localeCompare(b, "es"));

// Ciudades internacionales: catálogo principal por país (referencial, ampliable)
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
  "Portugal": ["Lisboa", "Oporto", "Coimbra", "Braga"],
  "Irlanda": ["Dublín", "Cork", "Galway"],
  "Bélgica": ["Bruselas", "Amberes", "Gante", "Lovaina"],
  "Austria": ["Viena", "Graz", "Salzburgo", "Innsbruck"],
  "Finlandia": ["Helsinki", "Espoo", "Tampere"],
  "Polonia": ["Varsovia", "Cracovia", "Wroclaw"],
  "México": ["Ciudad de México", "Monterrey", "Guadalajara"],
  "Chile": ["Santiago", "Valparaíso", "Concepción"],
  "Colombia": ["Bogotá", "Medellín", "Cali"],
  "Perú": ["Lima", "Arequipa", "Cusco"],
  "Brasil": ["São Paulo", "Río de Janeiro", "Brasilia"],
  "Nueva Zelanda": ["Auckland", "Wellington", "Christchurch"],
  "China": ["Pekín", "Shanghái", "Hong Kong"],
  "Singapur ": ["Singapur"],
  "Emiratos Árabes Unidos": ["Dubái", "Abu Dabi"],
};

const isInternational = (a: Record<string, string>) =>
  a.lugar === "Internacional" || a.lugar === "Mixto (un año dentro y otro fuera)";
const isNational = (a: Record<string, string>) =>
  a.lugar === "Nacional" || a.lugar === "Mixto (un año dentro y otro fuera)";

const allSteps: StepDef[] = [
  {
    key: "sectorAcademico",
    question: "¿En qué sector quieres especializarte?",
    type: "sectorCards",
  },
  {
    key: "masterBuscado",
    question: "¿Qué máster estás buscando?",
    type: "masterSearch",
    condition: (a) => !!a.sectorAcademico,
  },
  {
    key: "presupuesto",
    question: "¿Cuál es tu presupuesto anual?",
    type: "slider",
    sliderMin: 0,
    sliderMax: 60000,
    sliderStep: 500,
    helpText: "Esta pregunta se refiere a cuánto dinero estás dispuesto a pagar en un año por tus estudios, incluyendo matrícula y otros gastos asociados.",
  },
  {
    key: "lugar",
    question: "¿Dónde te gustaría estudiar?",
    type: "options",
    options: ["Nacional", "Internacional", "Mixto (un año dentro y otro fuera)"],
  },
  {
    key: "comunidadAutonoma",
    question: "¿En qué Comunidad Autónoma te gustaría estudiar?",
    type: "autocomplete",
    getOptions: () => ccaaNames,
    condition: (a) => isNational(a),
  },
  {
    key: "provincia",
    question: "¿En qué provincia te gustaría estudiar?",
    type: "autocomplete",
    getOptions: (a) => {
      const ccaa = CCAA.find((c) => c.name === a.comunidadAutonoma);
      if (!ccaa) return [];
      return getProvincesByCCAA(ccaa.code).map((p) => p.name);
    },
    condition: (a) => isNational(a) && !!a.comunidadAutonoma,
  },
  {
    key: "pais",
    question: "¿En qué país te gustaría estudiar?",
    type: "autocomplete",
    getOptions: () => paisesInternacionales,
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
    key: "formatoEstudio",
    question: "¿Qué formato de estudio prefieres?",
    type: "iconOptions",
    iconOptions: [
      { label: "Presencial", icon: <Building2 className="h-7 w-7" /> },
      { label: "Online", icon: <Monitor className="h-7 w-7" /> },
      { label: "Semipresencial", icon: <CalendarDays className="h-7 w-7" /> },
    ],
  },
  {
    key: "sectorPublicoPrivado",
    question: "¿Prefieres sector público o privado?",
    type: "options",
    options: ["Público", "Privado"],
  },
];

const formatBudget = (value: number) =>
  value >= 60000 ? "+60.000 €" : value.toLocaleString("es-ES") + " €";

const GetInfoQuestionnaire = ({ onComplete, onBack }: GetInfoQuestionnaireProps) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [searchText, setSearchText] = useState("");
  const [sliderValue, setSliderValue] = useState<number[]>([0, 60000]);
  const [masterSearchText, setMasterSearchText] = useState("");
  const [showMasterDropdown, setShowMasterDropdown] = useState(false);
  const masterInputRef = useRef<HTMLInputElement>(null);

  const visibleSteps = useMemo(
    () => allSteps.filter((s) => !s.condition || s.condition(answers)),
    [answers]
  );

  const current = visibleSteps[stepIndex];

  const masterSuggestions = useMemo(() => {
    if (!current || current.type !== "masterSearch") return [];
    return searchMasters(answers.sectorAcademico || "", masterSearchText);
  }, [current, answers.sectorAcademico, masterSearchText]);

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
    if (current.key === "sectorAcademico" && answers.sectorAcademico !== value) {
      delete newAnswers.masterBuscado;
    }
    setAnswers(newAnswers);
    setSearchText("");
    setMasterSearchText("");
    setShowMasterDropdown(false);

    if (stepIndex < totalSteps - 1) {
      setTimeout(() => setStepIndex(stepIndex + 1), 300);
    } else {
      setTimeout(() => onComplete(newAnswers), 300);
    }
  };

  const confirmMasterFreeText = () => {
    if (masterSearchText.trim()) {
      selectOption(masterSearchText.trim());
    }
  };

  const confirmSlider = () => {
    const value = `${formatBudget(sliderValue[0])} - ${formatBudget(sliderValue[1])}`;
    selectOption(value);
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setSearchText("");
      setMasterSearchText("");
      setShowMasterDropdown(false);
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

          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">{current.question}</h2>
            {current.helpText && (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                    <HelpCircle className="h-5 w-5" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="text-sm max-w-xs">
                  {current.helpText}
                </PopoverContent>
              </Popover>
            )}
          </div>

          {/* Sector Cards */}
          {current.type === "sectorCards" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sectorOptions.map((sector) => (
                <button
                  key={sector.id}
                  onClick={() => selectOption(sector.id)}
                  className={`group relative p-5 rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
                    selected === sector.id
                      ? "border-primary bg-accent shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-accent/50"
                  }`}
                >
                  <span className="text-3xl block mb-2">{sector.icon}</span>
                  <span className="font-semibold text-foreground block text-sm leading-tight">
                    {sector.label}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 block">
                    {sector.description}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Master Search */}
          {current.type === "masterSearch" && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={masterInputRef}
                  placeholder="Escribe el máster que buscas..."
                  value={masterSearchText}
                  onChange={(e) => {
                    setMasterSearchText(e.target.value);
                    setShowMasterDropdown(true);
                  }}
                  onFocus={() => setShowMasterDropdown(true)}
                  className="pl-10 text-base h-12 rounded-xl"
                />
              </div>

              {showMasterDropdown && masterSuggestions.length > 0 && (
                <div className="border border-border rounded-xl bg-card shadow-lg overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200">
                  {masterSuggestions.map((master, i) => (
                    <button
                      key={master}
                      onClick={() => selectOption(master)}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-accent/80 flex items-center gap-3 ${
                        i < masterSuggestions.length - 1 ? "border-b border-border/50" : ""
                      }`}
                    >
                      <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="text-foreground">{master}</span>
                    </button>
                  ))}
                </div>
              )}

              {masterSearchText.trim() && (
                <button
                  onClick={confirmMasterFreeText}
                  className="w-full p-4 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity text-sm"
                >
                  Buscar "{masterSearchText.trim()}"
                </button>
              )}

              {!masterSearchText && !selected && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Escribe para ver sugerencias o introduce tu propio máster
                </p>
              )}
            </div>
          )}

          {/* Slider */}
          {current.type === "slider" && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-3xl font-bold text-primary">
                  {formatBudget(sliderValue[0])} — {formatBudget(sliderValue[1])}
                </span>
              </div>
              <div className="px-2 space-y-4">
                <Slider
                  min={current.sliderMin}
                  max={current.sliderMax}
                  step={current.sliderStep}
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  minStepsBetweenThumbs={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatBudget(current.sliderMin ?? 0)}</span>
                  <span>{formatBudget(current.sliderMax ?? 60000)}</span>
                </div>
              </div>
              <button
                onClick={confirmSlider}
                className="w-full p-4 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
              >
                Confirmar presupuesto
              </button>
            </div>
          )}

          {/* Autocomplete input */}
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

          {/* Icon Options */}
          {current.type === "iconOptions" && current.iconOptions && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {current.iconOptions.map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => selectOption(opt.label)}
                  className={`flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    selected === opt.label
                      ? "border-primary bg-accent shadow-md"
                      : "border-border hover:border-primary/50 hover:bg-accent/50"
                  }`}
                >
                  <span className="text-primary">{opt.icon}</span>
                  <span className="font-semibold text-foreground text-sm">{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Options / autocomplete list */}
          {(current.type === "options" || current.type === "autocomplete") && (
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
          )}
        </div>
      </div>
    </section>
  );
};

export default GetInfoQuestionnaire;
