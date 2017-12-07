#!/usr/bin/env node
const server = require("./server");
const assets = require("./lib/assets");
const logger = require("./lib/logger");
const program = require("commander");
program.version(require("./package.json").version);

const projectPath = process.cwd();

program.command("start").action(async () => {
  try {
    await server.start(projectPath);
  } catch (e) {
    logger.error(e);
    process.exit(1);
  }
});

program.command("compile").action(() => {
  process.env.NODE_ENV = process.env.NODE_ENV || "production";
  assets.compile(projectPath);
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
