const Hapi = require("hapi");
const Stream = require("stream");
const PassThrough = Stream.PassThrough;
const jobs = require("./server/jobs");
const eventBus = require("./server/eventBus");
const logger = require("./lib/logger");

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
