import React, { Component } from "react";
import { Layout, Menu } from "antd";
import { DesktopOutlined, PieChartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "antd/dist/antd.css";
import "./Nav.scss";
const { Content, Footer, Sider } = Layout;

class Nav extends Component {
  state = {
    collapsed: true,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh", color: "#fff" }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
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
              <Link to="/login" className="external-icon">
                <i className="fab fa-spotify" />
              </Link>
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
}

export default Nav;
