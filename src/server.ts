const Hapi = require("hapi");
import { EventBus } from "./lib/eventBus";
import { createHistory } from "./lib/PersistentEventHistory";
import * as jobs from "./lib/jobs";
import logger from "./lib/logger";
import { ClientConfig, load } from "./lib/clientConfig";
import { install as installHttpsEnforcement } from "./server/forceHttps";

const installAssetHandling = (
  environment: string,
  server: any,
  clientConfig: ClientConfig
) => {
  if (environment === "development") {
    return require("./server/webpackDevMiddleware").install(
      server,
      clientConfig
    );
  } else {
    return require("./server/compiledAssets").install(server, clientConfig);
  }
};

export const start = async (projectPath: string, eventBus?: EventBus) => {
  const clientConfig: ClientConfig = load(projectPath);
  const environment = process.env.NODE_ENV || "production";

  const history = await createHistory(clientConfig.eventStoragePath);
  eventBus = eventBus || new EventBus(history);

  const server = new Hapi.Server({
    port: clientConfig.port
  });

  require("./server/logging").install(server);
  require("./server/routes").install(server, eventBus);
  installHttpsEnforcement(server, clientConfig);
  await installAssetHandling(environment, server, clientConfig);

  const sendEvent = eventBus.publish.bind(eventBus);
  jobs.start(clientConfig, sendEvent);
  clientConfig.onStart(sendEvent);

  await server.initialize();
  await server.start();

  logger.info("Server running at: %s", server.info.uri);
  return server;
};
