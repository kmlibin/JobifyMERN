import React from "react";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { Logo, FormRow } from "../components";
import { Link } from "react-router-dom";
const Login = () => {
  return (
    <Wrapper>
      <form className="form">
        <Logo />
        <h4>Log In</h4>
        <FormRow
          type="email"
          name="email"
          defaultValue="John@Smith.com"
          labelText="Email"
        />
        <FormRow
          type="password"
          name="password"
          defaultValue="Secret890"
          labelText="Password"
        />
        <button type="submit" className="btn btn-block">Submit</button>
        <button type="button" className="btn btn-block">Explore the App</button>
        <p>
          Not a member yet?
          <Link to="/register" className="member-btn">
            Register
          </Link>
        </p>
      </form>
    </Wrapper>
  );
};

export default Login;
