import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Database, Copy, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "INSERT", "UPDATE", "DELETE",
  "CREATE", "TABLE", "DROP", "ALTER", "INTO", "VALUES", "SET", "JOIN",
  "LEFT", "RIGHT", "INNER", "OUTER", "ON", "GROUP", "BY", "ORDER", "HAVING",
  "LIMIT", "OFFSET", "AS", "DISTINCT", "COUNT", "SUM", "AVG", "MAX", "MIN",
  "NULL", "NOT", "IN", "LIKE", "BETWEEN", "IS", "EXISTS", "CASE", "WHEN",
  "THEN", "ELSE", "END", "UNION", "ALL", "ASC", "DESC"
];

const SQL_KEYWORD_REGEXES = SQL_KEYWORDS.map(
  (kw) => new RegExp(`\\b${kw}\\b`, "gi")
);

function formatSql(input: string): string {
  let formatted = input;
  SQL_KEYWORD_REGEXES.forEach((regex, i) => {
    formatted = formatted.replace(regex, SQL_KEYWORDS[i]);
  });

  return formatted
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
}

export function SqlFormatter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleFormat = () => {
    setOutput(formatSql(input));
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
          <Database className="h-4 w-4 text-primary" />
          <h1 className="text-sm font-medium">{t("sqlFormatter.title")}</h1>
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
          {t("sqlFormatter.input")}
        </span>
        <Textarea
          className="flex-1 resize-none font-mono text-sm bg-card border-border min-h-[150px]"
          placeholder={t("sqlFormatter.inputPlaceholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* Output - full width */}
      <div className="flex flex-col min-h-0" style={{ flex: "0 0 40%" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {t("sqlFormatter.output")}
          </span>
          {output && (
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 px-2 text-xs">
              <Copy className="h-3 w-3 mr-1" />
              {t("common.copy")}
            </Button>
          )}
        </div>
        <pre className="flex-1 bg-card border border-border rounded-lg p-3 overflow-auto scrollbar-thin font-mono text-sm whitespace-pre-wrap min-h-[120px]">
          {output || <span className="text-muted-foreground">{t("sqlFormatter.outputPlaceholder")}</span>}
        </pre>
      </div>
    </div>
  );
}