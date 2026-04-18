import { Input } from "@/components/ui/input";
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
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-primary" />
        <h1 className="text-sm font-medium">{t("apiClient.title")}</h1>
      </div>

      {/* Request URL bar */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {(["GET", "POST", "PUT", "DELETE", "PATCH"] as const).map((m) => (
              <Button
                key={m}
                size="sm"
                variant={method === m ? "secondary" : "ghost"}
                onClick={() => setMethod(m)}
                className="h-8 text-xs px-2"
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
            className="flex-1 font-mono text-sm h-8 bg-background"
          />
          <Button onClick={handleSend} disabled={loading} size="sm" className="h-8">
            <Send className="h-3 w-3 mr-1" />
            {loading ? t("common.loading") : t("common.send")}
          </Button>
        </div>
        {urlError && (
          <p className="text-sm text-destructive mt-2">{urlError}</p>
        )}
      </div>

      {/* Headers and Body tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="h-8 justify-start">
          <TabsTrigger value="headers" className="text-xs h-7">{t("apiClient.headers")}</TabsTrigger>
          <TabsTrigger value="body" className="text-xs h-7">{t("apiClient.body")}</TabsTrigger>
        </TabsList>
        <div className="flex-1 min-h-0 mt-3">
          {activeTab === "headers" && (
            <TabsContent value="headers" className="m-0">
              <Textarea
                className="font-mono text-sm min-h-[80px] bg-card border-border"
                placeholder={t("apiClient.headersPlaceholder")}
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
              />
            </TabsContent>
          )}
          {activeTab === "body" && (
            <TabsContent value="body" className="m-0">
              <Textarea
                className="font-mono text-sm min-h-[80px] bg-card border-border"
                placeholder={t("apiClient.bodyPlaceholder")}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </TabsContent>
          )}
        </div>
      </Tabs>

      {/* Response */}
      <div className="bg-card border border-border rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {t("apiClient.response")}
          </span>
          {status && (
            <span className={`text-xs font-mono font-medium ${
              status >= 200 && status < 300 ? "text-green-500" : "text-red-500"
            }`}>
              {status}
            </span>
          )}
        </div>
        <pre className="bg-background/50 rounded-md p-3 font-mono text-xs overflow-auto min-h-[100px] max-h-[200px]">
          {response || <span className="text-muted-foreground">{t("apiClient.responsePlaceholder")}</span>}
        </pre>
      </div>
    </div>
  );
}