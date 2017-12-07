const server = require("../../server");
const eventBus = require("../../lib/eventBus");
const path = require("path");
const http = require("http");
const { mockDate } = require("../utils");
const logger = require("../../lib/logger");
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

const NOW = Date.now();

beforeAll(() => {
  logger.setLevel("error");
});

beforeEach(async () => {
  mockDate(NOW);
  process.env.PORT = 12345;
  process.env.AUTH_TOKEN = "foobar";
  serverInstance = null;
});

afterEach(() => {
  Date.now.restore();
  serverInstance && serverInstance.stop();
});

test("sends events over /events stream", async () => {
  serverInstance = await server.start(path.join(__dirname, "fixture"));
  eventBus.publish("myEvent", { some: "arg" });

  return new Promise((resolve, reject) => {
    const req = http.get(
      "http://127.0.0.1:12345/events",
      extractEvents(event => {
        expect(event).toEqual({
          id: "myEvent",
          data: { some: "arg" },
          updatedAt: NOW
        });

        req.abort();
        resolve();
      })
    );
  });
});

test("supports receiving events over HTTP", async () => {
  serverInstance = await server.start(path.join(__dirname, "fixture"));

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
  const jobFn = jest.fn();

  jobs.push({
    schedule: "*/5 * * * *",
    fn: jobFn
  });

  serverInstance = await server.start(path.join(__dirname, "fixture"));
  expect(jobFn).toHaveBeenCalledWith(eventBus.publish);
});
