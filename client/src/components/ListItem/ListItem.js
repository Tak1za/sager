import React from "react";
import { Media } from "react-bootstrap";

function ListItem(props) {
  return (
    <Media className="list-item">
      <img
        width={64}
        height={64}
        className="mr-3"
        src="https://46.media.tumblr.com/276eeec6ab6ee2dce7373580e5ffa35c/tumblr_n2fx9yLS411tvfpg9o1_500.gif"
        alt="Generic placeholder"
      />
      <Media.Body>
        <h6>{props.item}</h6>
        <p>Varun Gupta</p>
      </Media.Body>
      <Media.Body className="d-flex flex-row-reverse">
        <p>13</p>
      </Media.Body>
    </Media>
  );
}

export default ListItem;
