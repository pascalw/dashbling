import { ClientConfig } from "../lib/clientConfig";
import { Server, Request } from "@hapi/hapi";

class Credentials {
  readonly username: string;
  readonly password: string;

  constructor(basicAuth: string) {
    const parts = basicAuth.split(":");
    if (parts.length != 2) {
      throw new Error(
        `Invalid basicAuth configuration provided: '${basicAuth}'.`
      );
    }

    this.username = parts[0];
    this.password = parts[1];
  }
}

const validate = (credentials: Credentials) => async (
  _request: Request,
  username: string,
  password: string
) => {
  const isValid =
    username === credentials.username && password === credentials.password;
  return { isValid, credentials };
};

export const install = async (server: Server, clientConfig: ClientConfig) => {
  if (!clientConfig.basicAuth) return;

  const credentials = new Credentials(clientConfig.basicAuth);
  await server.register(require("@hapi/basic"));

  server.auth.strategy("simple", "basic", { validate: validate(credentials) });
  server.auth.default("simple");
};
