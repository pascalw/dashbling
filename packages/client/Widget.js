import React from "react";
import styles from "./Widget.scss";

const bgImage = image => {
  return (
    <div
      style={{ backgroundImage: `url(${image})` }}
      className={styles.bgImage}
    />
  );
};

export default function(props) {
  const className =
    styles.widget + (props.className ? " " + props.className : "");

  return (
    <div className={className} style={props.style}>
      {props.title && <MediumLabel>{props.title}</MediumLabel>}

      <div className={styles.inner}>{props.children}</div>
      {props.bgImage && bgImage(props.bgImage)}
    </div>
  );
}

export function SmallLabel(props) {
  return Label(props, styles.labelSmall);
}

export function MediumLabel(props) {
  return Label(props, styles.labelMedium);
}

export function LargeLabel(props) {
  return Label(props, styles.labelLarge);
}

function Label(props, className) {
  return (
    <span className={className} {...props}>
      {props.children}
    </span>
  );
}
