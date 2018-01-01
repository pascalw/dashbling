import * as path from "path";
import { ClientConfig, parse, load } from "../src/lib/clientConfig";

const projectPath = "/fake";
const basicValidConfig = {
  jobs: []
};

const parseAndExtractError = (config: any, env?) => {
  try {
    parse(config, projectPath, env);
  } catch (e) {
    return e.message;
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

  const error = parseAndExtractError(config);
  expect(error).toMatch(/Invalid 'onStart'/);
});

test("throws if passed invalid cron expression", () => {
  const raw = { jobs: [{ schedule: "not a cron exp", fn: () => {} }] };

  const error = parseAndExtractError(raw);

  expect(error).toEqual(
    "Invalid 'job.schedule' configuration. Expected 'job.schedule' to be a valid cron expression, but was 'not a cron exp'."
  );
});

describe("forceHttps", () => {
  test("throws if invalid forceHttps", () => {
    const rawConfig = Object.assign({}, basicValidConfig, {
      forceHttps: "not a bool"
    });

    const error = parseAndExtractError(rawConfig);
    expect(error).toMatch(/forceHttps/);
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

    const error = parseAndExtractError(basicValidConfig, env);
    expect(error).toMatch(/port/);
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

    const error = parseAndExtractError(rawConfig);
    expect(error).toMatch(/eventStoragePath/);
  });
});

describe("authToken", () => {
  test("sets default", () => {
    const config: ClientConfig = parse(basicValidConfig, projectPath);
    expect(typeof config.authToken).toBe("string");
  });

  test("supports env var", () => {
    const env = { AUTH_TOKEN: "s3cr3t" };

    const config: ClientConfig = parse(basicValidConfig, projectPath, env);
    expect(config.authToken).toEqual("s3cr3t");
  });
});

describe("basicAuth", () => {
  test("no default", () => {
    const config: ClientConfig = parse(basicValidConfig, projectPath);
    expect(config.basicAuth).toBeNull();
  });

  test("supports env var", () => {
    const env = { BASIC_AUTH: "username:password" };

    const config: ClientConfig = parse(basicValidConfig, projectPath, env);
    expect(config.basicAuth).toEqual("username:password");
  });
});

describe("webpackConfig", () => {
  test("default no-op", () => {
    const config: ClientConfig = parse(basicValidConfig, projectPath);

    const webpackConfig = {};
    expect(config.webpackConfig(webpackConfig)).toBe(webpackConfig);
  });

  test("validates is a function", () => {
    const rawConfig = Object.assign({}, basicValidConfig, {
      webpackConfig: 123
    });

    const error = parseAndExtractError(rawConfig);
    expect(error).toMatch(/webpackConfig/);
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
  }).toThrowError(/Cannot find module/);
});
