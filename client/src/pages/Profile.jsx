import { FormRow } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useOutletContext } from "react-router-dom";
import { useNavigation, Form } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  //formData has a get method where we can access a specific input that we sent along, provide correct "name" of input
  const file = formData.get("avatar");
  if (file && file.size > 500000) {
    toast.error("Image is too large");
    return null;
  }
  try {
    await customFetch.patch('/users/update-user', formData)
    toast.success('Profile Updated Successfully!')
  } catch (error) {
    toast.error(error?.response?.data?.message)
  }
  return null
};

const Profile = () => {
  const { user } = useOutletContext();
  const { name, lastName, email, location } = user;
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Wrapper>
      {/* //see below for enctype */}
      <Form method="post" className="form" encType="multipart/form-data">
        <h4 className="form-title">profile</h4>

        <div className="form-center">
          <div className="form-row">
            {/* //htmlfor matches id */}
            <label htmlFor="avatar" className="form-label">
              Select an image file (max 0.5 MB):
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              className="form-input"
              // only will acept specific type of file, in this case, an image file.
              //we need to set up an action that sends the entire data as formData, otherwise the upload wont work.
              //we send the entire form as formData - we'd previously just been sending as JSON data, but again,
              // an image file isn't converted to json. you need to add encType to form
              accept="image/*"
            />
          </div>
          <FormRow type="text" name="name" defaultValue={name} />
          <FormRow
            type="text"
            labelText="last name"
            name="lastName"
            defaultValue={lastName}
          />
          <FormRow type="email" name="email" defaultValue={email} />
          <FormRow type="text" name="location" defaultValue={location} />
          <button
            className="btn btn-block form-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "submitting..." : "save changes"}
          </button>
        </div>
      </Form>
    </Wrapper>
  );
};

export default Profile;
