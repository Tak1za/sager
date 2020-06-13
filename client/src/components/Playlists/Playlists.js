import React from "react";
import Big from "../Big/Big";
import List from "../List/List";
import './Playlists.scss';

function Playlists() {
  return (
    <div className="content-container">
      <Big />
      <List />
    </div>
  );
}

export default Playlists;
