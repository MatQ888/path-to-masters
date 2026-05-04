import { ArrowUpFromLine, ArrowDownToLine } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ActionSelectionProps {
  onSelect: (action: "give" | "get") => void;
}

const ActionSelection = ({ onSelect }: ActionSelectionProps) => {
  const { t } = useTranslation();
  return (
    <section className="min-h-screen flex items-center bg-background py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            {t("actionSelection.title")}
          </h2>
          <p className="text-muted-foreground text-lg">{t("actionSelection.subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => onSelect("give")}
            className="group bg-card rounded-2xl card-shadow p-8 text-left hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border border-border"
          >
            <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ArrowUpFromLine className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t("actionSelection.give.title")}</h3>
            <p className="text-muted-foreground text-sm">
              {t("actionSelection.give.description")}
            </p>
          </button>

          <button
            onClick={() => onSelect("get")}
            className="group bg-card rounded-2xl card-shadow p-8 text-left hover:card-shadow-hover transition-all duration-300 hover:-translate-y-1 border-2 border-primary"
          >
            <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center mb-6 text-primary-foreground">
              <ArrowDownToLine className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t("actionSelection.get.title")}</h3>
            <p className="text-muted-foreground text-sm">
              {t("actionSelection.get.description")}
            </p>
            <span className="inline-block mt-3 text-xs font-medium text-primary bg-accent px-3 py-1 rounded-full">
              {t("actionSelection.get.recommended")}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ActionSelection;
