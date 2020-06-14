import React from "react";
import "./Main.scss";
import { Switch, Route } from "react-router-dom";
import Root from "../Root/Root";
import Profile from "../Profile/Profile";
import Playlists from "../Playlists/Playlists";
import Podcasts from "../Podcasts/Podcasts";
import Explore from "../Explore/Explore";
import Login from "../Login/Login";
import { Breadcrumb } from "react-bootstrap";

function Main(props) {
  return (
    <div className="main-container">
      {props.children}
      <Breadcrumb style={{ backgroundColor: "white" }}>
        <Breadcrumb.Item>Playlists</Breadcrumb.Item>
        <Breadcrumb.Item>Tracks</Breadcrumb.Item>
      </Breadcrumb>
      <div className="main-content">
        <Switch>
          <Route exact path="/">
            <Root />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/playlists">
            <Playlists />
          </Route>
          <Route exact path="/podcasts">
            <Podcasts />
          </Route>
          <Route exact path="/explore">
            <Explore />
          </Route>
          <Route exact path="/authorize">
            <Login />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default Main;
