import { PassThrough } from "stream";
import { EventBus } from "../lib/eventBus";
import { Event } from "../lib/Event";
import { ClientConfig } from "../lib/clientConfig";
const { heartbeat } = require("../lib/constants");
import { Server, Request, ResponseToolkit } from "@hapi/hapi";

interface PassThroughWithHeaders extends PassThrough {
  headers: { [key: string]: string };
}

export const install = (
  server: Server,
  eventBus: EventBus,
  clientConfig: ClientConfig
) => {
  server.route({
    method: "GET",
    path: "/events",
    handler: streamEventsHandler(eventBus)
  });

  server.route({
    method: "POST",
    path: "/events/{id}",
    options: {
      payload: { allow: "application/json" },
      auth: false // disable basic auth, uses custom authToken
    },
    handler: postEventHandler(eventBus, clientConfig.authToken)
  });
};

const streamEventsHandler = (eventBus: EventBus) => (
  _req: Request,
  _h: ResponseToolkit
) => {
  const stream = new PassThrough() as PassThroughWithHeaders;
  stream.headers = {
    "content-type": "text/event-stream",
    "content-encoding": "identity"
  };

  const subscriber = (event: Event) => {
    const outEvent = { ...event } as any;
    outEvent.updatedAt = event.updatedAt.getTime();

    stream.write(`data: ${JSON.stringify(outEvent)}\n\n`);
  };

  const sendHeartBeat = setInterval(() => {
    stream.write(`data: ${heartbeat}\n\n`);
  }, 20 * 1000);

  eventBus.subscribe(subscriber);
  eventBus.replayHistory(subscriber);

  stream.once("close", () => {
    eventBus.unsubscribe(subscriber);
    clearInterval(sendHeartBeat);
  });

  stream.write("\n\n");
  return stream;
};

const postEventHandler = (eventBus: EventBus, token: string) => (
  req: Request,
  h: ResponseToolkit
) => {
  const validAuthHeaders = [`Bearer ${token}`, `bearer ${token}`];
  if (!validAuthHeaders.includes(req.headers.authorization)) {
    return h.response("Unauthorized").code(401);
  }

  eventBus.publish(req.params.id, req.payload);
  return "OK";
};
