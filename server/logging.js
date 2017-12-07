const logger = require("../lib/logger");

module.exports.install = server => {
  server.events.on("response", request => {
    logger.info(
      `${request.info.remoteAddress}: ${request.method.toUpperCase()} ${
        request.url.path
      } ${request.response.statusCode}`
    );
  });
};
