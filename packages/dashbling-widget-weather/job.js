const fetch = require("node-fetch");

const climacon = iconCode => {
  switch (iconCode) {
    case "01d":
      return "sun";
    case "02d":
      return "cloud sun";
    case "03d":
    case "03n":
    case "04d":
      return "cloud";
    case "09d":
    case "10d":
    case "10d":
      return "rain";
    case "11d":
    case "11n":
      return "lightning";
    case "13d":
    case "13n":
      return "snow";
    case "50d":
    case "50n":
      return "haze";
    case "01n":
      return "moon";
    case "02n":
    case "04n":
      return "cloud moon";
    default:
      return null;
  }
};

const unitSign = unit => {
  switch (unit) {
    case "metric":
      return "°C";
    case "imperial":
      return "°F";
    default:
      return "K";
  }
};

module.exports = (
  eventId,
  appId,
  cityId,
  unit = "metric"
) => async sendEvent => {
  if (!appId) {
    console.warn(
      "No OpenWeatherMap APP_ID provided, register at https://openweathermap.org/appid"
    );
    return;
  }

  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&APPID=${appId}&units=${unit}`
  );
  const json = await response.json();

  const eventData = {
    temp: Math.round(json.main.temp),
    unit: unitSign(unit),
    text: json.weather[0].main,
    climacon: climacon(json.weather[0].icon),
    url: `https://openweathermap.org/city/${cityId}`
  };

  sendEvent(eventId, eventData);
};
