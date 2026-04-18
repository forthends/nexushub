import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Plus, Trash2, Copy, Edit2, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface PromptTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
  createdAt: number;
}

const STORAGE_KEY = "toolbox-prompts";

function extractVariables(template: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const vars: string[] = [];
  let match;
  while ((match = regex.exec(template)) !== null) {
    if (!vars.includes(match[1])) {
      vars.push(match[1]);
    }
  }
  return vars;
}

function replaceVariables(template: string, values: Record<string, string>): string {
  let result = template;
  Object.entries(values).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  });
  return result;
}

export function PromptTpl() {
  const { t } = useTranslation();
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTemplate, setEditTemplate] = useState("");
  const [variableValues, setVariableValues] = useState<Record<string, string>>({});
  const [renderedPrompt, setRenderedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTemplates(JSON.parse(stored));
      } catch {
        setTemplates([]);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded && templates.length > 0 && !selectedId) {
      setSelectedId(templates[0].id);
    }
  }, [isLoaded, templates, selectedId]);

  useEffect(() => {
    if (selectedId) {
      const template = templates.find((t) => t.id === selectedId);
      if (template) {
        setVariableValues({});
        const rendered = replaceVariables(template.template, {});
        setRenderedPrompt(rendered);
      }
    }
  }, [selectedId, templates]);

  const saveTemplates = (newTemplates: PromptTemplate[]) => {
    setTemplates(newTemplates);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTemplates));
  };

  const handleAdd = () => {
    const newTemplate: PromptTemplate = {
      id: Date.now().toString(),
      name: t("promptTpl.untitled"),
      template: "",
      variables: [],
      createdAt: Date.now(),
    };
    saveTemplates([newTemplate, ...templates]);
    setSelectedId(newTemplate.id);
    setIsEditing(true);
    setEditName(newTemplate.name);
    setEditTemplate("");
  };

  const handleSave = () => {
    if (!selectedId) return;
    const vars = extractVariables(editTemplate);
    const updated = templates.map((t) =>
      t.id === selectedId
        ? { ...t, name: editName, template: editTemplate, variables: vars }
        : t
    );
    saveTemplates(updated);
    setIsEditing(false);
    setVariableValues({});
    const rendered = replaceVariables(editTemplate, {});
    setRenderedPrompt(rendered);
  };

  const handleDelete = (id: string) => {
    const filtered = templates.filter((t) => t.id !== id);
    saveTemplates(filtered);
    if (selectedId === id) {
      setSelectedId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    const template = templates.find((t) => t.id === selectedId);
    if (template) {
      setEditName(template.name);
      setEditTemplate(template.template);
    }
  };

  const handleVariableChange = (key: string, value: string) => {
    const newValues = { ...variableValues, [key]: value };
    setVariableValues(newValues);
    const template = templates.find((t) => t.id === selectedId);
    if (template) {
      setRenderedPrompt(replaceVariables(template.template, newValues));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(renderedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const selectedTemplate = templates.find((t) => t.id === selectedId);

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h1 className="text-sm font-medium">{t("promptTpl.title")}</h1>
        </div>
        <Button size="sm" onClick={handleAdd} className="h-8 text-xs">
          <Plus className="h-3 w-3 mr-1" />
          {t("common.add")}
        </Button>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Template List */}
        <div className="w-64 flex flex-col min-h-0">
          <span className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
            {t("promptTpl.templates")}
          </span>
          <div className="flex-1 overflow-auto space-y-1">
            {templates.length === 0 ? (
              <div className="py-8 text-center">
                <span className="text-xs text-muted-foreground">{t("promptTpl.empty")}</span>
              </div>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer group transition-colors ${
                    selectedId === template.id
                      ? "bg-primary/15 text-primary"
                      : "hover:bg-accent/50"
                  }`}
                  onClick={() => {
                    if (!isEditing) {
                      setSelectedId(template.id);
                      setEditName(template.name);
                      setEditTemplate(template.template);
                    }
                  }}
                >
                  <span className="flex-1 text-xs truncate">{template.name}</span>
                  {!isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(template.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor / Preview */}
        <div className="flex-1 flex flex-col min-h-0">
          {selectedTemplate ? (
            <>
              {/* Template Name & Actions */}
              <div className="flex items-center justify-between mb-3">
                {isEditing ? (
                  <>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder={t("promptTpl.namePlaceholder")}
                      className="h-8 text-sm w-48"
                    />
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" onClick={handleCancel} className="h-7 text-xs">
                        <X className="h-3 w-3 mr-1" />
                        {t("common.cancel")}
                      </Button>
                      <Button size="sm" onClick={handleSave} className="h-7 text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        {t("common.save")}
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium">{selectedTemplate.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                      className="h-7 text-xs"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      {t("common.edit")}
                    </Button>
                  </>
                )}
              </div>

              {/* Template Content */}
              {isEditing ? (
                <Textarea
                  value={editTemplate}
                  onChange={(e) => setEditTemplate(e.target.value)}
                  placeholder={t("promptTpl.templatePlaceholder")}
                  className="flex-1 resize-none font-mono text-sm bg-card border-border min-h-[150px]"
                />
              ) : (
                <>
                  {/* Variables */}
                  {selectedTemplate.variables.length > 0 && (
                    <div className="mb-3 space-y-2">
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {t("promptTpl.variables")}
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedTemplate.variables.map((v) => (
                          <div key={v} className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-20 truncate">{v}</span>
                            <Input
                              value={variableValues[v] || ""}
                              onChange={(e) => handleVariableChange(v, e.target.value)}
                              placeholder={`{{${v}}}`}
                              className="h-7 text-xs font-mono"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rendered Output */}
                  <div className="flex-1 flex flex-col min-h-0 bg-card border border-border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {t("promptTpl.output")}
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
                    <pre className="flex-1 overflow-auto font-mono text-sm whitespace-pre-wrap">
                      {renderedPrompt || <span className="text-muted-foreground">{t("promptTpl.fillVariables")}</span>}
                    </pre>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <span className="text-xs text-muted-foreground">{t("promptTpl.selectPrompt")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}