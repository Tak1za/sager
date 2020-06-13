import React from "react";
import "./App.scss";
import Login from './components/Login/Login';
import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";

function App() {
  return (
    <div className="App">
      <Login />
      <Main>
        <Navbar />
      </Main>
    </div>
  );
}

export default App;
