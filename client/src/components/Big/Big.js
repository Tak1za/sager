import React from "react";
import "./Big.scss";
import { Card, Button, Image } from "react-bootstrap";
import Fade from "react-reveal/Fade";

function Big(props) {
  const { item, isPlaylistSelected } = props;
  console.log(props);

  let imagesExist = false;
  let imageUrl = "";
  let by = "";
  let total = 0;
  let name = "";
  if (item && !isPlaylistSelected) {
    imagesExist = item && item.images && item.images.length !== 0;
    imageUrl = imagesExist
      ? item.images[0].url
      : "https://www.wyzowl.com/wp-content/uploads/2018/08/The-20-Best-Royalty-Free-Music-Sites-in-2018.png";
    by = item.owner.display_name;
    total = item.tracks.total + " songs";
    name = item.name;
  } else if (item && isPlaylistSelected) {
    imagesExist =
      item && item.track.album.images && item.track.album.images.length !== 0;
    imageUrl = imagesExist
      ? item.track.album.images[0].url
      : "https://www.wyzowl.com/wp-content/uploads/2018/08/The-20-Best-Royalty-Free-Music-Sites-in-2018.png";
    let artistArray = item.track.artists.map((res) => res.name);
    by = artistArray.join(", ");
    total = item.track.duration_ms / 1000 + "s";
    name = item.track.name;
  }

  return (
    <div className="big">
      <Fade big>
        <Card>
          <Image
            variant="top"
            width={250}
            height={250}
            roundedCircle
            src={imageUrl}
          />
          <Card.Body>
            <div>
              <h6>{item ? name : null}</h6>
              <p style={{ fontSize: "10px" }}>{item ? "By " + by : null}</p>
              <p style={{ fontSize: "12px" }}>{item ? total : null}</p>
              <Button variant="outline-secondary" size="sm">
                Like
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Fade>
    </div>
  );
}

export default Big;
