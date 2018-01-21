import React from "react";
import { Widget, SmallLabel, MediumLabel } from "@dashbling/client/Widget";

import styles from "./styles.css";

export const MyWidget = props => {
  const { ipAddress, ...restProps } = props;

  return (
    <Widget className={styles.widget} {...restProps}>
      <MediumLabel>Your IP:</MediumLabel>
      <SmallLabel>{ipAddress || "--"}</SmallLabel>
    </Widget>
  );
};
