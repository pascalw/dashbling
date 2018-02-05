const fs = require("fs-extra");
const path = require("path");

const templatesDir = path.join(__dirname, "..", "templates");
fs.removeSync(templatesDir);
fs.mkdirSync(templatesDir);

const filter = (src, dest) => {
  return !(
    src.match(/node_modules/) ||
    src.match(/package.json/) ||
    src.match(/yarn.lock/)
  );
};

fs.copySync(path.join(__dirname, "..", "..", "..", "example"), templatesDir, {
  filter
});
fs.renameSync(
  path.join(templatesDir, ".gitignore"),
  path.join(templatesDir, "gitignore")
);
