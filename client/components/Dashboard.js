import React from "react";
import styles from "./Dashboard.scss";
import LastUpdatedAt from "../widgets/LastUpdatedAt";
import DashblingConnected from "../widgets/DashblingConnected";

const MetaContainer = props => {
  return (
    <div className={styles.meta}>
      <DashblingConnected />
      <LastUpdatedAt />
    </div>
  );
};

const WidgetContainer = props => {
  return <div className={styles.container}>{props.children}</div>;
};

export const Dashboard = props => {
  return (
    <div className={styles.dashboard}>
      <WidgetContainer>{props.children}</WidgetContainer>

      <MetaContainer />
    </div>
  );
};
