const level = process.env.LOG_LEVEL || "info";

module.exports = require("tracer").colorConsole({
  level: level,
  format: "{{timestamp}} <{{title}}> {{message}}"
});
