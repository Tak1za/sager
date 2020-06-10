import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";
import "./Login.scss";

function Login(props) {
  const loggedIn = props.loggedIn;

  useEffect(() => {
    let queryObject = queryString.parse(props.location.search);

    if (queryObject.code !== "access_denied" && queryObject.state) {
      const params = {
        grant_type: "authorization_code",
        code: queryObject.code,
        redirect_uri: "http://localhost:3000/authorize",
        client_id: "client_id",
        client_secret: "client_secret",
      };
      fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: Object.keys(params)
          .map(
            (key) =>
              encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
          )
          .join("&"),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("accessToken", data.access_token);
          localStorage.setItem("refreshToken", data.refresh_token);
        })
        .then(() => props.handleLoginStatus(true))
        .then(props.history.push("/"))
        .catch((err) => console.error(err));
    }
  }, [props]);

  return (
    <div
      className="site-layout-background"
      style={{ padding: 24, textAlign: "center" }}
    >
      <a
        href="http://localhost:8080/spotify/login"
        className={loggedIn ? "external-icon-in" : "external-icon"}
      >
        <i className={loggedIn ? "fab fa-spotify in" : "fab fa-spotify"} />
      </a>
    </div>
  );
}

export default withRouter(Login);
