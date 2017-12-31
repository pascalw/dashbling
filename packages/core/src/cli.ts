#!/usr/bin/env node
import * as server from "./server";
import logger from "./lib/logger";
import * as program from "commander";
import { ClientConfig, load } from "./lib/clientConfig";
program.version(require("../package.json").version);

const projectPath = process.cwd();

program.command("start").action(async () => {
  try {
    const serverInstance = await server.start(projectPath);
    const gracefulShutdown = async () => {
      logger.info("Stopping server...");
      await serverInstance.stop();
      process.exit(0);
    };

    process.once("SIGINT", gracefulShutdown);
    process.once("SIGTERM", gracefulShutdown);
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
});

program.command("compile").action(async () => {
  process.env.NODE_ENV = process.env.NODE_ENV || "production";

  try {
    const assets = await import("@dashbling/build-support/assets");
    const clientConfig = load(projectPath);

    const stats: any = await assets.compile(clientConfig);
    console.log(stats.toString({ colors: true }));

    if (stats.hasErrors()) {
      process.exit(1);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});

program.on("--help", () => process.exit(1));

program.on("command:*", action => {
  console.log(`Unknown command '${action}'`);
  return program.help();
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
