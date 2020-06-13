import React from "react";
import "./List.scss";
import { Container, Media } from "react-bootstrap";

function List() {
  let data = Array(20).fill("lorem ipsum dolor");
  console.log(data);
  return (
    <div className="list">
      <Container fluid>
        {data.map((item, index) => {
          return (
            <Media key={index} className="list-item">
              <img
                width={64}
                height={64}
                className="mr-3"
                src="https://46.media.tumblr.com/276eeec6ab6ee2dce7373580e5ffa35c/tumblr_n2fx9yLS411tvfpg9o1_500.gif"
                alt="Generic placeholder"
              />
              <Media.Body>
                <h6>{item}</h6>
                <p>Varun Gupta</p>
              </Media.Body>
              <Media.Body className="d-flex flex-row-reverse">
                <p>13</p>
              </Media.Body>
            </Media>
          );
        })}
      </Container>
    </div>
  );
}

export default List;
