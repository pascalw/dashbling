import React from "react";

import { connect } from "@dashbling/client/dashbling";
import { Dashboard } from "@dashbling/client/components/Dashboard";
import { Clock } from "@dashbling/client/widgets/Clock";
import { Counter } from "./widgets/Counter";
import { GitHubStars } from "./widgets/gitHubStars/GitHubStars";
import { CircleCiStatus } from "./widgets/circleCi/CircleCiStatus";

const DashblingGitHubStars = connect("github-stars-dashbling")(GitHubStars);
const DashblingCiStatus = connect("dashbling-ci-status")(CircleCiStatus);

export default props => {
  return (
    <Dashboard>
      <Clock
        tzdata={require("timezone/Europe/Amsterdam")}
        timezone="Europe/Amsterdam"
        backgroundColor="#00865A"
      />
      <Counter />

      <DashblingGitHubStars />
      <DashblingCiStatus />
    </Dashboard>
  );
};
