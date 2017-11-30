import React from "react";
import styles from "./WidgetContainer.scss";

export default function(props) {
  return <div className={styles.container}>{props.children}</div>;
}
