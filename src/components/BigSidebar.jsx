import React from "react";
import Wrapper from "../assets/wrappers/BigSidebar";
import { Navlinks } from "./Navlinks";
import { useDashboardContext } from "../pages/DashboardLayout";
import Logo from "./Logo";

const BigSidebar = () => {
  const { showSidebar } = useDashboardContext();
  return (
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container " : "show-sidebar sidebar-container"
        }
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          <Navlinks isBigSidebar/>
        </div>
      </div>
    </Wrapper>
  );
};

export default BigSidebar;
