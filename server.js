const Hapi = require("hapi");
const eventBus = require("./lib/eventBus");
const jobs = require("./lib/jobs");
const logger = require("./lib/logger");

const installAssetHandling = (environment, server, projectPath) => {
  if (environment === "development") {
    return require("./server/webpackDevMiddleware").install(
      server,
      projectPath
    );
  } else {
    return require("./server/compiledAssets").install(server, projectPath);
  }
};

module.exports.start = async projectPath => {
  const port = process.env.PORT || 3000;
  const environment = process.env.NODE_ENV || "production";

  server = new Hapi.Server({
    port: port
  });

  require("./server/logging").install(server);
  require("./server/routes").install(server);
  await installAssetHandling(environment, server, projectPath);

  jobs.start(projectPath, eventBus.publish);

  try {
    await server.initialize();
    await server.start();
    logger.info("Server running at: %s", server.info.uri);
    return server;
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
};
