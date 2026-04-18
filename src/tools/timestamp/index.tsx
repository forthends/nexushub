import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">{t("timestamp.title")}</h1>
      </div>
      <p className="text-muted-foreground mb-4">
        {t("timestamp.description")}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("timestamp.currentTime")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-mono text-primary">
              {currentUnix}
            </div>
            <div className="text-sm text-muted-foreground">
              {new Date().toLocaleString()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(currentUnix)}
            >
              <Copy className="h-4 w-4 mr-1" />
              {t("common.copy")}
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("timestamp.converter")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("timestamp.unixTimestamp")}</Label>
              <Input
                placeholder={t("timestamp.unixTimestamp")}
                value={unix}
                onChange={(e) => setUnix(e.target.value)}
                className="font-mono"
              />
              <Button size="sm" onClick={handleUnixToDate}>
                {t("timestamp.convertToDate")}
              </Button>
            </div>
            <div className="space-y-2">
              <Label>{t("timestamp.dateString")}</Label>
              <Input
                placeholder={t("timestamp.dateString")}
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="font-mono"
              />
              <Button size="sm" onClick={handleDateToUnix}>
                {t("timestamp.convertToUnix")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}