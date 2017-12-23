import { ClientConfig } from "../lib/clientConfig";

const isHttpRequest = (request: any) => {
  return request.headers["x-forwarded-proto"] !== "https";
};

const extractHost = (request: any) => {
  return request.headers["x-forwarded-host"] || request.headers.host;
};

export const install = (server: any, clientConfig: ClientConfig) => {
  if (!clientConfig.forceHttps) return;

  server.ext({
    type: "onRequest",
    method: (request: any, h: any) => {
      if (isHttpRequest(request)) {
        return h
          .redirect("https://" + extractHost(request) + request.url.path)
          .permanent(true)
          .takeover();
      }

      return h.continue;
    }
  });
};
