import * as assets from "../assets";
import * as path from "path";
import {
  ClientConfig,
  load as loadConfig
} from "@dashbling/core/src/lib/clientConfig";

const projectPath = path.join(__dirname, "fixture");

test("resolves with webpack stats if compilation succeeds", () => {
  const stats = {};
  const webpackMock = jest.fn(() => {
    return {
      run: (callback: (error: Error, stats: any) => void) => {
        callback(null!, stats);
      }
    };
  });

  const config: ClientConfig = loadConfig(projectPath);

  const promise = assets.compile(config, webpackMock);
  return expect(promise).resolves.toEqual(stats);
});

test("rejects promise if compilation fails", () => {
  const webpackMock = jest.fn(() => {
    return {
      run: (callback: (error: Error, stats: any) => void) => {
        callback(new Error("Compilation failed"), {});
      }
    };
  });

  const config: ClientConfig = loadConfig(projectPath);

  const promise = assets.compile(config, webpackMock);
  return expect(promise).rejects.toEqual(new Error("Compilation failed"));
});

test("passes webpack config to client configuration", () => {
  const webpackMock = jest.fn(() => {
    return {
      run: () => {}
    };
  });

  const config: ClientConfig = loadConfig(projectPath);
  let modifiedConfig = {};

  (config as any).webpackConfig = (baseConfig: any) => {
    expect(baseConfig).toHaveProperty("entry");
    return modifiedConfig;
  };

  assets.compile(config, webpackMock);
  expect(webpackMock).toBeCalledWith(modifiedConfig);
});
