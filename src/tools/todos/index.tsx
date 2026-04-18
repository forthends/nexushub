import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckSquare, Plus, Trash2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const STORAGE_KEY = "toolbox-todos";

export function Todos() {
  const { t } = useTranslation();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTodos(JSON.parse(stored));
      } catch {
        // ignore parse errors
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, isLoaded]);

  const handleAdd = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now().toString(), text: input, completed: false }]);
      setInput("");
    }
  };

  const handleToggle = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <CheckSquare className="h-4 w-4 text-primary" />
        <h1 className="text-sm font-medium">{t("todos.title")}</h1>
      </div>

      {/* Add task input */}
      <div className="flex items-center gap-2">
        <Input
          placeholder={t("todos.addPlaceholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 h-9 bg-card border-border"
        />
        <Button onClick={handleAdd} size="sm" className="h-9">
          <Plus className="h-4 w-4 mr-1" />
          {t("common.add")}
        </Button>
      </div>

      {/* Tasks list */}
      <div className="flex-1 min-h-0 overflow-auto">
        {todos.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">
              {t("todos.emptyState")}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg cursor-pointer transition-colors hover:border-primary/30"
                onClick={() => handleToggle(todo.id)}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  todo.completed ? "bg-primary border-primary" : "border-border"
                }`}>
                  {todo.completed && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
                <span className={`flex-1 text-sm ${
                  todo.completed ? "line-through text-muted-foreground" : ""
                }`}>
                  {todo.text}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(todo.id);
                  }}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}