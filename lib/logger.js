const tracer = require("tracer");
const defaultLevel = process.env.LOG_LEVEL || "info";

module.exports = tracer.colorConsole({
  level: defaultLevel,
  format: "{{timestamp}} [{{title}}] {{message}}"
});

module.exports.setLevel = level => {
  tracer.setLevel(level);
};

module.exports.defaultLevel = defaultLevel;
