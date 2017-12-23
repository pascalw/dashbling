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
const basicValidConfig = {
  jobs: []
};

const parseAndExtractErrors = (config: any, env?) => {
  try {
    parse(config, projectPath, env);
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

describe("forceHttps", () => {
  test("throws if invalid forceHttps", () => {
    const rawConfig = Object.assign({}, basicValidConfig, {
      forceHttps: "not a bool"
    });

    const errors = parseAndExtractErrors(rawConfig);
    expect(errors[0]).toMatch(/forceHttps/);
  });

  test("takes env var over config.js", () => {
    const rawConfig = Object.assign({}, basicValidConfig, {
      forceHttps: false
    });

    const env = { FORCE_HTTPS: "true" };

    const config: ClientConfig = parse(rawConfig, projectPath, env);
    expect(config.forceHttps).toBe(true);
  });
});

describe("port", () => {
  test("defaults to 3000", () => {
    const config: ClientConfig = parse(basicValidConfig, projectPath);
    expect(config.port).toEqual(3000);
  });

  test("supports env var", () => {
    const env = { PORT: "1234" };

    const config: ClientConfig = parse(basicValidConfig, projectPath, env);
    expect(config.port).toEqual(1234);
  });

  test("throws if not a number", () => {
    const env = { PORT: "foobar" };

    const errors = parseAndExtractErrors(basicValidConfig, env);
    expect(errors[0]).toMatch(/port/);
  });
});

describe("eventStoragePath", () => {
  test("sets default", () => {
    const config: ClientConfig = parse(basicValidConfig, projectPath);
    expect(config.eventStoragePath).toEqual(
      path.join(process.cwd(), "dashbling-events")
    );
  });

  test("supports env var", () => {
    const env = { EVENT_STORAGE_PATH: "/tmp/some/where" };

    const config: ClientConfig = parse(basicValidConfig, projectPath, env);
    expect(config.eventStoragePath).toEqual("/tmp/some/where");
  });

  test("throws if not a string", () => {
    const rawConfig = Object.assign({}, basicValidConfig, {
      eventStoragePath: 123
    });

    const errors = parseAndExtractErrors(rawConfig);
    expect(errors[0]).toMatch(/eventStoragePath/);
  });
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
