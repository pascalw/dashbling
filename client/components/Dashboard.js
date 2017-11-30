import React from "react";
import styles from "./Dashboard.scss";
// import LastUpdatedAt from "../widgets/LastUpdatedAt";
import DashblingConnected from "../widgets/DashblingConnected";

export default function(props) {
  return <div className={styles.dashboard}>{props.children}</div>;
}

export function MetaContainer(props) {
  return (
    <div className={styles.meta}>
      <DashblingConnected />
      {/* <LastUpdatedAt /> */}
    </div>
  );
}
