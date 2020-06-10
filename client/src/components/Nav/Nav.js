import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import "antd/dist/antd.css";
import "./Nav.scss";
const { Content, Footer, Sider } = Layout;

function Nav() {
  const [collapsed, setCollapsed] = useState(true);

  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    console.log(loggedIn);
    if(localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")){
      setLoggedIn(true);
    }
  });

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
          <div
            className="site-layout-background"
            style={{ padding: 24, textAlign: "center" }}
          >
            <a
              href="http://localhost:8080/spotify/login"
              className={loggedIn ? "external-icon-in" : "external-icon"}
            >
              <i
                className={loggedIn ? "fab fa-spotify in" : "fab fa-spotify"}
              />
            </a>
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
