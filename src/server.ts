const Hapi = require("hapi");
import * as eventBus from "./lib/eventBus";
import * as jobs from "./lib/jobs";
import logger from "./lib/logger";

const installAssetHandling = (
  environment: string,
  server: any,
  projectPath: string
) => {
  if (environment === "development") {
    return require("./server/webpackDevMiddleware").install(
      server,
      projectPath
    );
  } else {
    return require("./server/compiledAssets").install(server, projectPath);
  }
};

export const start = async (projectPath: string) => {
  const port = process.env.PORT || 3000;
  const environment = process.env.NODE_ENV || "production";

  const server = new Hapi.Server({
    port: port
  });

  require("./server/logging").install(server);
  require("./server/routes").install(server);
  await installAssetHandling(environment, server, projectPath);

  jobs.start(projectPath, eventBus.publish);

  await server.initialize();
  await server.start();

  logger.info("Server running at: %s", server.info.uri);
  return server;
};
