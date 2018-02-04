const spawn = require("cross-spawn");
const path = require("path");

const packageRoot = package => {
  return path.join(__dirname, "..", "packages", package);
};

const packagePath = package => {
  const { version } = require(path.join(packageRoot(package), "package.json"));
  return (
    "file:" +
    path.join(packageRoot(package), `dashbling-${package}-${version}.tgz`)
  );
};

const env = {
  ...process.env,
  DASHBLING_CORE_PACKAGE: packagePath("core"),
  DASHBLING_BUILD_SUPPORT_PACKAGE: packagePath("build-support"),
  DASHBLING_CLIENT_PACKAGE: packagePath("client")
};

spawn.sync("yarn", ["lerna", "exec", "npm", "pack"], {
  stdio: "inherit",
  cwd: path.join(__dirname, "..")
});

spawn.sync("yarn", ["test:e2e"], {
  stdio: "inherit",
  env,
  cwd: packageRoot("create-dashbling-app")
});
