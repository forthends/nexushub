import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, Plus, Trash2, Copy, Check, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface QueryParam {
  key: string;
  value: string;
}

export function UrlCodec() {
  const { t } = useTranslation();
  const [url, setUrl] = useState("https://example.com/api?foo=bar&baz=qux");
  const [encodedUrl, setEncodedUrl] = useState("");
  const [queryParams, setQueryParams] = useState<QueryParam[]>([]);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const parseUrl = (input: string) => {
    setError("");
    try {
      const urlObj = new URL(input);
      const params: QueryParam[] = [];
      urlObj.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });
      setQueryParams(params);
      setEncodedUrl(input);
    } catch {
      setError(t("urlCodec.invalidUrl"));
      setQueryParams([]);
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.trim()) {
      parseUrl(value);
    } else {
      setQueryParams([]);
      setError("");
    }
  };

  const handleEncode = () => {
    try {
      const encoded = encodeURI(url);
      setEncodedUrl(encoded);
      setUrl(encoded);
      parseUrl(encoded);
    } catch {
      setError(t("urlCodec.invalidUrl"));
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURI(url);
      setEncodedUrl(decoded);
      setUrl(decoded);
      parseUrl(decoded);
    } catch {
      setError(t("urlCodec.decodeError"));
    }
  };

  const handleParamChange = (index: number, field: "key" | "value", val: string) => {
    const newParams = [...queryParams];
    newParams[index][field] = val;
    setQueryParams(newParams);
    rebuildUrl(newParams);
  };

  const handleAddParam = () => {
    setQueryParams([...queryParams, { key: "", value: "" }]);
  };

  const handleDeleteParam = (index: number) => {
    const newParams = queryParams.filter((_, i) => i !== index);
    setQueryParams(newParams);
    rebuildUrl(newParams);
  };

  const rebuildUrl = (params: QueryParam[]) => {
    try {
      const urlObj = new URL(url.split("?")[0]);
      params.forEach((p) => {
        if (p.key.trim()) {
          urlObj.searchParams.set(p.key, p.value);
        }
      });
      const newUrl = urlObj.toString();
      setEncodedUrl(newUrl);
      setUrl(newUrl);
      setError("");
    } catch {
      // ignore rebuild errors during typing
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(encodedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setUrl("");
    setEncodedUrl("");
    setQueryParams([]);
    setError("");
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link className="h-4 w-4 text-primary" />
          <h1 className="text-sm font-medium">{t("urlCodec.title")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 text-xs">
            <Trash2 className="h-3 w-3 mr-1" />
            {t("common.clear")}
          </Button>
        </div>
      </div>

      {/* URL Input */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="https://example.com/api?foo=bar&baz=qux"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="font-mono text-sm h-9 bg-background"
          />
          <Button size="sm" onClick={handleEncode} className="h-9">
            {t("common.encode")}
          </Button>
          <Button size="sm" variant="secondary" onClick={handleDecode} className="h-9">
            {t("common.decode")}
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2">
            <X className="h-3 w-3 text-red-500" />
            <span className="text-xs text-red-500">{error}</span>
          </div>
        )}
      </div>

      {/* Query Params Editor */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {t("urlCodec.queryParams")}
          </span>
          <Button size="sm" variant="ghost" onClick={handleAddParam} className="h-7 text-xs">
            <Plus className="h-3 w-3 mr-1" />
            {t("common.add")}
          </Button>
        </div>

        {queryParams.length === 0 ? (
          <div className="py-4 text-center">
            <span className="text-xs text-muted-foreground">{t("urlCodec.noParams")}</span>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
              <span className="w-8"></span>
              <span className="flex-1">{t("urlCodec.key")}</span>
              <span className="flex-1">{t("urlCodec.value")}</span>
              <span className="w-8"></span>
            </div>
            {/* Rows */}
            {queryParams.map((param, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="w-8 text-xs text-muted-foreground text-center">{index + 1}</span>
                <Input
                  value={param.key}
                  onChange={(e) => handleParamChange(index, "key", e.target.value)}
                  placeholder={t("urlCodec.keyPlaceholder")}
                  className="flex-1 font-mono text-xs h-8 bg-background"
                />
                <Input
                  value={param.value}
                  onChange={(e) => handleParamChange(index, "value", e.target.value)}
                  placeholder={t("urlCodec.valuePlaceholder")}
                  className="flex-1 font-mono text-xs h-8 bg-background"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteParam(index)}
                  className="w-8 h-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Result */}
      {encodedUrl && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              {t("urlCodec.result")}
            </span>
            <Button size="sm" variant="ghost" onClick={handleCopy} className="h-6 px-2 text-xs">
              {copied ? (
                <>
                  <Check className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">{t("common.copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  {t("common.copy")}
                </>
              )}
            </Button>
          </div>
          <pre className="bg-background/50 rounded-md p-3 font-mono text-xs overflow-auto break-all whitespace-pre-wrap">
            {encodedUrl}
          </pre>
        </div>
      )}
    </div>
  );
}