import React, { useState, useEffect } from "react";
import { Menu } from "semantic-ui-react";
import SideMenu from "../SideMenu/SideMenu";
import "./Header.scss";
import Login from "../Login/Login";

function Header() {
  const [sidemenu, setSidemenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("accessToken") &&
      localStorage.getItem("refreshToken")
    ) {
      setLoggedIn(true);
    }
  }, []);

  return (
    <>
      <Menu attached="top">
        <Menu.Item onClick={() => setSidemenu(!sidemenu)}>
          <i className="fas fa-bars" style={{ color: "white" }}>
            {" "}
            <b
              style={{
                fontFamily: "'Cinzel Decorative', cursive",
                fontSize: "1.3em",
                paddingLeft: "10px",
              }}
            >
              Sager
            </b>
          </i>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <Login loggedIn={loggedIn} handleLoginStatus={setLoggedIn} />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <SideMenu visible={sidemenu} />
    </>
  );
}

export default Header;
