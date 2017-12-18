import * as dashbling from "@dashbling/core/client";
import "./styles/main.scss";

import Dashboard from "./Dashboard";
dashbling.start(document.getElementById("root"), Dashboard);

if (module.hot) {
  module.hot.accept();
}
