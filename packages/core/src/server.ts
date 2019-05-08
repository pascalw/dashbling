const Hapi = require("hapi");
import { EventBus } from "./lib/eventBus";
import { createHistory as createInMemoryHistory } from "./lib/InMemoryEventHistory";
import * as jobs from "./lib/jobs";
import logger from "./lib/logger";
import { ClientConfig, load } from "./lib/clientConfig";
import { install as installHttpsEnforcement } from "./server/forceHttps";
import { install as installRoutes } from "./server/routes";
import { install as installLogging } from "./server/logging";
import { install as installBasicAuth } from "./server/basicAuth";

const installAssetHandling = async (
  environment: string,
  server: any,
  clientConfig: ClientConfig
) => {
  if (environment === "development") {
    const devMiddleware = await import("@dashbling/build-support/webpackDevMiddleware");
    return devMiddleware.install(server, clientConfig);
  } else {
    const compiledAssets = await import("./server/compiledAssets");
    return compiledAssets.install(server, clientConfig.projectPath);
  }
};

const createEventHistory = (config: ClientConfig) => {
  if (config.eventHistory instanceof Promise) {
    return config.eventHistory;
  }

  if (config.eventHistory === false) {
    return createInMemoryHistory();
  }

  throw new Error(`Invalid eventHistory: ${config.eventHistory}`);
};

const installUnhandledRejectionHandler = (environment: string) => {
  if (environment === "production") {
    process.on("unhandledRejection", (reason, p) => {
      console.warn("Unhandled Rejection at:", p, "reason:", reason);
    });
  }
};

export const start = async (projectPath: string, eventBus?: EventBus) => {
  const clientConfig: ClientConfig = load(projectPath);
  const environment = process.env.NODE_ENV || "production";

  const history = await createEventHistory(clientConfig);
  eventBus = eventBus || new EventBus(history, clientConfig.eventReducer);

  const server = new Hapi.Server({
    port: clientConfig.port
  });

  installLogging(server);
  installHttpsEnforcement(server, clientConfig);
  await installBasicAuth(server, clientConfig);
  await installAssetHandling(environment, server, clientConfig);
  installRoutes(server, eventBus, clientConfig);

  const sendEvent = eventBus.publish.bind(eventBus);
  jobs.start(clientConfig, sendEvent);

  clientConfig.onStart(sendEvent);
  await clientConfig.configureServer(server);

  await server.initialize();
  await server.start();

  installUnhandledRejectionHandler(environment);

  logger.info("Server running at: %s", server.info.uri);
  return server;
};
