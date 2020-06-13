import React, { useState, useEffect } from "react";
import Big from "../Big/Big";
import List from "../List/List";
import "./Playlists.scss";

function Playlists() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8080/spotify/playlists", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result.data);
        setSelectedItem(result.data[0]);
      });
  }, []);

  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="content-container">
      <Big item={selectedItem} />
      <List data={data} selectItem={setSelectedItem} />
    </div>
  );
}

export default Playlists;
