import React from "react";
import "./List.scss";
import Container from "react-bootstrap/Container";
import ListItem from "../ListItem/ListItem";
import Fade from "react-reveal/Fade";
import TrackItem from "../TrackItem/TrackItem";

function List(props) {
  return (
    <div className="list">
      {!props.isPlaylistSelected ? (
        <Container fluid>
          {props.data && props.data.length !== 0
            ? props.data.map((item, index) => {
                return (
                  <Fade big key={index}>
                    <ListItem
                      item={item}
                      selectItem={props.selectItem}
                      selectPlaylist={props.selectPlaylist}
                    />
                  </Fade>
                );
              })
            : null}
        </Container>
      ) : (
        <Container fluid>
          {props.trackData && props.trackData.length !== 0
            ? props.trackData.map((item) => {
                return (
                  <Fade big key={item.track.id}>
                    <TrackItem
                      item={item}
                      selectTrack={props.selectTrack}
                    />
                  </Fade>
                );
              })
            : null}
        </Container>
      )}
    </div>
  );
}

export default List;
