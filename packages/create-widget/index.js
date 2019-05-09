const { ensureDirSync, readJsonSync, writeJsonSync } = require("fs-extra");
const { resolve, dirname } = require("path");
const { sync: commandExistsSync } = require("command-exists");
const Generator = require("yeoman-generator");

const supportsGit = commandExistsSync("git");
const supportsYarn = commandExistsSync("yarnpkg");
const installer = supportsYarn ? "yarn" : "npm";
const dashblingClientPackage = process.env.DASHBLING_CLIENT_PACKAGE || "^0";

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.installDependencies = supportsYarn
      ? this.yarnInstall
      : this.npmInstall;
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

    const jsonPath = this.destinationPath("package.json");
    const json = readJsonSync(jsonPath);
    const packageJson = Object.assign(json, {
      main: "MyWidget.js",
      dependencies: {
        "node-fetch": "^2.5.0"
      },
      devDependencies: {
        "@dashbling/client": dashblingClientPackage
      },
      peerDependencies: {
        "@dashbling/client": dashblingClientPackage
      }
    });

    writeJsonSync(jsonPath, packageJson, { spaces: 2 });

    ["job.js", "MyWidget.js", "styles.css"].forEach(this._copy.bind(this));

    this.fs.copy(
      this.templatePath("gitignore"),
      this.destinationPath(".gitignore")
    );

    this.fs.copyTpl(
      this.templatePath("README.md"),
      this.destinationPath("README.md"),
      { name: this.options.name }
    );

    this.installDependencies();
  }

  end() {
    if (supportsGit) {
      this.spawnCommandSync("git", ["init", "--quiet"]);
      this.spawnCommandSync("git", ["add", "--all"]);
      this.spawnCommandSync("git", [
        "commit",
        "-m",
        "Initial commit - new dashbling widget.",
        "--quiet"
      ]);
    }
  }
};
