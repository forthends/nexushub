import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";
import "@/lib/i18n";
import "@/index.css";

import { Sidebar, ToolId } from "@/components/Sidebar";
import { JsonFormatter } from "@/tools/json-formatter";
import { Timestamp } from "@/tools/timestamp";
import { SqlFormatter } from "@/tools/sql-formatter";
import { ApiClient } from "@/tools/api-client";
import { Todos } from "@/tools/todos";
import { useState } from "react";

function App() {
  const [activeTool, setActiveTool] = useState<ToolId>("json-formatter");

  const renderTool = () => {
    switch (activeTool) {
      case "json-formatter":
        return <JsonFormatter />;
      case "timestamp":
        return <Timestamp />;
      case "sql-formatter":
        return <SqlFormatter />;
      case "api-client":
        return <ApiClient />;
      case "todos":
        return <Todos />;
      default:
        return <JsonFormatter />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-background">
        <Sidebar activeTool={activeTool} onToolSelect={setActiveTool} />
        <main className="flex-1 p-6 overflow-auto scrollbar-thin">
          {renderTool()}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;