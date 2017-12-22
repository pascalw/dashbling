module.exports = {
  onStart: sendEvent => {
    // start custom code that sends events here,
    // for example listen to streams etc.
  },
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
