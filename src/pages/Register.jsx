import React from "react";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { Link } from "react-router-dom";
import { FormRow, Logo } from "../components";

//not going to be controlled inputs, because rrd is using form api
//usually check for empty values on the frontend, but we don't have controlled inputs so having 'required' is a good idea.
//name prop value is what is sent to the server
const Register = () => {
  return (
    <Wrapper>
      <form className="form">
        <Logo />
        <h4>Register</h4>
        <FormRow
          type="text"
          name="name"
          defaultValue="John"
          labelText={"Name"}
        />
        <FormRow
          type="text"
          name="lastName"
          defaultValue="Smith"
          labelText={"Last Name"}
        />
        <FormRow
          type="text"
          name="location"
          defaultValue="Chicago"
          labelText={"Location"}
        />
        <FormRow
          type="email"
          name="email"
          defaultValue="John@Smith.com"
          labelText={"Email"}
        />
        <FormRow
          type="password"
          name="password"
          defaultValue="Secret890"
          labelText={"Password"}
        />
        <button type="submit" className="btn btn-block">
          Submit
        </button>
        <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
