import * as server from "../../src/server";
import { EventBus } from "../../src/lib/eventBus";
import { SendEvent } from "../../src/lib/sendEvent";
import * as path from "path";
import * as http from "http";
import { mockDate, restoreDate } from "../utils";
import logger from "../../src/lib/logger";
const jobs = require("./fixture/jobs");

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
  logger.setLevel("error");
});

beforeEach(async () => {
  mockDate(NOW);
  process.env.PORT = "12345";
  process.env.AUTH_TOKEN = "foobar";
  serverInstance = null;
});

afterEach(() => {
  restoreDate();
  serverInstance && serverInstance.stop();
});

test("sends events over /events stream", async () => {
  const eventBus = new EventBus();
  serverInstance = await server.start(
    path.join(__dirname, "fixture"),
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
  const eventBus = new EventBus();
  serverInstance = await server.start(
    path.join(__dirname, "fixture"),
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
  const eventBus = new EventBus();
  const publishSpy = jest.spyOn(eventBus, "publish");

  const jobFn = (sendEvent: SendEvent) => {
    sendEvent("myJob", {});
  };

  jobs.push({
    schedule: "*/5 * * * *",
    fn: jobFn
  });

  serverInstance = await server.start(
    path.join(__dirname, "fixture"),
    eventBus
  );
  expect(publishSpy).toHaveBeenCalledWith("myJob", {});
});
