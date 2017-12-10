const fetch = require("node-fetch");

module.exports = (repo, eventId) =>
  async function gitHubStars(sendEvent) {
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`);
      const json = await response.json();

      sendEvent(eventId, json);
    } catch (e) {
      console.warn("Failed to fetch GitHub stars", e);
    }
  };
