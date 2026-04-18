import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Braces,
  Clock,
  Database,
  Globe,
  CheckSquare,
  Box,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ThemeToggle } from "@/components/ThemeToggle";

export type ToolId = "json-formatter" | "timestamp" | "sql-formatter" | "api-client" | "todos";

interface Tool {
  id: ToolId;
  nameKey: string;
  icon: React.ReactNode;
}

const tools: Tool[] = [
  { id: "json-formatter", nameKey: "nav.jsonFormatter", icon: <Braces className="h-4 w-4" /> },
  { id: "timestamp", nameKey: "nav.timestamp", icon: <Clock className="h-4 w-4" /> },
  { id: "sql-formatter", nameKey: "nav.sqlFormatter", icon: <Database className="h-4 w-4" /> },
  { id: "api-client", nameKey: "nav.apiClient", icon: <Globe className="h-4 w-4" /> },
  { id: "todos", nameKey: "nav.todos", icon: <CheckSquare className="h-4 w-4" /> },
];

import { JsonFormatter } from "@/tools/json-formatter";
import { Timestamp } from "@/tools/timestamp";
import { SqlFormatter } from "@/tools/sql-formatter";
import { ApiClient } from "@/tools/api-client";
import { Todos } from "@/tools/todos";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useState, useEffect } from "react";
import { type ComponentType } from "react";

interface ToolComponent {
  component: ComponentType;
}

const TOOLS: Record<ToolId, ToolComponent> = {
  "json-formatter": { component: JsonFormatter },
  timestamp: { component: Timestamp },
  "sql-formatter": { component: SqlFormatter },
  "api-client": { component: ApiClient },
  todos: { component: Todos },
};

function App() {
  const [activeTool, setActiveTool] = useState<ToolId>("json-formatter");
  const ActiveToolComponent = TOOLS[activeTool]?.component ?? JsonFormatter;
  const { t } = useTranslation();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.documentElement.classList.add("light");
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Compact Top Navigation */}
      <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 gap-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Box className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm tracking-tight">{t("app.title")}</span>
        </div>

        <nav className="flex items-center gap-1 flex-1">
          {tools.map((tool) => (
            <Button
              key={tool.id}
              variant={activeTool === tool.id ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "gap-2 h-8 px-3 text-xs font-medium transition-all duration-200",
                activeTool === tool.id && "bg-primary/15 text-primary hover:bg-primary/20"
              )}
              onClick={() => setActiveTool(tool.id)}
            >
              {tool.icon}
              <span className="hidden sm:inline">{t(tool.nameKey)}</span>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-6 overflow-auto">
        <ErrorBoundary>
          <ActiveToolComponent />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;