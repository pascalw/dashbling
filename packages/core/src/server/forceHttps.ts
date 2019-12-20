import { ClientConfig } from "../lib/clientConfig";
import { Server, Request, ResponseToolkit } from "@hapi/hapi";

const isHttpRequest = (request: Request) => {
  return request.headers["x-forwarded-proto"] !== "https";
};

const extractHost = (request: Request) => {
  return request.headers["x-forwarded-host"] || request.headers.host;
};

export const install = (server: Server, clientConfig: ClientConfig) => {
  if (!clientConfig.forceHttps) return;

  server.ext({
    type: "onRequest",
    method: (request: Request, h: ResponseToolkit) => {
      if (isHttpRequest(request)) {
        return h
          .redirect("https://" + extractHost(request) + request.path)
          .permanent(true)
          .takeover();
      }

      return h.continue;
    }
  });
};
