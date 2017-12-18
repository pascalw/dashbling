#!/usr/bin/env node
import * as server from "./server";
import * as assets from "./lib/assets";
import logger from "./lib/logger";
import * as program from "commander";
program.version(require("../package.json").version);

const projectPath = process.cwd();

program.command("start").action(async () => {
  try {
    await server.start(projectPath);
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
});

program.command("compile").action(async () => {
  process.env.NODE_ENV = process.env.NODE_ENV || "production";

  try {
    const stats: any = await assets.compile(projectPath);
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
