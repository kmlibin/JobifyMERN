import mongoose from "mongoose";

//create the schema
const JobSchema = new mongoose.Schema(
  {
    company: String,
    position: String,
    jobStatus: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      default: "full-time",
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
