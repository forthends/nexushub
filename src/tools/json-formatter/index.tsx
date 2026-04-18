import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Braces, Copy, Trash2, History, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useInputHistory } from "@/lib/useInputHistory";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const HISTORY_KEY = "toolbox-json-history";

export function JsonFormatter() {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [isLight, setIsLight] = useState(() => localStorage.getItem("theme") === "light");
  const historyRef = useRef<HTMLDivElement>(null);
  const { history, addToHistory, removeFromHistory, clearHistory, isLoaded } = useInputHistory(HISTORY_KEY);

  useEffect(() => {
    const handleThemeChange = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };
    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    if (showHistory) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showHistory]);

  const handleFormat = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      addToHistory(input);
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

  const handleHistoryClick = (item: string) => {
    setInput(item);
    setShowHistory(false);
    try {
      const parsed = JSON.parse(item);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setOutput(t("jsonFormatter.invalidJson"));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleFormat();
    }
  };

  const syntaxStyle = isLight ? tomorrow : oneDark;

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Braces className="h-4 w-4 text-primary" />
          <h1 className="text-sm font-medium">{t("jsonFormatter.title")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative" ref={historyRef}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHistory(!showHistory)}
              className="h-8 text-xs"
              disabled={!isLoaded || history.length === 0}
            >
              <History className="h-3 w-3 mr-1" />
              {t("jsonFormatter.history")}
            </Button>
            {showHistory && history.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-80 max-h-64 overflow-auto bg-card border border-border rounded-lg shadow-lg z-50">
                <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                  <span className="text-xs font-medium">{t("jsonFormatter.history")}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { clearHistory(); setShowHistory(false); }}
                    className="h-6 text-xs text-muted-foreground hover:text-destructive"
                  >
                    {t("common.clear")}
                  </Button>
                </div>
                <div className="py-1">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 hover:bg-accent/50 cursor-pointer group"
                      onClick={() => handleHistoryClick(item)}
                    >
                      <span className="flex-1 text-xs font-mono truncate text-muted-foreground">
                        {item.length > 50 ? item.substring(0, 50) + "..." : item}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(index);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
          onKeyDown={handleKeyDown}
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
        <SyntaxHighlighter
          language="json"
          style={syntaxStyle}
          className={`flex-1 rounded-lg !m-0 !bg-card border border-border overflow-auto ${isLight ? "!bg-[#fafafa]" : ""}`}
          customStyle={{
            minHeight: "120px",
            padding: "12px",
            fontSize: "14px",
            lineHeight: "1.5",
            backgroundColor: isLight ? "#fafafa" : undefined,
          }}
        >
          {output || t("jsonFormatter.outputPlaceholder")}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}