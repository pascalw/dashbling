import React from "react";
import { connect } from "react-redux";
import styles from "./DashblingConnected.scss";

const DashblingConnected = function(props) {
  if (props.connected == null || props.connected) return null;

  return (
    <div style={{ color: "#fff", textAlign: "center", margin: "2em" }}>
      <span className={styles.connectionLost}>Connection lost</span>
    </div>
  );
};

export default connect(function(state) {
  return { connected: state.connected };
})(DashblingConnected);
