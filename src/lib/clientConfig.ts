const cron = require("node-cron");
import * as path from "path";

export class JobConfig {
  public readonly id?: string;
  public readonly schedule: string;
  public readonly fn: () => void;

  constructor(schedule: string, fn: () => void) {
    this.schedule = schedule;
    this.fn = fn;
  }
}

export class ClientConfig {
  public readonly projectPath: string;
  public readonly jobs: JobConfig[] = [];

  constructor(projectPath: string) {
    this.projectPath = projectPath;
  }
}

export class ValidationError extends Error {
  public errors: string[];

  constructor(errors: string[]) {
    super();
    this.errors = errors;
  }
}

const error = (name: string, expectation: string, actualValue: any): string => {
  return `Invalid '${name}' configuration. Expected '${name}' to be ${expectation}, but was '${actualValue}'.`;
};

export const parse = (input: any, projectPath: string): ClientConfig => {
  const errors = new Array<string>();

  if (!(input.jobs instanceof Array)) {
    errors.push(error("jobs", "an array", input.jobs));
  } else {
    input.jobs.forEach((job: any) => {
      if (!(job.fn instanceof Function)) {
        errors.push(error("job.fn", "a funciton", job.fn));
      }

      if (!cron.validate(job.schedule)) {
        errors.push(
          error("job.schedule", "a valid cron expression", job.schedule)
        );
      }
    });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  const config = new ClientConfig(projectPath);
  Object.assign(config, input);

  return config;
};

export const load = (projectPath: string): ClientConfig => {
  try {
    const rawConfig = require(path.join(projectPath, "dashbling.config.js"));
    return parse(rawConfig, projectPath);
  } catch (e) {
    throw new Error(`Unable to load configuration at path '${path}'.`);
  }
};
