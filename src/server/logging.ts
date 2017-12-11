import logger from "../lib/logger";

module.exports.install = (server: any) => {
  server.events.on("response", (request: any) => {
    logger.info(
      `${request.info.remoteAddress}: ${request.method.toUpperCase()} ${
        request.url.path
      } ${request.response.statusCode}`
    );
  });
};
