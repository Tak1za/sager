import React from "react";
import "./List.scss";
import { Container } from "react-bootstrap";
import ListItem from "../ListItem/ListItem";

function List(props) {
  return (
    <div className="list">
      <Container fluid>
        {props.data && props.data.length !== 0
          ? props.data.map((item, index) => {
              return (
                <ListItem
                  key={index}
                  item={item}
                  selectItem={props.selectItem}
                />
              );
            })
          : null}
      </Container>
    </div>
  );
}

export default List;
