const { ensureDirSync, readJsonSync, writeJsonSync } = require("fs-extra");
const { resolve, dirname } = require("path");
const { sync: commandExistsSync } = require("command-exists");
const Generator = require("yeoman-generator");

const supportsGit = commandExistsSync("git");
const supportsYarn = commandExistsSync("yarnpkg");
const installer = supportsYarn ? "yarn" : "npm";
const dashblingCorePackage =
  process.env.DASHBLING_CORE_PACKAGE || "@dashbling/core";
const dashblingBuildSupportPackage =
  process.env.DASHBLING_BUILD_SUPPORT_PACKAGE || "@dashbling/build-support";
const dashblingClientPackage =
  process.env.DASHBLING_CLIENT_PACKAGE || "@dashbling/client";

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.installDependency = supportsYarn ? this.yarnInstall : this.npmInstall;
    this.devDependencyOption = supportsYarn
      ? { dev: true }
      : { "save-dev": true };
  }

  paths() {
    this.destinationRoot(this.options.directory);
  }

  _copy(path) {
    this.fs.copy(this.templatePath(path), this.destinationPath(path));
  }

  writing() {
    ensureDirSync(this.destinationPath());

    this.spawnCommandSync(installer, ["init", "--yes"]);
    this.installDependency([dashblingCorePackage, dashblingClientPackage], {
      silent: true
    });
    this.installDependency([dashblingBuildSupportPackage], {
      ...this.devDependencyOption,
      silent: true
    });

    const jsonPath = this.destinationPath("package.json");
    const json = readJsonSync(jsonPath);
    const packageJson = Object.assign(json, {
      scripts: {
        start: "dashbling start",
        build: "dashbling compile",
        dev: "NODE_ENV=development dashbling start"
      },
      browserslist: "last 2 versions"
    });

    writeJsonSync(jsonPath, packageJson, { spaces: 2 });

    [
      "dashbling.config.js",
      "index.html",
      "index.js",
      "Dashboard.js",
      "widgets/",
      "styles/",
      "jobs/",
      ".gitignore"
    ].forEach(this._copy.bind(this));
  }

  end() {
    if (supportsGit) {
      this.spawnCommandSync("git", ["init", "--quiet"]);
      this.spawnCommandSync("git", ["add", "--all"]);
      this.spawnCommandSync("git", [
        "commit",
        "-m",
        "Initial commit - new dashbling project.",
        "--quiet"
      ]);
    }
  }
};
