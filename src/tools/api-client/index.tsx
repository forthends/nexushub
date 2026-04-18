import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Send } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function ApiClient() {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "DELETE" | "PATCH">("GET");
  const [headers, setHeaders] = useState("{}");
  const [body, setBody] = useState("");
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("headers");
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState("");

  const handleSend = async () => {
    setUrlError("");

    if (!url.trim()) {
      setUrlError(t("apiClient.enterUrl"));
      return;
    }

    if (!isValidUrl(url)) {
      setUrlError(t("apiClient.invalidUrl"));
      return;
    }

    setLoading(true);
    setResponse("");
    setStatus(null);

    try {
      const parsedHeaders = JSON.parse(headers);
      const result = await fetch(url, {
        method,
        headers: parsedHeaders,
        body: method !== "GET" ? body : undefined,
      });
      setStatus(result.status);
      const text = await result.text();
      try {
        setResponse(JSON.stringify(JSON.parse(text), null, 2));
      } catch {
        setResponse(text);
      }
    } catch (err) {
      const errorMessage = err instanceof TypeError && err.message.includes("fetch")
        ? `${t("apiClient.corsError")}\n${err}`
        : `Error: ${err}`;
      setResponse(errorMessage);
      setStatus(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Globe className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">{t("apiClient.title")}</h1>
      </div>
      <p className="text-muted-foreground mb-4">
        {t("apiClient.description")}
      </p>
      <Card className="flex-1 flex flex-col min-h-0">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {(["GET", "POST", "PUT", "DELETE", "PATCH"] as const).map((m) => (
                <Button
                  key={m}
                  size="sm"
                  variant={method === m ? "default" : "outline"}
                  onClick={() => setMethod(m)}
                >
                  {m}
                </Button>
              ))}
            </div>
            <Input
              placeholder={t("apiClient.enterUrl")}
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setUrlError("");
              }}
              className="flex-1 font-mono"
            />
            <Button onClick={handleSend} disabled={loading}>
              <Send className="h-4 w-4 mr-1" />
              {loading ? t("common.loading") : t("common.send")}
            </Button>
          </div>
          {urlError && (
            <p className="text-sm text-destructive mt-2">{urlError}</p>
          )}
        </CardHeader>
        <CardContent className="flex-1 min-h-0 overflow-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="headers">{t("apiClient.headers")}</TabsTrigger>
              <TabsTrigger value="body">{t("apiClient.body")}</TabsTrigger>
            </TabsList>
            {activeTab === "headers" && (
              <TabsContent value="headers">
                <Textarea
                  className="font-mono text-sm min-h-[100px]"
                  placeholder={t("apiClient.headersPlaceholder")}
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                />
              </TabsContent>
            )}
            {activeTab === "body" && (
              <TabsContent value="body">
                <Textarea
                  className="font-mono text-sm min-h-[100px]"
                  placeholder={t("apiClient.bodyPlaceholder")}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
              </TabsContent>
            )}
          </Tabs>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t("apiClient.response")}</Label>
              {status && (
                <span className={`text-sm font-mono ${
                  status >= 200 && status < 300 ? "text-green-500" : "text-red-500"
                }`}>
                  {status}
                </span>
              )}
            </div>
            <pre className="bg-muted/30 rounded-md p-3 font-mono text-sm overflow-auto min-h-[150px] max-h-[300px]">
              {response || t("apiClient.responsePlaceholder")}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}