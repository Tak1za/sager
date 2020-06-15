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

  const [selectedTrack, setSelectedTrack] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [isPlaylistSelected, setIsPlaylistSelected] = useState(false);
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
          setPlaylistTracks(result.data);
          setIsPlaylistSelected(true);
        })
        .catch((err) => console.error(err));
    }
  }, [playlist]);

  const [selectedItem, setSelectedItem] = useState(null);
  return (
    <div className="content-container">
      {isPlaylistSelected ? (
        <Big item={selectedTrack} isPlaylistSelected={isPlaylistSelected} />
      ) : (
        <Big item={selectedItem} isPlaylistSelected={isPlaylistSelected} />
      )}
      <List
        data={data}
        selectItem={setSelectedItem}
        selectPlaylist={setPlaylist}
        trackData={playlistTracks}
        isPlaylistSelected={isPlaylistSelected}
        selectTrack={setSelectedTrack}
      />
    </div>
  );
}

export default Playlists;
