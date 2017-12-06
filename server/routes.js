const Stream = require("stream");
const PassThrough = Stream.PassThrough;
const eventBus = require("../lib/eventBus");

module.exports.install = server => {
  server.route({
    method: "GET",
    path: "/events",
    handler: streamEventsHandler
  });

  server.route({
    method: "POST",
    path: "/events/{id}",
    options: {
      payload: { allow: "application/json" }
    },
    handler: postEventHandler(postEventToken())
  });
};

const postEventToken = () => {
  let token = process.env.AUTH_TOKEN;
  if (token) return token;

  token = require("crypto")
    .randomBytes(20)
    .toString("base64")
    .replace(/\W/g, "");

  logger.warn(
    "No AUTH_TOKEN was specified, using random token %s for authentication.",
    token
  );

  return token;
};

const streamEventsHandler = (req, h) => {
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
};

const postEventHandler = token => (req, h) => {
  if (`bearer ${token}` !== req.headers.authorization) {
    return h.response("Unauthorized").code(401);
  }

  eventBus.publish(req.params.id, req.payload);
  return "OK";
};
