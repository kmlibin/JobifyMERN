import React, { createContext, useContext, useState } from "react";
import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";
import { BigSidebar, Navbar, SmallSidebar } from "../components";
import { checkDefaultTheme } from "../App";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

//set up loader. this will be available BEFORE the component renders, it's like prefetching. useEffect only after the component renders.
//to make it available in the component, then, we need useLoaderData
export const loader = async () => {
  //get userInfo, we aren't storing this data on the frontend. userId and role is stored in the cookie, and we keep that across our application
  //controller uses userId from cookie to getch the current user, and that sends back the user object from our db
  //if we are unable to get the current user, logout the user from the application
  try {
    const userObject = await customFetch.get("/users/current-user");
    const { data } = userObject;
    console.log(data);
    //now have access to data
    return data;
  } catch (error) {
    return redirect("/");
  }
};

//set up context
const DashboardContext = createContext();

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user } = useLoaderData();

  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(checkDefaultTheme());

  const toggleDarkMode = () => {
    console.log("dark mode toggled");
    const newDarkTheme = !isDarkMode;
    setIsDarkMode(newDarkTheme);
    //first arg is the class to watch, second is boolean that depends on whether or not it will toggle
    document.body.classList.toggle("dark-theme", newDarkTheme);
    //save to local storage so the theme persists
    localStorage.setItem("darkTheme", newDarkTheme);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    console.log(showSidebar);
  };

  const logoutUser = async () => {
    navigate("/");
    await customFetch.get("/auth/logout");
    toast.success("Logging Out");
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkMode,
        toggleDarkMode,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              {/* outlet has a context prop that you can pass, so here we are sharing the user. in component you want to use, use useOutletContext*/}
              <Outlet context={{ user }} />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => useContext(DashboardContext);
export default DashboardLayout;
