import React from "react";
import "./List.scss";
import { Container } from "react-bootstrap";
import ListItem from '../ListItem/ListItem';

function List() {
  let data = Array(20).fill("lorem ipsum dolor");
  console.log(data);
  return (
    <div className="list">
      <Container fluid>
        {data.map((item, index) => {
          return <ListItem key={index} item={item} />;
        })}
      </Container>
    </div>
  );
}

export default List;
