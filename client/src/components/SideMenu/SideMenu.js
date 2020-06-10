import React, { useState } from "react";
import PropTypes from "prop-types";
import { Sidebar, Menu, Icon, Segment } from "semantic-ui-react";
import "./SideMenu.scss";
import Main from "../Main/Main";

function SideMenu(props) {
  const { animation, direction, visible } = props;
  return (
    <Sidebar
      as={Menu}
      animation={animation}
      direction={direction}
      icon="labeled"
      inverted
      vertical
      visible={visible}
      width="thin"
    >
      <Menu.Item as="a">
        <Icon name="home" />
        Home
      </Menu.Item>
      <Menu.Item as="a">
        <Icon name="gamepad" />
        Games
      </Menu.Item>
      <Menu.Item as="a">
        <Icon name="camera" />
        Channels
      </Menu.Item>
    </Sidebar>
  );
}

SideMenu.propTypes = {
  animation: PropTypes.string,
  direction: PropTypes.string,
  visible: PropTypes.bool,
};

function SideMenuPusher(props) {
  const [animation] = useState("scale down");
  const [direction] = useState("left");
  const [dimmed] = useState(false);

  return (
    <Sidebar.Pushable
      as={Segment}
      style={{ margin: "0px", border: "none", backgroundColor: "#222831"}}
      className="sidemenu"
    >
      <SideMenu
        animation={animation}
        direction={direction}
        visible={props.visible}
      />
      <Sidebar.Pusher dimmed={dimmed && props.visible} className="pusherDiv">
        <Segment basic attached="bottom" style={{ padding: "0", border: "none" }}>
          <Main />
        </Segment>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
}

export default SideMenuPusher;
