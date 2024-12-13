import React from "react";
import { useDashboardContext } from "../pages/DashboardLayout";
import links from "../utils/links";
import { NavLink } from "react-router-dom";

export const Navlinks = ({ isBigSidebar }) => {
  const { toggleSidebar, user } = useDashboardContext();
  const {role} = user
  return (
    <div className="nav-links">
      {links.map((link) => {
        const { text, path, icon } = link;
        if(path === 'admin' && role !== 'admin') return;
        return (
          <NavLink
            to={path}
            key={text}
            className="nav-link"
            //the toggle will only run if it's NOT the big screen/big sidebar
            onClick={isBigSidebar ? null : toggleSidebar}
            //this is added b/c with navlink, the active links are highlighted. since add jobs always matches the route
            //('dashboard') it's always highlighted, regardless of url. so end stops that
            end
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};
