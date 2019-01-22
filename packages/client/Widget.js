import React from "react";
import PropTypes from "prop-types";
import styles from "./Widget.scss";

const bgImage = image => {
  return (
    <div
      style={{ backgroundImage: `url(${image})` }}
      className={styles.bgImage}
    />
  );
};

export const Widget = (props, context) => {
  const className = `${styles.widget} ${context.layout.widget}${
    props.className ? " " + props.className : ""
  }`;

  let children = props.title ? (
    <React.Fragment>
      <MediumLabel>{props.title}</MediumLabel>
      <div className={styles.inner}>{props.children}</div>
    </React.Fragment>
  ) : (
    props.children
  );

  if (props.href) {
    children = (
      <a href={props.href} className={styles.link} target="_blank">
        {children}
      </a>
    );
  }

  return (
    <div className={className} style={props.style}>
      {children}

      {props.bgImage && bgImage(props.bgImage)}
    </div>
  );
};
Widget.contextTypes = { layout: PropTypes.object };

export const SmallLabel = props => {
  return Label(props, styles.labelSmall);
};

export const MediumLabel = props => {
  return Label(props, styles.labelMedium);
};

export const LargeLabel = props => {
  return Label(props, styles.labelLarge);
};

export const Label = (props, className) => {
  return (
    <span className={className} {...props}>
      {props.children}
    </span>
  );
};
