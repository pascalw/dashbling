import { ClientConfig } from "./clientConfig";

const Webpack = require("webpack");

const buildCompiler = (projectPath: string) => {
  const webpackConfig = require("../../client/webpack.config")(projectPath);
  return Webpack(webpackConfig);
};

export const compile = (projectPath: string) => {
  return new Promise((resolve, reject) => {
    buildCompiler(projectPath).run((err: Error, stats: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
};

export const devMiddlewares = (clientConfig: ClientConfig) => {
  const compiler = buildCompiler(clientConfig.projectPath);

  const devMiddleware = require("webpack-dev-middleware")(compiler);
  const hotMiddleware = require("webpack-hot-middleware")(compiler);

  return [devMiddleware, hotMiddleware];
};
