import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  DashboardLayout,
  Error,
  AddJob,
  Stats,
  AllJobs,
  Profile,
  Admin,
} from "./pages";


//checks and applies for landing,login,error pages. in dashboard we will call the function separately
export const checkDefaultTheme = () => {
  //checking as true as string because we didn't set a key/value..or are they just always strings?
  const isDarkTheme = localStorage.getItem('darkTheme') === "true";
  document.body.classList.toggle('dark-theme', isDarkTheme);
  return isDarkTheme;
};


checkDefaultTheme()

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      { index: true, element: <Landing /> },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <DashboardLayout/>,
        children: [
          { index: true, element: <AddJob /> },
          { path: "stats", element: <Stats /> },
          { path: "all-jobs", element: <AllJobs /> },
          { path: "profile", element: <Profile /> },
          { path: "admin", element: <Admin /> },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
