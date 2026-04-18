import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Braces, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function JsonFormatter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setOutput(t("jsonFormatter.invalidJson"));
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Braces className="h-4 w-4 text-primary" />
          <h1 className="text-sm font-medium">{t("jsonFormatter.title")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs">
            <Trash2 className="h-3 w-3 mr-1" />
            {t("common.clear")}
          </Button>
          <Button size="sm" onClick={handleFormat} className="h-8 text-xs">
            {t("common.format")}
          </Button>
        </div>
      </div>

      {/* Input - full width, taller */}
      <div className="flex flex-col min-h-0 flex-1">
        <span className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
          {t("jsonFormatter.input")}
        </span>
        <Textarea
          className="flex-1 resize-none font-mono text-sm bg-card border-border min-h-[150px]"
          placeholder={t("jsonFormatter.inputPlaceholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* Output - full width */}
      <div className="flex flex-col min-h-0" style={{ flex: "0 0 40%" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {t("jsonFormatter.output")}
          </span>
          {output && (
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 px-2 text-xs">
              <Copy className="h-3 w-3 mr-1" />
              {t("common.copy")}
            </Button>
          )}
        </div>
        <pre className="flex-1 bg-card border border-border rounded-lg p-3 overflow-auto scrollbar-thin font-mono text-sm whitespace-pre-wrap min-h-[120px]">
          {output || <span className="text-muted-foreground">{t("jsonFormatter.outputPlaceholder")}</span>}
        </pre>
      </div>
    </div>
  );
}