import React from "react";
import "./Big.scss";
import { Card, Button, Image } from "react-bootstrap";

function Big(props) {
  const { item } = props;

  let imagesExist = item && item.images && item.images.length !== 0;

  return (
    <div className="big">
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
              {item ? item.owner.display_name : null}
            </p>
            <Button variant="outline-secondary" size="sm">
              Follow
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Big;
