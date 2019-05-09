import logger from "../lib/logger";

export const install = (server: any) => {
  server.events.on("response", (request: any) => {
    logger.info(
      `${request.info.remoteAddress}: ${request.method.toUpperCase()} ${
        request.url.pathname
      } ${request.response ? request.response.statusCode : "none"}`
    );
  });
};
