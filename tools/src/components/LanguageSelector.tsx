import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "zh" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("toolbox-language", newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="gap-2"
      title={i18n.language === "en" ? "切换到中文" : "Switch to English"}
    >
      <Globe className="h-4 w-4" />
      {i18n.language === "en" ? "中文" : "EN"}
    </Button>
  );
}
