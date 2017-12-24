const cron = require("node-cron");
import * as path from "path";
import logger from "./logger";
import { SendEvent } from "./sendEvent";

interface ConfigSource {
  get: (option: string) => any;
}

interface Parser {
  (input: any): any;
  expected?: string;
}

export class JobConfig {
  public readonly id?: string;
  public readonly schedule: string;
  public readonly fn: () => void;

  constructor(schedule: string, fn: () => void) {
    this.schedule = schedule;
    this.fn = fn;
  }
}

export interface ClientConfig {
  readonly projectPath: string;
  readonly jobs: JobConfig[];
  readonly onStart: (sendEvent: SendEvent) => void;

  readonly forceHttps: boolean;
  readonly port: number;
  readonly eventStoragePath: string;
}

const DEFAULTS: any = {
  port: 3000,
  forceHttps: false,
  eventStoragePath: path.join(process.cwd(), "dashbling-events"),
  onStart: () => {}
};

const error = (name: string, expectation: string, actualValue: any): Error => {
  return new Error(
    `Invalid '${name}' configuration. Expected '${name}' to be ${expectation}, but was '${actualValue}'.`
  );
};

const isFunction = (val: any): boolean => {
  return typeof val === "function";
};

const envify = (option: string) => {
  return option
    .split(/(?=[A-Z])/)
    .join("_")
    .toUpperCase();
};

const tryParseBool: Parser = (input: any) => {
  if (typeof input === "boolean") return input;

  if (typeof input === "string") {
    if (input.toLocaleLowerCase() === "true") return true;
    if (input.toLocaleLowerCase() === "false") return false;
  }

  return null;
};
tryParseBool.expected = "a boolean";

const tryParseNumber: Parser = (input: any) => {
  const parsed = Number(input);
  return isNaN(parsed) ? null : parsed;
};
tryParseNumber.expected = "a number";

const tryParseString: Parser = (input: any) => {
  return typeof input === "string" ? input : null;
};

const getConfigOption = (configSources: ConfigSource[]) => (
  option: string,
  parse: Parser
) => {
  for (const configSource of configSources) {
    const value = configSource.get(option);

    if (value != null) {
      const parsedValue = parse(value);

      if (parsedValue == null) {
        throw error(option, parse.expected!, value);
      }

      return parsedValue;
    }
  }

  throw new Error("Missing required config option " + option);
};

const envConfigSource = (env: NodeJS.ProcessEnv) => {
  return <ConfigSource>{
    get(option) {
      return env[envify(option)];
    }
  };
};

const objectConfigSource = (object: any) => {
  return <ConfigSource>{
    get(option) {
      return object[option];
    }
  };
};

const valideJobs = (config: any) => {
  if (!(config.jobs instanceof Array))
    throw error("jobs", "an array", config.jobs);

  config.jobs.forEach((job: any) => {
    if (!isFunction(job.fn)) {
      throw error("job.fn", "a function", job.fn);
    }

    if (!cron.validate(job.schedule)) {
      throw error("job.schedule", "a valid cron expression", job.schedule);
    }
  });
};

export const load = (projectPath: string): ClientConfig => {
  const configPath = path.join(projectPath, "dashbling.config.js");

  const rawConfig = require(configPath);
  return parse(rawConfig, projectPath);
};

export const parse = (
  input: any,
  projectPath: string,
  env = process.env
): ClientConfig => {
  valideJobs(input);

  if (input.onStart != null && !isFunction(input.onStart)) {
    throw error("onStart", "a function", input.onStart);
  }

  const loadConfigOption = getConfigOption([
    envConfigSource(env),
    objectConfigSource(input),
    objectConfigSource(DEFAULTS)
  ]);

  return {
    projectPath: projectPath,
    onStart: input.onStart || DEFAULTS.onStart,
    jobs: input.jobs,
    forceHttps: loadConfigOption("forceHttps", tryParseBool),
    port: loadConfigOption("port", tryParseNumber),
    eventStoragePath: loadConfigOption("eventStoragePath", tryParseString)
  };
};
