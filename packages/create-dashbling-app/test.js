const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const spawn = require("cross-spawn");

const packagePath = () => {
  const { version } = require(path.join(__dirname, "package.json"));
  return path.join(__dirname, `dashbling-create-dashboard-${version}.tgz`);
};

const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "dashbling-tests"));
let failed = false;

try {
  spawn.sync("npm", ["pack"], { stdio: "inherit" });
  spawn.sync("yarn", ["add", "file:" + packagePath()], {
    cwd: tmpDir,
    stdio: "inherit"
  });
  spawn.sync(
    path.join(".", "node_modules", ".bin", "create-dashboard"),
    ["."],
    { cwd: tmpDir, stdio: "inherit" }
  );
  spawn.sync("yarn", ["build"], { cwd: tmpDir, stdio: "inherit" });
} catch (e) {
  failed = true;
}

fs.removeSync(tmpDir);
fs.removeSync(packagePath());

if (failed) {
  process.exit(1);
}
