import React from "react";
import "./Main.scss";

function Main(props) {
  return (
    <div className="main-container">
      {props.children}
      <div className="main-content">
        <p>fbsdjkfndskjfnskd</p>
        <p>dsakjdnjksadjkasdsa</p>
        <p>fbsdjkfndskjfnskd</p>
        <p>dsakjdnjksadjkasdsa</p>
        <p>fbsdjkfndskjfnskd</p>
        <p>dsakjdnjksadjkasdsa</p>
        <p>fbsdjkfndskjfnskd</p>
        <p>dsakjdnjksadjkasdsa</p>
      </div>
    </div>
  );
}

export default Main;
