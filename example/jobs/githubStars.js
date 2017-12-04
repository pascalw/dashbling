const fetch = require("node-fetch");

module.exports = (repo, eventId) =>
  async function gitHubStars(sendEvent) {
    const response = await fetch(`https://api.github.com/repos/${repo}`);
    const json = await response.json();

    sendEvent(eventId, json);
  };
