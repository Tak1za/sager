import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import queryString from "query-string";

function Login(props) {
  let queryObject = queryString.parse(props.location.search);

  useEffect(() => {
    if (queryObject.code !== "access_denied" && queryObject.state) {
      const params = {
        grant_type: "authorization_code",
        code: queryObject.code,
        redirect_uri: "http://localhost:3000/authorize",
        client_id: "c6b75823a81a41a3b5ddf2531d7498e0",
        client_secret: "76c1236ab5554bb69b0d56c7ab1c8b51"
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
          console.log(data);
          localStorage.setItem("accessToken", data.access_token);
          localStorage.setItem("refreshToken", data.refresh_token);
        })
        .then(() => {console.log("Redirecting"); props.history.push("/");});
    }
  });

  return(
    <h1>Loading...</h1>
  )
}

export default withRouter(Login);
