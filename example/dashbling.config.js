const { createFileHistory } = require("@dashbling/core/history");
const eventHistoryPath = require("path").join(
  process.cwd(),
  "dashbling-events"
);

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
  configureServer: hapiServer => {
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

    // Be sure to return a Promise, so the initialization process
    // waits for this configuration to be completed.
    return Promise.resolve();
  },
  eventHistory: createFileHistory(eventHistoryPath),
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
      fn: require("dashbling-widget-weather/job")("weather-amsterdam", "727232")
    }
  ]
};
