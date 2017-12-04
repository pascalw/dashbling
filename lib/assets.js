const Webpack = require("webpack");

const buildCompiler = () => {
  const webpackConfig = require("../client/webpack.config");
  return Webpack(webpackConfig);
};

module.exports.compile = () => {
  buildCompiler().run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log(stats.toString({ colors: true }));
  });
};

module.exports.devMiddlewares = () => {
  const compiler = buildCompiler();

  const devMiddleware = require("webpack-dev-middleware")(compiler);
  const hotMiddleware = require("webpack-hot-middleware")(compiler);

  return [devMiddleware, hotMiddleware];
};
