# Dashbling weather widget

This is a widget for Dashbling, displaying local Weather information.

Weather information is provided by [OpenWeatherMap](https://openweathermap.org/).
This widget requires a (free) OpenWeatherMap API key. Register at https://openweathermap.org/appid.

## Usage

Add to your project:

```sh
yarn add dashbling-widget-weather
```

Add a job to fetch weather data:

```js
// dashbling.config.js
module.exports = {
    jobs: [
        {
            schedule: "*/30 * * * *",
            fn: require("dashbling-widget-weather/job")(
                "weather-amsterdam", // event id
                "YOUR OPENWEATHERMAP APPID HERE",
                "2759794" // city id
            )
        }
    ]
}
```

And add the widget to your dashboard:

```js
import { WeatherWidget } from "dashbling-widget-weather";
const WeatherInAmsterdam = connect("weather-amsterdam")(WeatherWidget);

export default props => {
  return (
    <Dashboard>
      <WeatherInAmsterdam title="Amsterdam" />
    </Dashboard>
  );
};
```
