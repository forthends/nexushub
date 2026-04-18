import { useState, useEffect, useCallback } from "react";

const MAX_HISTORY = 10;

export function useInputHistory(storageKey: string) {
  const [history, setHistory] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
    setIsLoaded(true);
  }, [storageKey]);

  const addToHistory = useCallback(
    (input: string) => {
      if (!input.trim()) return;

      setHistory((prev) => {
        const filtered = prev.filter((item) => item !== input);
        const updated = [input, ...filtered].slice(0, MAX_HISTORY);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return updated;
      });
    },
    [storageKey]
  );

  const removeFromHistory = useCallback(
    (index: number) => {
      setHistory((prev) => {
        const updated = prev.filter((_, i) => i !== index);
        localStorage.setItem(storageKey, JSON.stringify(updated));
        return updated;
      });
    },
    [storageKey]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  return {
    history,
    isLoaded,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}