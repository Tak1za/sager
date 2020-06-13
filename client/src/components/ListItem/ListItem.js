import React from "react";
import { Media } from "react-bootstrap";
import "./ListItem.scss";

function ListItem(props) {
  const { item, selectItem } = props;
  return (
    <Media className="list-item" onClick={() => selectItem(item)}>
      <img
        width={50}
        height={50}
        className="mr-3"
        src="https://46.media.tumblr.com/276eeec6ab6ee2dce7373580e5ffa35c/tumblr_n2fx9yLS411tvfpg9o1_500.gif"
        alt="Generic placeholder"
      />
      <Media.Body>
        <h6>{item.name}</h6>
        <p>{item.owner.display_name}</p>
      </Media.Body>
      <Media.Body className="d-flex flex-row-reverse">
        <p>{item.tracks.total}</p>
      </Media.Body>
    </Media>
  );
}

export default ListItem;
