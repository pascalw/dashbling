module.exports.jobs = [
  {
    schedule: "*/5 * * * *",
    fn: require("./jobs/githubStars")(
      "pascalw/dashbling",
      "github-stars-dashbling"
    )
  }
];
