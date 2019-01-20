import React from "react";
import { Widget, SmallLabel, MediumLabel } from "@dashbling/client/Widget";
import { Climacon } from "./Climacon";

import styles from "./styles.css";

const formatTemp = (temp, unit) => {
  return (temp && `${temp} ${unit}`) || "--";
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

      <img className={styles.logo} src={require("./logo_OpenWeatherMap.svg")} />
    </Widget>
  );
};
