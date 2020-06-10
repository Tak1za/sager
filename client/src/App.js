import React from "react";
import "./App.css";
import Nav from "./components/Nav/Nav";
import { Switch, Route } from "react-router-dom";
import Login from "./components/Login/Login";

function App() {
  return (
    <div className="App">
      <Nav />
      <Switch>
        <Route exact path="/authorize" component={Login} />
      </Switch>
    </div>
  );
}

export default App;
