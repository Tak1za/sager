import React from "react";
import "./Main.scss";
import { Switch, Route } from "react-router-dom";
import Root from "../Root/Root";
import Profile from "../Profile/Profile";
import Playlists from "../Playlists/Playlists";
import Explore from "../Explore/Explore";
import Login from "../Login/Login";
import Tracks from "../Tracks/Tracks";

function Main(props) {
  return (
    <div className="main-container">
      {props.children}
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
          <Route path="/playlists/:playlistId">
            <Tracks />
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
