import * as path from "path";
import { ClientConfig } from "../lib/clientConfig";

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
