import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import "antd/dist/antd.css";
import "./Nav.scss";
import Login from "../Login/Login";
const { Content, Footer, Sider } = Layout;

function Nav() {
  const [collapsed, setCollapsed] = useState(true);

  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    if (
      localStorage.getItem("accessToken") &&
      localStorage.getItem("refreshToken")
    ) {
      setLoggedIn(true);
    }
  }, []);

  const [username, setUsername] = useState("");
  useEffect(() => {
    if (
      loggedIn &&
      localStorage.getItem("accessToken") &&
      localStorage.getItem("refreshToken")
    ) {
      fetch("http://localhost:8080/spotify/profile", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setUsername(data.data.display_name);
        })
        .catch(err => console.error(err))
    }
  }, [loggedIn]);

  return (
    <Layout style={{ minHeight: "100vh", color: "#fff" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
      >
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<PieChartOutlined />}>
            Option 1
          </Menu.Item>
          <Menu.Item key="2" icon={<DesktopOutlined />}>
            Option 2
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout" style={{ backgroundColor: "#001529" }}>
        <Content style={{ margin: "10px 10px", overflow: "initial" }}>
          <Login loggedIn={loggedIn} handleLoginStatus={setLoggedIn} />
          <div>
            <p style={{ color: "white" }}>{username}</p>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
            backgroundColor: "#001529",
            color: "#888",
          }}
        >
          Sager ©2020 - Created by Varun Gupta
        </Footer>
      </Layout>
    </Layout>
  );
}

export default withRouter(Nav);
