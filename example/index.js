import * as dashbling from "dashbling/client";
import "./styles/main.scss";

const Dashboard = require("./dashboards/Dashboard").default;
const root = document.getElementById("root");

dashbling.start();
dashbling.render(root, Dashboard);

if (module.hot) {
  module.hot.accept();
}
