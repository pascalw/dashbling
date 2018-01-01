const Webpack = require("webpack");
import { ClientConfig } from "@dashbling/core/src/lib/clientConfig";

const buildCompiler = (clientConfig: ClientConfig, webpack: any) => {
  const baseConfig = require("./webpack.config")(clientConfig.projectPath);

  let processedConfig = Object.assign({}, baseConfig);
  processedConfig = clientConfig.webpackConfig(processedConfig);

  return webpack(processedConfig);
};

export const compile = (clientConfig: ClientConfig, webpack: any = Webpack) => {
  return new Promise((resolve, reject) => {
    buildCompiler(clientConfig, webpack).run((err: Error, stats: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats);
      }
    });
  });
};

export const devMiddlewares = (
  clientConfig: ClientConfig,
  webpack: any = Webpack
) => {
  const compiler = buildCompiler(clientConfig, webpack);

  const devMiddleware = require("webpack-dev-middleware")(compiler);
  const hotMiddleware = require("webpack-hot-middleware")(compiler);

  return [devMiddleware, hotMiddleware];
};
