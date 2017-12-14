const Hapi = require("hapi");
import { EventBus } from "./lib/eventBus";
import { createHistory } from "./lib/PersistentEventHistory";
import * as jobs from "./lib/jobs";
import logger from "./lib/logger";
import * as path from "path";

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

export const start = async (projectPath: string, eventBus?: EventBus) => {
  const port = process.env.PORT || 3000;
  const environment = process.env.NODE_ENV || "production";

  const eventStorageFile =
    process.env.EVENT_STORAGE_PATH ||
    path.join(process.cwd(), "dashbling-events");

  const history = await createHistory(eventStorageFile);
  eventBus = eventBus || new EventBus(history);

  const server = new Hapi.Server({
    port: port
  });

  require("./server/logging").install(server);
  require("./server/routes").install(server, eventBus);
  await installAssetHandling(environment, server, projectPath);

  jobs.start(projectPath, eventBus.publish.bind(eventBus));

  await server.initialize();
  await server.start();

  logger.info("Server running at: %s", server.info.uri);
  return server;
};
