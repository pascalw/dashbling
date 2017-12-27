const Webpack = require("webpack");

const buildCompiler = (projectPath: string) => {
  const webpackConfig = require("./webpack.config")(projectPath);
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

export const devMiddlewares = (projectPath: string) => {
  const compiler = buildCompiler(projectPath);

  const devMiddleware = require("webpack-dev-middleware")(compiler);
  const hotMiddleware = require("webpack-hot-middleware")(compiler);

  return [devMiddleware, hotMiddleware];
};
