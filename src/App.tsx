import "@/lib/i18n";
import "@/index.css";

import { Sidebar, ToolId } from "@/components/Sidebar";
import { JsonFormatter } from "@/tools/json-formatter";
import { Timestamp } from "@/tools/timestamp";
import { SqlFormatter } from "@/tools/sql-formatter";
import { ApiClient } from "@/tools/api-client";
import { Todos } from "@/tools/todos";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useState } from "react";
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

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTool={activeTool} onToolSelect={setActiveTool} />
      <main className="flex-1 p-6 overflow-auto scrollbar-thin">
        <ErrorBoundary>
          <ActiveToolComponent />
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;