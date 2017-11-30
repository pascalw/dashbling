import React from "react";

import { connect } from "dashbling/client/dashbling";
import WidgetContainer from "dashbling/client/components/WidgetContainer";
import Dashboard, {
  MetaContainer
} from "dashbling/client/components/Dashboard";
import Clock from "dashbling/client/widgets/Clock";
import Image from "dashbling/client/widgets/Image";
import Counter from "../widgets/Counter";
import { GitHubStars } from "../widgets/GitHubStars";

const DashblingGitHubStars = connect("github-stars-dashbling")(GitHubStars);

export default props => {
  return (
    <Dashboard>
      <WidgetContainer>
        <Clock
          tzdata={require("timezone/Europe/Amsterdam")}
          timezone="Europe/Amsterdam"
          backgroundColor="#00865A"
        />
        <Counter />
        <DashblingGitHubStars />
      </WidgetContainer>

      <MetaContainer />
    </Dashboard>
  );
};
