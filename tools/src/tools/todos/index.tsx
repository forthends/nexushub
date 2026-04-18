import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleDelete = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <CheckSquare className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">{t("todos.title")}</h1>
      </div>
      <p className="text-muted-foreground mb-4">
        {t("todos.description")}
      </p>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle className="text-base">{t("todos.tasks")}</CardTitle>
          <div className="flex gap-2 mt-2">
            <Input
              placeholder={t("todos.addPlaceholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-1" />
              {t("common.add")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {todos.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              {t("todos.emptyState")}
            </p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleToggle(todo.id)}
                    className={todo.completed ? "text-green-500" : ""}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <span
                    className={`flex-1 ${
                      todo.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {todo.text}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(todo.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}