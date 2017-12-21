import * as path from "path";
import { ClientConfig } from "../lib/clientConfig";

module.exports.install = async (server: any, clientConfig: ClientConfig) => {
  await server.register(require("inert"));

  server.route({
    method: "GET",
    path: "/{param*}",
    handler: {
      directory: {
        path: path.join(clientConfig.projectPath, "dist/")
      }
    }
  });
};
