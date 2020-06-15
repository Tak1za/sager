import React, { useState, useEffect } from "react";
import Big from "../Big/Big";
import List from "../List/List";
import "./Playlists.scss";

function Playlists() {
  const [data, setData] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      fetch("http://localhost:8080/spotify/playlists", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
        .then((res) => {
          if (res.status === 401) {
            window.location.assign("http://localhost:8080/spotify/login");
          } else {
            return res.json();
          }
        })
        .then((result) => {
          setData(result.data);
          setSelectedItem(result.data ? result.data[0] : null);
        })
        .catch((err) => console.error(err));
    } else {
      window.location.assign("http://localhost:8080/spotify/login");
    }
  }, []);

  const [playlist, setPlaylist] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("accessToken") && playlist !== null) {
      fetch(`http://localhost:8080/spotify/tracks/playlists/${playlist.id}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
        .then((res) => {
          if (res.status === 401) {
            window.location.assign("http://localhost:8080/spotify/login");
          } else {
            return res.json();
          }
        })
        .then((result) => {
          console.log(result);
        })
        .catch((err) => console.error(err));
    }
  }, [playlist]);

  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="content-container">
      <Big item={selectedItem} />
      <List
        data={data}
        selectItem={setSelectedItem}
        selectPlaylist={setPlaylist}
      />
    </div>
  );
}

export default Playlists;
