import React from "react";
import "./Big.scss";
import { Card, Button, Image } from "react-bootstrap";
import Fade from 'react-reveal/Fade';

function Big(props) {
  const { item } = props;

  let imagesExist = item && item.images && item.images.length !== 0;

  return (
    <div className="big">
      <Fade big>
        <Card>
          <Image
            variant="top"
            width={250}
            height={250}
            roundedCircle
            src={
              imagesExist
                ? item.images[0].url
                : "https://www.wyzowl.com/wp-content/uploads/2018/08/The-20-Best-Royalty-Free-Music-Sites-in-2018.png"
            }
          />
          <Card.Body>
            <div>
              <h6>{item ? item.name : null}</h6>
              <p style={{ fontSize: "10px" }}>
                {item ? "By " + item.owner.display_name : null}
              </p>
              <p style={{ fontSize: "12px" }}>
                {item ? item.tracks.total + " songs" : null}
              </p>
              <Button variant="outline-secondary" size="sm">
                Follow
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Fade>
    </div>
  );
}

export default Big;
