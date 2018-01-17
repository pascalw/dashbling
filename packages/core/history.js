module.exports = {
  createFileHistory: require("./lib/lib/FileEventHistory").createHistory,
  createInMemoryHistory: require("./lib/lib/InMemoryEventHistory").createHistory
};
