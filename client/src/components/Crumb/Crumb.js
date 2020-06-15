import React from "react";
import Breadcrumb from "react-bootstrap/Breadcrumb";

function Crumb() {
  return (
    <Breadcrumb style={{ backgroundColor: "white" }}>
      <Breadcrumb.Item>Playlists</Breadcrumb.Item>
      <Breadcrumb.Item>Tracks</Breadcrumb.Item>
    </Breadcrumb>
  );
}

export default Crumb;
