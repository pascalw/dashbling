const Hapi = require("hapi");
const Stream = require("stream");
const PassThrough = Stream.PassThrough;
const jobs = require("./server/jobs");
const eventBus = require("./server/eventBus");
const logger = require("./lib/logger");

const postEventToken =
  process.env.AUTH_TOKEN ||
  (() => {
    const token = require("crypto")
      .randomBytes(20)
      .toString("base64")
      .replace(/\W/g, "");

    logger.warn(
      "No AUTH_TOKEN was specified, using random token %s for authentication.",
      token
    );

    return token;
  })();

module.exports.start = async projectPath => {
  const port = process.env.PORT || 3000;
  const environment = process.env.NODE_ENV || "production";

  const server = new Hapi.Server({
    port: port
  });

  require("./server/support/logging").install(server);

  if (environment === "production") {
    await require("./server/support/compiled-assets").install(
      server,
      projectPath
    );
  } else {
    require("./server/support/webpack-dev-middleware").install(
      server,
      projectPath
    );
  }

  server.route({
    method: "GET",
    path: "/events",
    handler: (req, h) => {
      const stream = new PassThrough();
      stream.headers = {
        "content-type": "text/event-stream",
        "content-encoding": "identity"
      };

      const subscriber = event => {
        stream.write(`data: ${JSON.stringify(event)}\n\n`);
      };

      eventBus.subscribe(subscriber);
      eventBus.replayHistory(subscriber);

      stream.once("close", () => {
        eventBus.unsubscribe(subscriber);
      });

      stream.write("\n\n");
      return stream;
    }
  });

  server.route({
    method: "POST",
    path: "/events/{id}",
    options: {
      payload: { allow: "application/json" }
    },
    handler: (req, h) => {
      if (`bearer ${postEventToken}` !== req.headers.authorization) {
        return h.response("Unauthorized").code(401);
      }

      eventBus.publish(req.params.id, req.payload);
      return "OK";
    }
  });

  jobs.start(projectPath, eventBus.publish);

  await server.initialize();

  server
    .start()
    .then(() => {
      logger.info("Server running at: %s", server.info.uri);
    })
    .catch(e => {
      logger.error(e);
      process.exit(1);
    });
};
