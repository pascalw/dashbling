#!/usr/bin/env node

const yargs = require("yargs");
const { createEnv } = require("yeoman-environment");
const { resolve, basename } = require("path");

const env = createEnv();
const done = exitCode => process.exit(exitCode || 0);
const dashboardGenerator = resolve(__dirname);
env.register(require.resolve(dashboardGenerator), "create-widget");

const cli = yargs
  .command("<widget-directory>")
  .demandCommand(1)
  .help()
  .wrap(null).argv;

const directory = resolve(cli._[0]);
const name = basename(directory);

env.run(
  "create-widget",
  {
    directory,
    name
  },
  done
);
