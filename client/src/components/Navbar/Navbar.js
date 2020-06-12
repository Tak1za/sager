import React from "react";
import "./Navbar.scss";
import Nav from "react-bootstrap/Nav";
import { withRouter, Link } from "react-router-dom";

function Navbar(props) {
  return (
    <>
      <Nav
        className="justify-content-center"
        activeKey={props.location.pathname}
      >
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/playlists"
            className={
              props.location.pathname === "/playlists" ? "active" : null
            }
          >
            Playlists
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/explore"
            className={props.location.pathname === "/explore" ? "active" : null}
          >
            Explore
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/"
            className={
              "logo" + (props.location.pathname === "/" ? " active" : "")
            }
          >
            Sager
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/podcasts"
            className={
              props.location.pathname === "/podcasts" ? "active" : null
            }
          >
            Podcasts
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            as={Link}
            to="/profile"
            className={props.location.pathname === "/profile" ? "active" : null}
          >
            Profile
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </>
  );
}

export default withRouter(Navbar);
