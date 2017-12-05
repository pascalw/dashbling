import React from "react";
import styles from "./widget.scss";

export default function(props) {
  const className =
    styles.widget + (props.className ? " " + props.className : "");
  return (
    <div className={className} style={props.style}>
      {props.title && <MediumLabel>{props.title}</MediumLabel>}

      <div className={styles.inner}>{props.children}</div>
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
