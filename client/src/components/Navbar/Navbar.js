import React from "react";
import "./Navbar.scss";

function Navbar() {
  return (
    <nav class="navbar navbar-light navbar-expand-md justify-content-center justify-content-start">
      <a class="navbar-brand d-md-none d-inline" href="">
        Brand
      </a>
      <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#collapsingNavbar2"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      <div
        class="navbar-collapse collapse justify-content-between align-items-center w-100"
        id="collapsingNavbar2"
      >
        <ul class="navbar-nav mx-auto text-md-center text-left">
          <li class="nav-item">
            <a class="nav-link" href="#">
              Profile
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              Playlists
            </a>
          </li>
          <li class="nav-item my-auto">
            <a class="nav-link navbar-brand mx-0 d-none d-md-inline" href="">
              Sager
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              Browse
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">
              Podcasts
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
