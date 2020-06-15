import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import TrackItem from "../TrackItem/TrackItem";
import "./Tracks.scss";
import Fade from "react-reveal/Fade";
import { Spinner } from "react-bootstrap";

function Tracks(props) {
  const { match } = props;
  const [loading, setLoading] = useState(true);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      fetch(
        `http://localhost:8080/spotify/tracks/playlists/${match.params.playlistId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("accessToken"),
          },
        }
      )
        .then((res) => {
          if (res.status === 401) {
            window.location.assign("http://localhost:8080/spotify/login");
          } else {
            return res.json();
          }
        })
        .then((result) => {
          setLoading(false);
          setPlaylistTracks(result.data);
        })
        .catch((err) => console.error(err));
    } else {
      window.location.assign("http://localhost:8080/spotify/login");
    }
  }, [match.params.playlistId, props]);

  return (
    <div className="content-container">
      <div className="track-list">
        {loading ? (
          <Spinner animation="grow" className="loader" />
        ) : (
          playlistTracks.map((track) => (
            <Fade big key={track.track.id}>
              <TrackItem item={track} />
            </Fade>
          ))
        )}
      </div>
    </div>
  );
}

export default withRouter(Tracks);
