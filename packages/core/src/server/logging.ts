import logger from "../lib/logger";
import { Server, Request, ResponseObject } from "@hapi/hapi";

export const install = (server: Server) => {
  server.events.on("response", (request: Request) => {
    logger.info(
      `${request.info.remoteAddress}: ${request.method.toUpperCase()} ${
        request.path
      } ${(request.response as ResponseObject).statusCode}`
    );
  });
};
