import * as server from "../../src/server";
import { EventBus } from "../../src/lib/eventBus";
import { SendEvent } from "../../src/lib/sendEvent";
import * as path from "path";
import * as http from "http";
import { mockDate, restoreDate, mkTempFile } from "../utils";
import { createHistory } from "../../src/lib/InMemoryEventHistory";
import fetch from "node-fetch";

const dashblingConfig = require("../fixture/dashbling.config");
const originalConfig = Object.assign({}, dashblingConfig);

let serverInstance: any;

const extractEvents = (onEvent: ((event: any) => void)) => (
  response: http.IncomingMessage
) => {
  response.on("data", data => {
    const stringData = data.toString();
    if (stringData.startsWith("data:")) {
      const eventData = JSON.parse(stringData.substring(6));
      onEvent(eventData);
    }
  });
};

const createEventBus = async () => {
  const history = await createHistory();
  return EventBus.withDefaultReducer(history);
};

const NOW = new Date();

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
  const eventBus = await createEventBus();
  serverInstance = await server.start(
    path.join(__dirname, "..", "fixture"),
    eventBus
  );
  eventBus.publish("myEvent", { some: "arg" });

  return new Promise((resolve, _reject) => {
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

describe("receiving events over HTTP", () => {
  test("requires AUTH_TOKEN", async () => {
    const eventBus = await createEventBus();
    serverInstance = await server.start(
      path.join(__dirname, "..", "fixture"),
      eventBus
    );

    return new Promise((resolve, _reject) => {
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

  test("header specifying AUTH_TOKEN is case insensitive", async () => {
    const eventBus = await createEventBus();
    serverInstance = await server.start(
      path.join(__dirname, "..", "fixture"),
      eventBus
    );

    return new Promise((resolve, _reject) => {
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
          Authorization: `Bearer ${process.env.AUTH_TOKEN}`
        }
      });

      request.write(JSON.stringify({ some: "arg" }));
      request.end();
    });
  });

  test("with basicAuth enabled, still requires AUTH_TOKEN", async () => {
    dashblingConfig.basicAuth = "username:password";

    const eventBus = await createEventBus();
    serverInstance = await server.start(
      path.join(__dirname, "..", "fixture"),
      eventBus
    );

    return new Promise((resolve, _reject) => {
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
});

test("executes jobs on start", async () => {
  const eventBus = await createEventBus();
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
  const eventBus = await createEventBus();
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

test("calls config.configureServer", async () => {
  const eventBus = await createEventBus();

  dashblingConfig.configureServer = jest.fn((server: any) => {
    expect(server.route).not.toBeUndefined();
    return Promise.resolve();
  });

  serverInstance = await server.start(
    path.join(__dirname, "..", "fixture"),
    eventBus
  );

  expect(dashblingConfig.configureServer).toHaveBeenCalled();
});

describe("forcing https", () => {
  test("supports forcing https", async () => {
    dashblingConfig.forceHttps = true;
    const eventBus = await createEventBus();

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
    const eventBus = await createEventBus();

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
    const eventBus = await createEventBus();

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

describe("basic auth", () => {
  test("401 if no auth provided", async () => {
    dashblingConfig.basicAuth = "username:password";
    const eventBus = await createEventBus();

    serverInstance = await server.start(
      path.join(__dirname, "..", "fixture"),
      eventBus
    );

    const response = await fetch(`http://localhost:${process.env.PORT}/`);
    expect(response.status).toEqual(401);
  });

  test("401 if invalid auth provided", async () => {
    dashblingConfig.basicAuth = "username:password";
    const eventBus = await createEventBus();

    serverInstance = await server.start(
      path.join(__dirname, "..", "fixture"),
      eventBus
    );

    const response = await fetch(`http://localhost:${process.env.PORT}/`, {
      headers: {
        Authorization: "Basic " + Buffer.from("foo:bar").toString("base64")
      }
    });

    expect(response.status).toEqual(401);
  });

  test("Pass if valid auth provided", async () => {
    dashblingConfig.basicAuth = "username:password";
    const eventBus = await createEventBus();

    serverInstance = await server.start(
      path.join(__dirname, "..", "fixture"),
      eventBus
    );

    const response = await fetch(`http://localhost:${process.env.PORT}/`, {
      headers: {
        Authorization:
          "Basic " + Buffer.from(dashblingConfig.basicAuth).toString("base64")
      }
    });
    expect(response.status).not.toEqual(401);
  });
});
