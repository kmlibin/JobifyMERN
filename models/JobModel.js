import mongoose from "mongoose";
import { JOB_STATUS, JOB_TYPE } from "../utils/constants.js";

//create the schema
const JobSchema = new mongoose.Schema(
  {
    company: String,
    position: String,
    jobStatus: {
      type: String,
      enum: Object.values(JOB_STATUS),
      default: JOB_STATUS.PENDING,
    },
    jobType: {
      type: String,
      enum: Object.values(JOB_TYPE),
      default: JOB_TYPE.FULL_TIME,
    },
    jobLocation: {
      type: String,
      default: "my city",
    },
    //mongodb already puts id in there
    //timestamps: true will have a createdAt and updatedAt fieldd
  },
  { timestamps: true }
);

//first one is creating the collection, so name it. will be 'jobs' in collection
export default mongoose.model("Job", JobSchema);
