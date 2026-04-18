import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Braces className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">{t("jsonFormatter.title")}</h1>
      </div>
      <p className="text-muted-foreground mb-4">
        {t("jsonFormatter.description")}
      </p>
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("jsonFormatter.input")}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <Textarea
              className="flex-1 min-h-0 resize-none font-mono text-sm"
              placeholder={t("jsonFormatter.inputPlaceholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex gap-2 mt-3">
              <Button onClick={handleFormat} size="sm">
                {t("common.format")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <Trash2 className="h-4 w-4 mr-1" />
                {t("common.clear")}
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">{t("jsonFormatter.output")}</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <pre className="h-full w-full bg-muted/30 rounded-md p-3 overflow-auto scrollbar-thin font-mono text-sm">
              {output || t("jsonFormatter.outputPlaceholder")}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}