const { createHistory } = require("../../src/lib/InMemoryEventHistory");

module.exports = {
  jobs: [],
  eventHistory: createHistory()
};
