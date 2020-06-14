import React from "react";
import { Media } from "react-bootstrap";
import "./ListItem.scss";

function ListItem(props) {
  const { item, selectItem } = props;
  let imagesExist = item.images && item.images.length !== 0;
  return (
    <Media className="list-item" onMouseOver={() => selectItem(item)}>
      <img
        width={50}
        height={50}
        className="mr-3"
        src={
          imagesExist
            ? item.images[0].url
            : "https://www.wyzowl.com/wp-content/uploads/2018/08/The-20-Best-Royalty-Free-Music-Sites-in-2018.png"
        }
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
