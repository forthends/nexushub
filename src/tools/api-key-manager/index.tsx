import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Key, Plus, Trash2, Copy, Eye, EyeOff, Check, X, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ApiKey {
  id: string;
  name: string;
  provider: string;
  key: string;
  createdAt: number;
}

const STORAGE_KEY = "toolbox-apikeys";

const PROVIDERS = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google AI" },
  { value: "azure", label: "Azure OpenAI" },
  { value: "aws", label: "AWS Bedrock" },
  { value: "other", label: "Other" },
];

// Simple obfuscation - NOT secure encryption, just base64
// For production, use proper encryption or OS keychain
function obfuscate(str: string): string {
  return btoa(str);
}

function deobfuscate(str: string): string {
  try {
    return atob(str);
  } catch {
    return str;
  }
}

export function ApiKeyManager() {
  const { t } = useTranslation();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newProvider, setNewProvider] = useState("openai");
  const [newKey, setNewKey] = useState("");
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setApiKeys(parsed);
      } catch {
        setApiKeys([]);
      }
    }
  }, []);

  const saveKeys = (keys: ApiKey[]) => {
    setApiKeys(keys);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  };

  const handleAdd = () => {
    if (!newName.trim() || !newKey.trim()) return;

    const newApiKey: ApiKey = {
      id: Date.now().toString(),
      name: newName.trim(),
      provider: newProvider,
      key: obfuscate(newKey.trim()),
      createdAt: Date.now(),
    };

    saveKeys([newApiKey, ...apiKeys]);
    setIsAdding(false);
    setNewName("");
    setNewProvider("openai");
    setNewKey("");
  };

  const handleDelete = (id: string) => {
    const filtered = apiKeys.filter((k) => k.id !== id);
    saveKeys(filtered);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setNewName("");
    setNewProvider("openai");
    setNewKey("");
  };

  const toggleReveal = (id: string) => {
    const newRevealed = new Set(revealedIds);
    if (newRevealed.has(id)) {
      newRevealed.delete(id);
    } else {
      newRevealed.add(id);
    }
    setRevealedIds(newRevealed);
  };

  const handleCopy = (id: string) => {
    const key = apiKeys.find((k) => k.id === id);
    if (key) {
      navigator.clipboard.writeText(deobfuscate(key.key));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const getMaskedKey = (key: string) => {
    const revealed = deobfuscate(key);
    if (revealed.length <= 8) {
      return "*".repeat(revealed.length);
    }
    return revealed.substring(0, 4) + "*".repeat(revealed.length - 8) + revealed.substring(revealed.length - 4);
  };

  const getProviderLabel = (provider: string) => {
    return PROVIDERS.find((p) => p.value === provider)?.label || provider;
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Key className="h-4 w-4 text-primary" />
          <h1 className="text-sm font-medium">{t("apiKeyManager.title")}</h1>
        </div>
        <Button
          size="sm"
          onClick={() => setIsAdding(true)}
          className="h-8 text-xs"
          disabled={isAdding}
        >
          <Plus className="h-3 w-3 mr-1" />
          {t("common.add")}
        </Button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">{t("apiKeyManager.addNew")}</span>
            <Button size="sm" variant="ghost" onClick={handleCancel} className="h-6 text-xs">
              <X className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t("apiKeyManager.name")}</label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={t("apiKeyManager.namePlaceholder")}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground block mb-1">{t("apiKeyManager.provider")}</label>
              <select
                value={newProvider}
                onChange={(e) => setNewProvider(e.target.value)}
                className="w-full h-8 px-3 text-xs rounded-md border border-input bg-background"
              >
                {PROVIDERS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground block mb-1">{t("apiKeyManager.apiKey")}</label>
            <Input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder={t("apiKeyManager.keyPlaceholder")}
              className="h-8 text-xs font-mono"
              type="password"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Settings className="h-3 w-3" />
            <span>{t("apiKeyManager.storageNote")}</span>
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 text-xs">
              {t("common.cancel")}
            </Button>
            <Button size="sm" onClick={handleAdd} className="h-7 text-xs" disabled={!newName.trim() || !newKey.trim()}>
              <Check className="h-3 w-3 mr-1" />
              {t("common.save")}
            </Button>
          </div>
        </div>
      )}

      {/* Keys List */}
      <div className="flex-1 overflow-auto">
        {apiKeys.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-muted-foreground">{t("apiKeyManager.empty")}</span>
          </div>
        ) : (
          <div className="space-y-2">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg"
              >
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                  <Key className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{apiKey.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                      {getProviderLabel(apiKey.provider)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono text-muted-foreground">
                      {revealedIds.has(apiKey.id) ? deobfuscate(apiKey.key) : getMaskedKey(apiKey.key)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleReveal(apiKey.id)}
                    className="h-8 w-8 p-0"
                    title={revealedIds.has(apiKey.id) ? t("apiKeyManager.hide") : t("apiKeyManager.reveal")}
                  >
                    {revealedIds.has(apiKey.id) ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(apiKey.id)}
                    className="h-8 w-8 p-0"
                    title={t("common.copy")}
                  >
                    {copiedId === apiKey.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(apiKey.id)}
                    className="h-8 w-8 p-0 hover:text-destructive"
                    title={t("common.delete")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}