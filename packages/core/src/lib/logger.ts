const tracer = require("tracer");

export type Level = "debug" | "info" | "warn" | "error";

export interface Logger {
  debug(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  error(error: Error): void;

  setLevel(level: Level): void;
  close(): void;
}

export const defaultLevel: Level = (process.env.LOG_LEVEL as Level) || "info";

const logger: Logger = tracer.colorConsole({
  level: defaultLevel,
  format: "{{timestamp}} [{{title}}] {{message}}"
});

logger.setLevel = (level: Level) => {
  tracer.setLevel(level);
};

export default logger;
