import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Database, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function SqlFormatter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleFormat = () => {
    const keywords = [
      "SELECT", "FROM", "WHERE", "AND", "OR", "INSERT", "UPDATE", "DELETE",
      "CREATE", "TABLE", "DROP", "ALTER", "INTO", "VALUES", "SET", "JOIN",
      "LEFT", "RIGHT", "INNER", "OUTER", "ON", "GROUP", "BY", "ORDER", "HAVING",
      "LIMIT", "OFFSET", "AS", "DISTINCT", "COUNT", "SUM", "AVG", "MAX", "MIN",
      "NULL", "NOT", "IN", "LIKE", "BETWEEN", "IS", "EXISTS", "CASE", "WHEN",
      "THEN", "ELSE", "END", "UNION", "ALL", "ASC", "DESC"
    ];

    let formatted = input;
    keywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, "gi");
      formatted = formatted.replace(regex, kw);
    });

    formatted = formatted
      .replace(/\s+/g, " ")
      .trim()
      .replace(/,\s*/g, ",\n  ")
      .replace(/\bFROM\b/gi, "\nFROM")
      .replace(/\bWHERE\b/gi, "\nWHERE")
      .replace(/\bAND\b/gi, "\n  AND")
      .replace(/\bOR\b/gi, "\n  OR")
      .replace(/\bJOIN\b/gi, "\nJOIN")
      .replace(/\bLEFT JOIN\b/gi, "\nLEFT JOIN")
      .replace(/\bRIGHT JOIN\b/gi, "\nRIGHT JOIN")
      .replace(/\bINNER JOIN\b/gi, "\nINNER JOIN")
      .replace(/\bGROUP BY\b/gi, "\nGROUP BY")
      .replace(/\bORDER BY\b/gi, "\nORDER BY")
      .replace(/\bHAVING\b/gi, "\nHAVING")
      .replace(/\bLIMIT\b/gi, "\nLIMIT");

    setOutput(formatted);
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
        <Database className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">{t("sqlFormatter.title")}</h1>
      </div>
      <p className="text-muted-foreground mb-4">
        {t("sqlFormatter.description")}
      </p>
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{t("sqlFormatter.input")}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <Textarea
              className="flex-1 min-h-0 resize-none font-mono text-sm"
              placeholder={t("sqlFormatter.inputPlaceholder")}
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
            <CardTitle className="text-base">{t("sqlFormatter.output")}</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 min-h-0">
            <pre className="h-full w-full bg-muted/30 rounded-md p-3 overflow-auto scrollbar-thin font-mono text-sm whitespace-pre-wrap">
              {output || t("sqlFormatter.outputPlaceholder")}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}