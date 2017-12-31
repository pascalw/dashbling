import * as path from "path";

module.exports.install = async (server: any, projectPath: string) => {
  await server.register(require("inert"));

  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: path.join(projectPath, "dist/")
      }
    }
  });
};
