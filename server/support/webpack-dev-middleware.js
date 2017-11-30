const Webpack = require("webpack");

const addMiddleware = (server, middleware) => {
  server.ext("onRequest", (request, h) => {
    const req = request.raw.req;
    const res = request.raw.res;

    return new Promise((resolve, reject) => {
      middleware(req, res, err => {
        if (err) {
          return reject(err);
        }

        resolve(h.continue);
      });
    });
  });
};

module.exports.install = (server, webpackConfig) => {
  const compiler = Webpack(webpackConfig);
  const devMiddleware = require("webpack-dev-middleware")(compiler);
  const hotMiddleware = require("webpack-hot-middleware")(compiler);

  addMiddleware(server, devMiddleware);
  addMiddleware(server, hotMiddleware);
};
