import { projectPath } from "../lib/project";

const path = require("path");

module.exports.install = async (server, projectPath) => {
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
