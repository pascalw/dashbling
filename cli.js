#!/usr/bin/env node
const server = require("./server");
const program = require("commander");
program.version(require("./package.json").version);

program.command("start").action(() => {
  server.start();
});

program.command("compile").action(() => {
  process.env.NODE_ENV = process.env.NODE_ENV || "production";

  // FIXME
  const webpackConfig = require("./client/webpack.config");
  const Webpack = require("webpack");
  const compiler = Webpack(webpackConfig);
  compiler.run(() => {
    console.log("done!");
  });
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
