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

export type ToolId = "json-formatter" | "timestamp" | "sql-formatter" | "api-client" | "todos";

interface Tool {
  id: ToolId;
  nameKey: string;
  icon: React.ReactNode;
}

const tools: Tool[] = [
  {
    id: "json-formatter",
    nameKey: "nav.jsonFormatter",
    icon: <Braces className="h-5 w-5" />,
  },
  {
    id: "timestamp",
    nameKey: "nav.timestamp",
    icon: <Clock className="h-5 w-5" />,
  },
  {
    id: "sql-formatter",
    nameKey: "nav.sqlFormatter",
    icon: <Database className="h-5 w-5" />,
  },
  {
    id: "api-client",
    nameKey: "nav.apiClient",
    icon: <Globe className="h-5 w-5" />,
  },
  {
    id: "todos",
    nameKey: "nav.todos",
    icon: <CheckSquare className="h-5 w-5" />,
  },
];

interface SidebarProps {
  activeTool: ToolId;
  onToolSelect: (tool: ToolId) => void;
}

export function Sidebar({ activeTool, onToolSelect }: SidebarProps) {
  const { t } = useTranslation();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Box className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">{t("app.title")}</span>
        </div>
      </div>
      <nav className="flex-1 p-2 overflow-y-auto scrollbar-thin">
        <ul className="space-y-1">
          {tools.map((tool) => (
            <li key={tool.id}>
              <Button
                variant={activeTool === tool.id ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  activeTool === tool.id && "bg-primary/20 text-primary hover:bg-primary/25 hover:text-primary"
                )}
                onClick={() => onToolSelect(tool.id)}
              >
                {tool.icon}
                <div className="text-left">
                  <div className="font-medium">{t(tool.nameKey)}</div>
                </div>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-border flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{t("app.version")}</p>
        <LanguageSelector />
      </div>
    </aside>
  );
}
