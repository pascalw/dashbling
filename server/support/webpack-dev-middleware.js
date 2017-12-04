const assets = require("../../lib/assets");

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

module.exports.install = (server, projectPath) => {
  assets.devMiddlewares(projectPath).forEach(middleware => {
    addMiddleware(server, middleware);
  });
};
