const fetch = require("node-fetch");

const climacon = code => {
  switch (true) {
    case code > 0 && code <= 3:
      return "tornado";
    case code == 3 ||
      code == 4 ||
      code == 37 ||
      code == 38 ||
      code == 39 ||
      code == 45 ||
      code == 47:
      return "lightning";
    case code == 5 ||
      code == 7 ||
      (code >= 13 && code <= 16) ||
      (code >= 41 && code <= 43) ||
      code == 46:
      return "snow";
    case code == 6 || code == 8 || code == 9 || code == 10 || code == 18:
      return "sleet";
    case code == 11 || code == 12 || code == 40:
      return "rain";
    case code == 17 || code == 35:
      return "hail";
    case code == 19 || code == 21 || code == 22:
      return "haze";
    case code == 20:
      return "fog";
    case code == 23 || code == 24:
      return "wind";
    case code == 25:
      return "thermometer low";
    case code == 26 || code == 44:
      return "cloud";
    case code == 27 || code == 29:
      return "cloud moon";
    case code == 28 || code == 30:
      return "cloud sun";
    case code == 31 || code == 33:
      return "moon";
    case code == 32 || code == 34:
      return "sun";
    case code == 36:
      return "thermometer full";
    default:
      return null;
  }
};

module.exports = (eventId, locationId, unit = "c") => async sendEvent => {
  const response = await fetch(
    `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20%3D%20${locationId}%20and%20u%20%3D%20'${unit}'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`
  );
  const json = await response.json();

  const url = json.query.results.channel.item.link.split("*")[1];
  const condition = json.query.results.channel.item.condition;
  const units = json.query.results.channel.units;

  const eventData = {
    temp: condition.temp,
    unit: units.temperature,
    text: condition.text,
    climacon: climacon(condition.code),
    url: url
  };

  sendEvent(eventId, eventData);
};
