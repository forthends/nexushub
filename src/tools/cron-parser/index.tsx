import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Check, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface CronField {
  name: string;
  min: number;
  max: number;
}

const CRON_FIELDS: CronField[] = [
  { name: "minute", min: 0, max: 59 },
  { name: "hour", min: 0, max: 23 },
  { name: "dayOfMonth", min: 1, max: 31 },
  { name: "month", min: 1, max: 12 },
  { name: "dayOfWeek", min: 0, max: 6 },
];

interface ParseResult {
  valid: boolean;
  error?: string;
  values?: number[][];
}

function parseField(field: string, min: number, max: number): number[] | null {
  if (field === "*") {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }

  if (field.includes("/")) {
    const [base, stepStr] = field.split("/");
    const step = parseInt(stepStr, 10);
    if (isNaN(step) || step <= 0) return null;

    let start = min;
    let end = max;

    if (base !== "*") {
      if (base.includes("-")) {
        const [s, e] = base.split("-").map(Number);
        if (isNaN(s) || isNaN(e) || s < min || e > max) return null;
        start = s;
        end = e;
      } else {
        const s = parseInt(base, 10);
        if (isNaN(s) || s < min || s > max) return null;
        start = s;
      }
    }

    const result: number[] = [];
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
    return result;
  }

  if (field.includes("-")) {
    const [s, e] = field.split("-").map(Number);
    if (isNaN(s) || isNaN(e) || s < min || e > max || s > e) return null;
    return Array.from({ length: e - s + 1 }, (_, i) => s + i);
  }

  if (field.includes(",")) {
    const values = field.split(",").map((v) => parseInt(v, 10));
    if (values.some((v) => isNaN(v) || v < min || v > max)) return null;
    return values;
  }

  const val = parseInt(field, 10);
  if (isNaN(val) || val < min || val > max) return null;
  return [val];
}

function parseCron(expression: string): ParseResult {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return { valid: false, error: `Expected 5 fields, got ${parts.length}` };
  }

  const values: number[][] = [];
  for (let i = 0; i < 5; i++) {
    const fieldValues = parseField(parts[i], CRON_FIELDS[i].min, CRON_FIELDS[i].max);
    if (!fieldValues) {
      return { valid: false, error: `Invalid ${CRON_FIELDS[i].name}: "${parts[i]}"` };
    }
    values.push(fieldValues);
  }

  return { valid: true, values };
}

function getNextExecutions(cron: string, count: number): Date[] {
  const result = parseCron(cron);
  if (!result.valid || !result.values) return [];

  const [minutes, hours, daysOfMonth, months, daysOfWeek] = result.values;
  const executions: Date[] = [];
  const now = new Date();
  const current = new Date(now);
  current.setSeconds(0);
  current.setMilliseconds(0);
  current.setMinutes(current.getMinutes() + 1);

  const maxIterations = 365 * 24 * 60;
  let iterations = 0;

  while (executions.length < count && iterations < maxIterations) {
    iterations++;

    const minute = current.getMinutes();
    const hour = current.getHours();
    const dayOfMonth = current.getDate();
    const month = current.getMonth() + 1;
    const dayOfWeek = current.getDay();

    if (
      minutes.includes(minute) &&
      hours.includes(hour) &&
      daysOfMonth.includes(dayOfMonth) &&
      months.includes(month) &&
      daysOfWeek.includes(dayOfWeek)
    ) {
      executions.push(new Date(current));
    }

    current.setMinutes(current.getMinutes() + 1);
  }

  return executions;
}

