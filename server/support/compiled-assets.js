const path = require("path");

module.exports.install = async server => {
  await server.register(require("inert"));

  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: path.join(process.cwd(), "dist/")
      }
    }
  });
};
