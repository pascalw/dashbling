const Webpack = require("webpack");

const buildCompiler = (projectPath: string) => {
  const webpackConfig = require("../../client/webpack.config")(projectPath);
  return Webpack(webpackConfig);
};

export const compile = (projectPath: string) => {
  buildCompiler(projectPath).run((err: Error, stats: any) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(stats.toString({ colors: true }));
  });
};

export const devMiddlewares = (projectPath: string) => {
  const compiler = buildCompiler(projectPath);

  const devMiddleware = require("webpack-dev-middleware")(compiler);
  const hotMiddleware = require("webpack-hot-middleware")(compiler);

  return [devMiddleware, hotMiddleware];
};
