import { toast } from "react-toastify";
import { JobsContainer, SearchContainer } from "../components";
import customFetch from "../utils/customFetch";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { useContext, createContext } from "react";

//fetch data before component loads, grab it and use it in the useLoaderData hook
export const loader = async ({ request }) => {
  try {
    const  data = await customFetch.get("/jobs");
    console.log(data);
    return data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

//set up more context b/c search and jobs will have more components that need access to this info. we can already access user from the dashboard layout, if needed.
const AllJobsContext = createContext();
const AllJobs = () => {
  const { data } = useLoaderData();

  return (
    <AllJobsContext.Provider value={{ data }}>
      <SearchContainer />
      <JobsContainer />
    </AllJobsContext.Provider>
  );
};

export const useAllJobsContext = () => useContext(AllJobsContext);
export default AllJobs;
