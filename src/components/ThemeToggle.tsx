import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

function isLightTheme() {
  return document.documentElement.classList.contains("light");
}

export function ThemeToggle() {
  const [isLight, setIsLight] = useState(isLightTheme);

  useEffect(() => {
    const handleThemeChange = () => setIsLight(isLightTheme());
    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event("themechange"));
  };

  return (
    <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-8 w-8 p-0">
      {isLight ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}