import React from "react";
//styles
import Wrapper from "../assets/wrappers/LandingPage";
import logo from "../assets/images/logo.svg";
import main from "../assets/images/main-alternative.svg";
import { Link } from "react-router-dom";
import { Logo } from "../components";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo/>
      </nav>
      <div className=" container page">
        <div className="info">
          <h1>
            Job <span>Tracking</span> App
          </h1>
          <p>
            Here are some words to use as placeholder. There are more we will
            add. Here are some words to use as placeholder. There are more we
            will add. Here are some words to use as placeholder. There are more
            we will add.
          </p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn">
            Login / Demo User
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;
