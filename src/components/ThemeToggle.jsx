import React, {useState} from "react";
import Wrapper from "../assets/wrappers/ThemeToggle";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";
import { useDashboardContext } from "../pages/DashboardLayout";

const ThemeToggle = () => {
  
  const { isDarkMode, toggleDarkMode } = useDashboardContext();
  return (
    <Wrapper onClick={toggleDarkMode}>
      {isDarkMode ? (
        <BsFillSunFill className="toggle-icon" />
      ) : (
        <BsFillMoonFill />
      )}
    </Wrapper>
  );
};

export default ThemeToggle;
