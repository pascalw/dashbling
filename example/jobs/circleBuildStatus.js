const fetch = require("node-fetch");

module.exports = (repo, eventId) =>
  async function circleBuildStatus(sendEvent) {
    try {
      const headers = { Accept: "application/json" };
      const response = await fetch(
        `https://circleci.com/api/v1.1/project/${repo}?filter=completed&limit=1`,
        { headers: headers }
      );
      const json = await response.json();
      const buildStatus = json[0];

      const event = {
        repo: buildStatus.reponame,
        outcome: buildStatus.outcome,
        buildUrl: buildStatus.build_url
      };

      sendEvent(eventId, event);
    } catch (e) {
      console.warn(`Failed to fetch Circle CI build status for ${repo}`, e);
    }
  };
