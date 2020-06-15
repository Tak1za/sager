import React from "react";
import Media from "react-bootstrap/Media";

function TrackItem(props) {
  const { item, selectTrack } = props;
  let imagesExist =
    item.track.album.images && item.track.album.images.length !== 0;

  let artistArray = item ? item.track.artists.map((res) => res.name) : null;
  let by = artistArray ? artistArray.join(", ") : null;

  return (
    <Media className="list-item" onMouseOver={() => selectTrack(item)}>
      <img
        width={50}
        height={50}
        className="mr-3"
        src={
          imagesExist
            ? item.track.album.images[0].url
            : "https://www.wyzowl.com/wp-content/uploads/2018/08/The-20-Best-Royalty-Free-Music-Sites-in-2018.png"
        }
        alt="Generic placeholder"
      />
      <Media.Body>
        <h6>{item.track.name}</h6>
        <p>{by}</p>
      </Media.Body>
      <Media.Body className="d-flex flex-row-reverse">
        <p>{item.track.duration_ms / 1000}s</p>
      </Media.Body>
    </Media>
  );
}

export default TrackItem;
