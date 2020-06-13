import React from "react";
import "./List.scss";
import { Container, Row } from "react-bootstrap";

function List() {
  let data = Array(20).fill("lorem ipsum dolor");
  console.log(data);
  return (
    <div className="list">
      <Container fluid>
        {data.map((item, index) => {
          return (
            <Row key={index}>
              <div className="list-item">{item}</div>
            </Row>
          );
        })}
      </Container>
    </div>
  );
}

export default List;
