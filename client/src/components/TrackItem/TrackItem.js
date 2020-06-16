import React from "react";
import Media from "react-bootstrap/Media";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import "./TrackItem.scss";
import Fade from "react-reveal/Fade";

function TrackItem(props) {
  const { item } = props;
  let imagesExist =
    item.track.album.images && item.track.album.images.length !== 0;

  let artistArray = item ? item.track.artists.map((res) => res.name) : null;
  let by = artistArray ? artistArray.join(", ") : null;
  let trackDuration = item ? getTrackDuration(item.track.duration_ms) : null;

  function getTrackDuration(time) {
    let timeInSeconds = Math.round(time / 1000);
    let minutes = Math.round(timeInSeconds / 60);
    let seconds = Math.round(timeInSeconds % 60);
    return minutes + "m " + seconds + "s";
  }

  return (
    <Fade big>
      <tr>
        <td>
          <Form>
            <Form.Group>
              <Form.Check type="checkbox" />
            </Form.Group>
          </Form>
        </td>
        <td>
          <Media className="track-item">
            <Image
              width={50}
              height={50}
              className="mr-3"
              roundedCircle
              src={
                imagesExist
                  ? item.track.album.images[0].url
                  : "https://www.wyzowl.com/wp-content/uploads/2018/08/The-20-Best-Royalty-Free-Music-Sites-in-2018.png"
              }
              alt="Generic placeholder"
            />
            <Media.Body>
              <span>{item.track.name}</span>
              <p>{by}</p>
            </Media.Body>
          </Media>
        </td>
        <td>
          <p>{trackDuration}</p>
        </td>
        <td>Delete</td>
      </tr>
    </Fade>
  );
}

export default TrackItem;
