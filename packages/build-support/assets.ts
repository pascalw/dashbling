const Webpack = require("webpack");
import { ClientConfig } from "@dashbling/core/src/lib/clientConfig";

const buildCompiler = (clientConfig: ClientConfig) => {
  const webpackConfig = require("./webpack.config")(clientConfig.projectPath);
  return Webpack(webpackConfig);
};

export const compile = (clientConfig: ClientConfig) => {
  return new Promise((resolve, reject) => {
    buildCompiler(clientConfig).run((err: Error, stats: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
};

export const devMiddlewares = (clientConfig: ClientConfig) => {
  const compiler = buildCompiler(clientConfig);

  const devMiddleware = require("webpack-dev-middleware")(compiler);
  const hotMiddleware = require("webpack-hot-middleware")(compiler);

  return [devMiddleware, hotMiddleware];
};
