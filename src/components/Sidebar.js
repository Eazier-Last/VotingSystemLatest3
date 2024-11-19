import React from "react";
import "../App.css";
import { SidebarData } from "./SidebarData";

function Sidebar({ loadComponent }) {
  const handleNavigation = (link) => {
    window.history.pushState({}, "", link); // Updates the URL without reloading
    loadComponent(link); // Updates the active component
  };

  return (
    <div className="Sidebar">
      <ul className="SidebarList">
        {SidebarData.map((val, key) => {
          return (
            <li
              className="row"
              key={key}
              id={window.location.pathname === val.link ? "active" : ""}
              onClick={() => handleNavigation(val.link)}
            >
              <div id="icon">{val.icon}</div>
              <div id="title">{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
