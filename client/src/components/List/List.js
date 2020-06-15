import React from "react";
import "./List.scss";
import Container from "react-bootstrap/Container";
import ListItem from "../ListItem/ListItem";
import Fade from "react-reveal/Fade";

function List(props) {
  return (
    <div className="list">
      <Container fluid>
        {props.data && props.data.length !== 0
          ? props.data.map((item, index) => {
              return (
                <Fade big key={index}>
                  <ListItem item={item} selectItem={props.selectItem} selectPlaylist={props.selectPlaylist} />
                </Fade>
              );
            })
          : null}
      </Container>
    </div>
  );
}

export default List;
