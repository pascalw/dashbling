const fetch = require("node-fetch");

module.exports = eventId => async sendEvent => {
  const response = await fetch("https://httpbin.org/get");
  const json = await response.json();

  sendEvent(eventId, {
    ipAddress: json.origin
  });
};
