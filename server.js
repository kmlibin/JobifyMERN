import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import { nanoid } from "nanoid";
import morgan from "morgan";

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

let jobs = [
  { id: nanoid(), company: "apple", position: "frontend" },
  { id: nanoid(), company: "company2", position: "backend" },
];

//how you get access to the req object
app.use(express.json());

app.get("/", (req, res) => {
  res.send("...home page");
});
//get all jobs
app.get("/api/v1/jobs", (req, res) => {
  res.status(200).json({ jobs });
});

//create job
app.post("/api/v1/jobs", (req, res) => {
  //controller will create id in future
  const { company, position } = req.body;
  if (!company || !position) {
    return res
      .status(400)
      .json({ message: "please provide company and position" });
  }
  //since not connected to db, pushing manually to array
  const id = nanoid(10);
  const job = { id, company, position };
  //since not connected to db, pushing manually to array
  jobs.push(job);

  res.status(201).json({ job });
});

//get one job
app.get("/api/v1/jobs/:id", (req, res) => {
  const { id } = req.params;
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    return res
      .status(404)
      .json({ message: `Job not found with that id ${id}` });
  }

  res.status(200).json({ job });
});

//editing job
app.patch("/api/v1/jobs/:id", (req, res) => {
  const { id } = req.params;
  const { company, position } = req.body;
  if (!company || !position) {
    return res.status(400).json({ message: "please provide job and company" });
  }
  const job = jobs.find((job) => job.id === id);
  if (!job) {
    return res
      .status(404)
      .json({ message: `Job not found with that id ${id}` });
  }
  job.company = company;
  job.position = position;

  res.status(200).json({ message: "job modified", job });
});

//set up port variable
const port = process.env.PORT || 4100;

app.listen(port, () => {
  console.log("server running on port 5100");
});
