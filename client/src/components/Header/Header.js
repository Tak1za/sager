import React, { useState } from "react";
import { Menu } from "semantic-ui-react";
import SideMenu from "../SideMenu/SideMenu";
import './Header.scss';

function Header() {
  const [sidemenu, setSidemenu] = useState(false);
  return (
    <>
      <Menu attached="top">
        <Menu.Item onClick={() => setSidemenu(!sidemenu)}>
          <i class="fas fa-bars" style={{color: "white"}}> <em>Sager</em></i>
        </Menu.Item>
      </Menu>
      <SideMenu visible={sidemenu} />
    </>
  );
}

export default Header;
