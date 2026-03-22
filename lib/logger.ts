type LogLevel = "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  details?: unknown;
  timestamp: string;
}

function formatLog(entry: LogEntry): string {
  const prefix = `[${entry.timestamp}] [${entry.level.toUpperCase()}]`;
  const ctx = entry.context ? ` [${entry.context}]` : "";
  return `${prefix}${ctx} ${entry.message}`;
}

function log(level: LogLevel, message: string, context?: string, details?: unknown) {
  const entry: LogEntry = {
    level,
    message,
    context,
    details,
    timestamp: new Date().toISOString(),
  };

  const formatted = formatLog(entry);

  switch (level) {
    case "error":
      console.error(formatted, details ?? "");
      break;
    case "warn":
      console.warn(formatted, details ?? "");
      break;
    default:
      console.log(formatted, details ?? "");
  }
}

export const logger = {
  info: (message: string, context?: string, details?: unknown) =>
    log("info", message, context, details),
  warn: (message: string, context?: string, details?: unknown) =>
    log("warn", message, context, details),
  error: (message: string, context?: string, details?: unknown) =>
    log("error", message, context, details),
};
