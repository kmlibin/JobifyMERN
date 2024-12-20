import { FormRow, FormRowSelect, SubmitButton } from ".";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { Form, useSubmit, Link } from "react-router-dom";
import { JOB_TYPE, JOB_STATUS, JOB_SORT_BY } from "../../../utils/constants";
import { useAllJobsContext } from "../pages/AllJobs";

//all jobs has the loader for filters
const SearchContainer = () => {
  const {searchValues} = useAllJobsContext()
  const {search, jobStatus, jobType, sort} = searchValues
  //useSubmit to link the inputs, makes them controlled inputs. on any change, it will resubmit the search
  const submit = useSubmit();

  //delay so that every keystroke doesn't make a request to the backend. maintains a controlled input, see implementation in formRow componenets
  //runs two seconds after last keystroke
  const debounce = (onChange) => {
    let timeout;
    return (e) => {
      const form = e.currentTarget.form;
      //clear out prev
      clearTimeout(timeout);
    
      timeout = setTimeout(() => {
        onChange(form);
      }, 2000);
    };
  };
  
  return (
    <Wrapper>
      <Form className="form">
        <h5 className="form-title">search form</h5>
        <div className="form-center">
          {/* search position */}
          {/* //we named it search on the backend */}
          <FormRow
            type="search"
            name="search"
            defaultValue={search}
            onChange={debounce((form) => {
              submit(form)
            })}
          />
          <FormRowSelect
            labelText="job status"
            name="jobStatus"
            list={["all", ...Object.values(JOB_STATUS)]}
            defaultValue={jobStatus}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            labelText="job type"
            name="jobType"
            list={["all", ...Object.values(JOB_TYPE)]}
            defaultValue={jobType}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          <FormRowSelect
            name="sort"
            defaultValue={sort}
            list={[...Object.values(JOB_SORT_BY)]}
            onChange={(e) => {
              submit(e.currentTarget.form);
            }}
          />
          {/* //back to the same page, clears the params */}
          <Link to="/dashboard/all-jobs" className="btn form-btn delete-btn">
            Reset Search Values
          </Link>

        </div>
      </Form>
    </Wrapper>
  );
};

export default SearchContainer;