function describeField(field: string, type: "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek", lang: "en" | "zh"): string {
  const parts = field.trim();

  const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthNamesZh = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dayNamesZh = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

  if (parts === "*") {
    if (type === "minute") return lang === "en" ? "every minute" : "每分钟";
    if (type === "hour") return lang === "en" ? "every hour" : "每小时";
    if (type === "dayOfMonth") return lang === "en" ? "every day" : "每天";
    if (type === "month") return lang === "en" ? "every month" : "每月";
    if (type === "dayOfWeek") return lang === "en" ? "every day of week" : "每天";
  }

  if (parts.includes("/")) {
    const [, stepStr] = parts.split("/");
    const step = parseInt(stepStr, 10);
    if (type === "minute") return lang === "en" ? `every ${step} minutes` : `每${step}分钟`;
    if (type === "hour") return lang === "en" ? `every ${step} hours` : `每${step}小时`;
    if (type === "dayOfMonth") return lang === "en" ? `every ${step} days` : `每${step}天`;
    if (type === "month") return lang === "en" ? `every ${step} months` : `每${step}个月`;
    if (type === "dayOfWeek") return lang === "en" ? `every ${step} days of week` : `每${step}天`;
  }

  if (parts.includes("-")) {
    const [start, end] = parts.split("-").map(Number);
    if (type === "minute") return lang === "en" ? `minutes ${start}-${end}` : `第${start}-${end}分钟`;
    if (type === "hour") return lang === "en" ? `hours ${start}-${end}` : `${start}-${end}点`;
    if (type === "dayOfMonth") return lang === "en" ? `days ${start}-${end}` : `${start}-${end}日`;
    if (type === "month") {
      const months = lang === "en" ? monthNamesEn : monthNamesZh;
      return lang === "en" ? `${months[start - 1]}-${months[end - 1]}` : `${months[start - 1]}-${months[end - 1]}`;
    }
    if (type === "dayOfWeek") {
      const days = lang === "en" ? dayNamesEn : dayNamesZh;
      return lang === "en" ? `${days[start]} to ${days[end]}` : `${days[start]}至${days[end]}`;
    }
  }

  if (parts.includes(",")) {
    const vals = parts.split(",");
    if (type === "month") {
      const months = lang === "en" ? monthNamesEn : monthNamesZh;
      return lang === "en" ? months.map((_, i) => months[parseInt(vals[i]) - 1]).join(", ") : vals.map(v => months[parseInt(v) - 1]).join("、");
    }
    if (type === "dayOfWeek") {
      const days = lang === "en" ? dayNamesEn : dayNamesZh;
      return lang === "en" ? vals.map(v => days[parseInt(v)]).join(", ") : vals.map(v => days[parseInt(v)]).join("、");
    }
    return lang === "en" ? vals.join(", ") : vals.join("、");
  }

  const val = parseInt(parts, 10);
  if (type === "minute") return lang === "en" ? `at minute ${val}` : `第${val}分钟`;
  if (type === "hour") return lang === "en" ? `at hour ${val}` : `${val}点`;
  if (type === "dayOfMonth") return lang === "en" ? `on day ${val}` : `${val}日`;
  if (type === "month") {
    const months = lang === "en" ? monthNamesEn : monthNamesZh;
    return lang === "en" ? `in ${months[val - 1]}` : months[val - 1];
  }
  if (type === "dayOfWeek") {
    const days = lang === "en" ? dayNamesEn : dayNamesZh;
    return lang === "en" ? `on ${days[val]}` : days[val];
  }

  return parts;
}

function translateCron(expression: string, lang: "en" | "zh"): string {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return "";

  const minute = describeField(parts[0], "minute", lang);
  const hour = describeField(parts[1], "hour", lang);
  const dayOfMonth = describeField(parts[2], "dayOfMonth", lang);
  const month = describeField(parts[3], "month", lang);
  const dayOfWeek = describeField(parts[4], "dayOfWeek", lang);

  if (lang === "en") {
    return `Runs ${minute}, ${hour}, ${dayOfMonth}, ${month}, ${dayOfWeek}`;
  } else {
    return `每${minute}、${hour}、${dayOfMonth}、${month}、${dayOfWeek}执行`;
  }
}

export function CronParser() {
  const { t, i18n } = useTranslation();
  const [expression, setExpression] = useState("*/5 * * * *");
  const [nextExecutions, setNextExecutions] = useState<Date[]>([]);

  const parseResult = useMemo(() => parseCron(expression), [expression]);
  const humanDescription = useMemo(
    () => parseResult.valid ? translateCron(expression, i18n.language as "en" | "zh") : "",
    [parseResult, expression, i18n.language]
  );

  const handleParse = () => {
    if (parseResult.valid) {
      setNextExecutions(getNextExecutions(expression, 10));
    } else {
      setNextExecutions([]);
    }
  };

  const handleExpressionChange = (value: string) => {
    setExpression(value);
    if (parseResult.valid) {
      setNextExecutions(getNextExecutions(value, 10));
    } else {
      setNextExecutions([]);
    }
  };

  const fieldLabels = ["Minute (0-59)", "Hour (0-23)", "Day (1-31)", "Month (1-12)", "Weekday (0-6)"];

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <h1 className="text-sm font-medium">{t("cronParser.title")}</h1>
      </div>

      {/* Expression input */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Input
            placeholder="*/5 * * * *"
            value={expression}
            onChange={(e) => handleExpressionChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleParse()}
            className="font-mono text-sm h-9 bg-background"
          />
          <Button size="sm" onClick={handleParse} className="h-9">
            {t("common.parse")}
          </Button>
        </div>

        {/* Validation status */}
        <div className="flex items-center gap-2">
          {parseResult.valid ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-xs text-green-500">{t("cronParser.valid")}</span>
            </>
          ) : (
            <>
              <X className="h-4 w-4 text-red-500" />
              <span className="text-xs text-red-500">{parseResult.error}</span>
            </>
          )}
        </div>

        {/* Human readable description */}
        {parseResult.valid && humanDescription && (
          <div className="mt-2 px-3 py-2 bg-primary/10 rounded-md">
            <span className="text-xs text-primary font-medium">{humanDescription}</span>
          </div>
        )}

        {/* Field reference */}
        <div className="flex flex-wrap gap-1">
          {fieldLabels.map((label, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-background rounded text-muted-foreground">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Next executions */}
      {parseResult.valid && nextExecutions.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
            {t("cronParser.nextExecutions")}
          </div>
          <div className="space-y-1">
            {nextExecutions.map((date, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-1.5 px-2 rounded bg-background/50"
              >
                <span className="text-xs text-muted-foreground w-6">#{i + 1}</span>
                <span className="font-mono text-xs">{date.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground">
                  {date.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}