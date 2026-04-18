import { Input } from "@/components/ui/input";
import { Clock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export function Timestamp() {
  const { t } = useTranslation();
  const [unix, setUnix] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [currentUnix, setCurrentUnix] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setCurrentUnix(Math.floor(Date.now() / 1000).toString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUnixToDate = () => {
    try {
      const date = new Date(parseInt(unix) * 1000);
      setDateStr(date.toISOString());
    } catch {
      setDateStr(t("timestamp.invalidTimestamp"));
    }
  };

  const handleDateToUnix = () => {
    try {
      const date = new Date(dateStr);
      setUnix(Math.floor(date.getTime() / 1000).toString());
    } catch {
      setUnix(t("timestamp.invalidDate"));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <h1 className="text-sm font-medium">{t("timestamp.title")}</h1>
      </div>

      {/* Current time display */}
      <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">
            {t("timestamp.currentTime")}
          </div>
          <div className="text-2xl font-mono text-primary">{currentUnix}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {new Date().toLocaleString()}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(currentUnix)}
          className="h-8"
        >
          <Copy className="h-3 w-3 mr-1" />
          {t("common.copy")}
        </Button>
      </div>

      {/* Converter */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
          {t("timestamp.converter")}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">{t("timestamp.unixTimestamp")}</label>
            <Input
              placeholder="1700000000"
              value={unix}
              onChange={(e) => setUnix(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUnixToDate()}
              className="font-mono text-sm h-9 bg-background"
            />
            <Button size="sm" onClick={handleUnixToDate} className="w-full h-8 text-xs">
              {t("timestamp.convertToDate")}
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">{t("timestamp.dateString")}</label>
            <Input
              placeholder="2024-01-01T00:00:00Z"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDateToUnix()}
              className="font-mono text-sm h-9 bg-background"
            />
            <Button size="sm" onClick={handleDateToUnix} className="w-full h-8 text-xs">
              {t("timestamp.convertToUnix")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}