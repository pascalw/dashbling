const cron = require("node-cron");
import * as path from "path";
import logger from "./logger";
import { generate as generateAuthToken } from "./authToken";
import { SendEvent } from "./sendEvent";
import { EventHistory } from "./EventHistory";
import { Reducer, defaultReducer } from "./eventBus";

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
  readonly configureServer: (server: any) => Promise<void>;
  readonly webpackConfig: (defaultConfig: any) => any;
  readonly eventHistory: Promise<EventHistory>;
  readonly eventReducer: Reducer;

  readonly forceHttps: boolean;
  readonly port: number;
  readonly authToken: string;
  readonly basicAuth: string | null;
}

const DEFAULTS: { [key: string]: any } = {
  port: 3000,
  forceHttps: false,
  onStart: () => {},
  configureServer: () => Promise.resolve(),
  webpackConfig: (config: any) => config,
  authToken: () => {
    const token = generateAuthToken();

    logger.warn(
      "No authToken was specified, using random token %s for authentication.",
      token
    );

    return token;
  },
  eventReducer: defaultReducer
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
tryParseString.expected = "a string";

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

  return null;
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
      let value = object[option];
      if (typeof value === "function") value = value();

      return value;
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

  if (input.configureServer != null && !isFunction(input.configureServer)) {
    throw error("configureServer", "a function", input.configureServer);
  }

  if (input.webpackConfig != null && !isFunction(input.webpackConfig)) {
    throw error("webpackConfig", "a function", input.webpackConfig);
  }

  if (!(input.eventHistory instanceof Promise)) {
    throw error("eventHistory", "a Promise<EventHistory>", input.eventHistory);
  }

  if (input.eventReducer != null && !isFunction(input.eventReducer)) {
    throw error("eventReducer", "a function", input.eventReducer);
  }

  const loadConfigOption = getConfigOption([
    envConfigSource(env),
    objectConfigSource(input),
    objectConfigSource(DEFAULTS)
  ]);

  return {
    projectPath: projectPath,
    onStart: input.onStart || DEFAULTS.onStart,
    configureServer: input.configureServer || DEFAULTS.configureServer,
    webpackConfig: input.webpackConfig || DEFAULTS.webpackConfig,
    eventReducer: input.eventReducer || DEFAULTS.eventReducer,
    jobs: input.jobs,
    forceHttps: loadConfigOption("forceHttps", tryParseBool),
    port: loadConfigOption("port", tryParseNumber),
    authToken: loadConfigOption("authToken", tryParseString),
    basicAuth: loadConfigOption("basicAuth", tryParseString),
    eventHistory: input.eventHistory || DEFAULTS.eventHistory
  };
};
