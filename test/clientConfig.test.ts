import * as path from "path";
import {
  ClientConfig,
  parse,
  load,
  ValidationError
} from "../src/lib/clientConfig";
import logger from "../src/lib/logger";
logger.close();

const projectPath = "/fake";
const parseAndExtractErrors = (config: any) => {
  try {
    parse(config, projectPath);
  } catch (e) {
    return e.errors;
  }
};

test("returns typed configuration if valid", () => {
  const raw = {
    jobs: [{ id: "myJob", schedule: "*/5 * * * *", fn: () => {} }]
  };

  const config: ClientConfig = parse(raw, projectPath);
  expect(config.projectPath).toEqual(projectPath);
  expect(config.jobs).toEqual(raw.jobs);
});

test("throws if configuration invalid", () => {
  const raw = {};

  expect(() => {
    parse(raw, projectPath);
  }).toThrow();
});

test("validates onStart", () => {
  const config = {
    jobs: [],
    onStart: "wrong type"
  };

  const errors = parseAndExtractErrors(config);
  expect(errors[0]).toMatch(/Invalid 'onStart'/);
});

test("throws if passed invalid cron expression", () => {
  const raw = { jobs: [{ schedule: "not a cron exp", fn: () => {} }] };

  let caughtException = null;

  try {
    parse(raw, projectPath);
  } catch (e) {
    caughtException = e;
  }

  expect(caughtException).not.toBeNull;
  expect(caughtException).toBeInstanceOf(ValidationError);

  const validationError = caughtException as ValidationError;
  expect(validationError.errors[0]).toEqual(
    "Invalid 'job.schedule' configuration. Expected 'job.schedule' to be a valid cron expression, but was 'not a cron exp'."
  );
});

test("loads and validates config from file", () => {
  const projectPath = path.join(__dirname, "fixture");
  const config: ClientConfig = load(projectPath);

  expect(config.projectPath).toEqual(projectPath);
});

test("throws when config cannot be loaded", () => {
  const projectPath = path.join("/tmp/bogus");

  expect(() => {
    load(projectPath);
  }).toThrowError(/Unable to load configuration/);
});
