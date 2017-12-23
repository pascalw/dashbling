import * as server from "../../src/server";
import { EventBus } from "../../src/lib/eventBus";
import { SendEvent } from "../../src/lib/sendEvent";
import * as path from "path";
import * as http from "http";
import {
  mockDate,
  restoreDate,
  createEventHistory,
  mkTempFile
} from "../utils";
import logger from "../../src/lib/logger";
import fetch from "node-fetch";

const dashblingConfig = require("../fixture/dashbling.config");
const originalConfig = Object.assign({}, dashblingConfig);

let serverInstance;

const extractEvents = onEvent => response => {
  response.on("data", data => {
    const stringData = data.toString();
    if (stringData.startsWith("data:")) {
      const eventData = JSON.parse(stringData.substring(6));
      onEvent(eventData);
    }
  });
};

const NOW = new Date();

beforeAll(() => {
  logger.close();
});

beforeEach(async () => {
  mockDate(NOW);

  Object.keys(dashblingConfig).forEach(key => {
    delete dashblingConfig[key];
  });
  Object.assign(dashblingConfig, originalConfig);

  process.env.PORT = "12345";
  process.env.AUTH_TOKEN = "foobar";
  process.env.EVENT_STORAGE_PATH = await mkTempFile("test-events");
  serverInstance = null;
});

afterEach(() => {
  restoreDate();
  delete process.env.PORT;
  delete process.env.AUTH_TOKEN;
  delete process.env.EVENT_STORAGE_PATH;
  serverInstance && serverInstance.stop();
});

test("sends events over /events stream", async () => {
  const eventBus = new EventBus(createEventHistory());
  serverInstance = await server.start(
    path.join(__dirname, "..", "fixture"),
    eventBus
  );
  eventBus.publish("myEvent", { some: "arg" });

  return new Promise((resolve, reject) => {
    const req = http.get(
      "http://127.0.0.1:12345/events",
      extractEvents(event => {
        expect(event).toEqual({
          id: "myEvent",
          data: { some: "arg" },
          updatedAt: NOW.getTime()
        });

        req.abort();
        resolve();
      })
    );
  });
});

test("supports receiving events over HTTP", async () => {
  const eventBus = new EventBus(createEventHistory());
  serverInstance = await server.start(
    path.join(__dirname, "..", "fixture"),
    eventBus
  );

  return new Promise((resolve, reject) => {
    eventBus.subscribe(event => {
      expect(event).toEqual({
        id: "myEvent",
        data: { some: "arg" },
        updatedAt: NOW
      });
      resolve();
    });

    const request = http.request({
      hostname: "127.0.0.1",
      port: 12345,
      path: "/events/myEvent",
      method: "POST",
      headers: {
        Authorization: `bearer ${process.env.AUTH_TOKEN}`
      }
    });

    request.write(JSON.stringify({ some: "arg" }));
    request.end();
  });
});

test("executes jobs on start", async () => {
  const eventBus = new EventBus(createEventHistory());
  const publishSpy = jest.spyOn(eventBus, "publish");

  const jobFn = (sendEvent: SendEvent) => {
    sendEvent("myJob", {});
  };

  dashblingConfig.jobs.push({
    schedule: "*/5 * * * *",
    fn: jobFn
  });

  serverInstance = await server.start(
    path.join(__dirname, "..", "fixture"),
    eventBus
  );
  expect(publishSpy).toHaveBeenCalledWith("myJob", {});
});

test("calls config.onStart", async () => {
  const eventBus = new EventBus(createEventHistory());
  const publishSpy = jest.spyOn(eventBus, "publish");

  dashblingConfig.onStart = jest.fn((sendEvent: SendEvent) => {
    sendEvent("myEvent", {});
  });

  serverInstance = await server.start(
    path.join(__dirname, "..", "fixture"),
    eventBus
  );

  expect(dashblingConfig.onStart).toHaveBeenCalled(); // can't compare bound functions :(
  expect(publishSpy).toHaveBeenCalledWith("myEvent", {});
});

describe("forcing https", () => {
  test("supports forcing https", async () => {
    dashblingConfig.forceHttps = true;
    const eventBus = new EventBus(createEventHistory());

    serverInstance = await server.start(
      path.join(__dirname, "..", "fixture"),
      eventBus
    );

    const response = await fetch(`http://localhost:${process.env.PORT}/`, {
      redirect: "manual"
    });

    expect(response.status).toEqual(301);
    expect(response.headers.get("location")).toEqual(
      `https://localhost:${process.env.PORT}/`
    );
  });

  test("redirects to x-forwarded-host", async () => {
    dashblingConfig.forceHttps = true;
    const eventBus = new EventBus(createEventHistory());

    serverInstance = await server.start(
      path.join(__dirname, "..", "fixture"),
      eventBus
    );

    const response = await fetch(`http://localhost:${process.env.PORT}/`, {
      redirect: "manual",
      headers: {
        "X-Forwarded-Host": "example.org"
      }
    });

    expect(response.status).toEqual(301);
    expect(response.headers.get("location")).toEqual(`https://example.org/`);
  });

  test("does not redirect if x-forwarded-proto is https", async () => {
    dashblingConfig.forceHttps = true;
    const eventBus = new EventBus(createEventHistory());

    serverInstance = await server.start(
      path.join(__dirname, "..", "fixture"),
      eventBus
    );

    const response = await fetch(`http://localhost:${process.env.PORT}/`, {
      redirect: "manual",
      headers: {
        "X-Forwarded-Proto": "https"
      }
    });

    expect(response.status).not.toEqual(301);
  });
});
