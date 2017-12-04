const Webpack = require("webpack");

const buildCompiler = projectPath => {
  const webpackConfig = require("../client/webpack.config")(projectPath);
  return Webpack(webpackConfig);
};

module.exports.compile = projectPath => {
  buildCompiler(projectPath).run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(stats.toString({ colors: true }));
  });
};

module.exports.devMiddlewares = projectPath => {
  const compiler = buildCompiler(projectPath);

  const devMiddleware = require("webpack-dev-middleware")(compiler);
  const hotMiddleware = require("webpack-hot-middleware")(compiler);

  return [devMiddleware, hotMiddleware];
};
