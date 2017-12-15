import React from "react";
import Widget, { LargeLabel, MediumLabel } from "dashbling/client/Widget";
import styles from "./circleCi.scss";

const className = props => {
  return props.outcome === "success" ? styles.success : styles.failed;
};

export const CircleCiStatus = props => {
  return (
    <Widget className={className(props)}>
      <LargeLabel>{props.repo}</LargeLabel>
      <MediumLabel>{props.outcome}</MediumLabel>
    </Widget>
  );
};
