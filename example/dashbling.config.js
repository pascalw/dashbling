const { createFileHistory } = require("@dashbling/core/history");
const {
  createHistory: createMongoHistory
} = require("@dashbling/mongodb-history");
const eventHistoryPath = require("path").join(
  process.cwd(),
  "dashbling-events"
);

const history = () => {
  if (process.env.MONGODB_URI) {
    console.log("Using MongoDB history storage.");
    return createMongoHistory(process.env.MONGODB_URI);
  } else {
    console.log("Using filesystem history storage.");
    return createFileHistory(eventHistoryPath);
  }
};

module.exports = {
  webpackConfig: config => {
    // return modified config
    // or even completely custom config.
    //
    // Example:
    // config.module.rules.push({
    //   test: /\.jpg$/,
    //   loader: "file-loader"
    // });
    return config;
  },
  onStart: sendEvent => {
    // start custom code that sends events here,
    // for example listen to streams etc.
  },
  configureServer: async hapiServer => {
    // Configure the Hapi server here.
    // See https://hapijs.com/api/17.1.1 docs for details.
    // This is only needed for more advanced use cases.
    hapiServer.route({
      method: "GET",
      path: "/ping",
      handler: (_request, _h) => {
        return "pong";
      }
    });
  },
  eventHistory: history(),
  forceHttps: false,
  jobs: [
    {
      schedule: "*/5 * * * *",
      fn: require("./jobs/githubStars")(
        "pascalw/dashbling",
        "github-stars-dashbling"
      )
    },
    {
      schedule: "*/5 * * * *",
      fn: require("./jobs/circleBuildStatus")(
        "github/pascalw/dashbling",
        "dashbling-ci-status"
      )
    },
    {
      schedule: "*/30 * * * *",
      fn: require("dashbling-widget-weather/job")(
        "weather-amsterdam",
        process.env.OPEN_WEATHER_MAP_APP_ID,
        "2759794"
      )
    }
  ]
};
