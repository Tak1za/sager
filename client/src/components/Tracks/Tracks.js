import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import TrackItem from "../TrackItem/TrackItem";
import "./Tracks.scss";
import { Spinner, Table } from "react-bootstrap";

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
          <Table responsive>
            <thead>
              <tr>
                <th>Select</th>
                <th>Track</th>
                <th>Duration</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {playlistTracks.map((track) => (
                <TrackItem item={track} key={track.track.id} />
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default withRouter(Tracks);
