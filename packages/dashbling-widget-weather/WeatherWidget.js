import React from "react";
import { Widget, SmallLabel, MediumLabel } from "@dashbling/client/Widget";
import { Climacon } from "./Climacon";

import styles from "./styles.css";

const YahooAttribution = ({ url }) => {
  return (
    <a href={url} target="_blank">
      <img className={styles.yahooLogo} src={require("./yahoo.png")} />
    </a>
  );
};

const formatTemp = (temp, unit) => {
  return (temp && `${temp} °${unit}`) || "--";
};

export const WeatherWidget = props => {
  const { title, temp, unit, climacon, text, url, ...restProps } = props;

  return (
    <Widget className={styles.widget} {...restProps} href={url}>
      <MediumLabel>{title}</MediumLabel>

      <div className={styles.inner}>
        <Climacon id={climacon} style={{ margin: "auto" }} />
        <MediumLabel style={{ marginBottom: "0.2em" }}>
          {formatTemp(temp, unit)}
        </MediumLabel>
        <SmallLabel>{text}</SmallLabel>
      </div>

      <YahooAttribution url={url} />
    </Widget>
  );
};
