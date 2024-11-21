import React from "react";
import { Link, useRouteError } from "react-router-dom";
import notfound from "../assets/images/not-found.svg";
import Wrapper from "../assets/wrappers/ErrorPage";

//a few possible errors, set up multiple returns based on status
const Error = () => {
  const error = useRouteError();
  if (error.status === 404) {
    return (
      <Wrapper>
        <div>
          <img src={notfound} alt="page not found" />
          <h3>Page not found!</h3>
          <p>We can't seem to find the page you're looking for</p>
          <Link to="/dashboard">Back to Dashboard</Link>
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div>
        <h3>Something went wrong...</h3>
        <Link to="/">back to home</Link>
      </div>
    </Wrapper>
  );
};

export default Error;
