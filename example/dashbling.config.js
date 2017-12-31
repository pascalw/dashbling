module.exports = {
  webpackConfig: config => {
    console.log(config);
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
