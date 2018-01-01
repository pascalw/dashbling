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
    }
  ]
};
