# Dashbling weather widget

This is a widget for Dashbling, displaying local Weather information.

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
                "weather-amsterdam",
                "727232"
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