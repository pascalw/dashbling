import React from "react";
import { connect } from "react-redux";
import format from "date-fns/format";

function formatDate(date) {
  if (!date) return "never";

  return format(date, "ddd MMM DD YYYY HH:mm");
}

const LastUpdatedAt = function(props) {
  return (
    <div style={{ color: "#fff", width: "100%", textAlign: "center" }}>
      Last updated: {formatDate(props.lastUpdatedAt)}
    </div>
  );
};

export default connect(state => {
  return { lastUpdatedAt: state.lastUpdatedAt };
})(LastUpdatedAt);
