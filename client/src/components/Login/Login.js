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
        client_id: "c6b75823a81a41a3b5ddf2531d7498e0",
        client_secret: "76c1236ab5554bb69b0d56c7ab1c8b51",
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
          if (
            data.access_token !== undefined &&
            data.refresh_token !== undefined
          ) {
            localStorage.setItem("accessToken", data.access_token);
            localStorage.setItem("refreshToken", data.refresh_token);
            props.handleLoginStatus(true);
          }
        })
        .then(props.history.push("/"))
        .catch((err) => console.error(err));
    }
  }, [props]);

  return (
    <a
      href="http://localhost:8080/spotify/login"
      className={loggedIn ? "external-icon-in" : "external-icon"}
    >
      <i className={loggedIn ? "fab fa-spotify in" : "fab fa-spotify"} />
    </a>
  );
}

export default withRouter(Login);
