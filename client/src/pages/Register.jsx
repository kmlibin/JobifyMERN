import React from "react";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";

import { FormRow, Logo, SubmitButton } from "../components";
import { Form, redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

//we are using actions from React Router DOM...tie actions to the routes, in App.js, can also use the formData element more easily

//usually you're checking for empty values with controlled input - they recommend using the server to check the inputs, AND suggest
//using the required attribute. so really no js to check for empty values

export const action = async ({ request }) => {
  //returns formData
  const formData = await request.formData();
  //we want to get all the values
  //will return an object with our names and their values ({email: "", lastName: "", name: "", etc})
  const data = Object.fromEntries(formData);
  console.log(data);
  //make request back to our server, if success, redirect to login
  try {
    await customFetch.post("/auth/register", data); //can pass them in as an object, individually, or just data
    toast.success("Registration Successful");
    return redirect("/login");
  } catch (err) {
    console.log(err);
    toast.error(err?.response?.data?.message);
    return err;
  }
};

const Register = () => {
  return (
    <Wrapper>
      {/* default is get, declare if otherwise. Form is linked to the action you've put in the App.jsx routes */}
      <Form method="post" className="form">
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
        <SubmitButton />
        {/* <p>
          Already a member?
          <Link to="/login" className="member-btn">
            Login
          </Link>
        </p> */}
      </Form>
    </Wrapper>
  );
};

export default Register;

//not going to be controlled inputs, because rrd is using form api
//usually check for empty values on the frontend, but we don't have controlled inputs so having 'required' is a good idea.
//name prop value is what is sent to the server
// const Register = () => {
//   return (
//     <Wrapper>
//       <form className="form">
//         <Logo />
//         <h4>Register</h4>
//         <FormRow
//           type="text"
//           name="name"
//           defaultValue="John"
//           labelText={"Name"}
//         />
//         <FormRow
//           type="text"
//           name="lastName"
//           defaultValue="Smith"
//           labelText={"Last Name"}
//         />
//         <FormRow
//           type="text"
//           name="location"
//           defaultValue="Chicago"
//           labelText={"Location"}
//         />
//         <FormRow
//           type="email"
//           name="email"
//           defaultValue="John@Smith.com"
//           labelText={"Email"}
//         />
//         <FormRow
//           type="password"
//           name="password"
//           defaultValue="Secret890"
//           labelText={"Password"}
//         />
//         <button type="submit" className="btn btn-block">
//           Submit
//         </button>
//         <p>
//           Already a member?
//           <Link to="/login" className="member-btn">
//             Login
//           </Link>
//         </p>
//       </form>
//     </Wrapper>
//   );
// };

// export default Register;
