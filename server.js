import "express-async-errors";
import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cloudinary from "cloudinary";
import errorHandlerMiddleware from "./middleware/errorHandlerMiddleware.js";

//routers
import jobRouter from "./routes/jobRoutes.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

//public
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

//middleware
import { authenticateUser } from "./middleware/authMiddleware.js";

//setting up public folder, this is eventually where our client folder will be.
//we are settin gup public because we are utilizing uploads - this is where we will temporarily store our images
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.resolve(__dirname, "./public")));

//cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//cookies
app.use(cookieParser());

//how you get access to the req object
app.use(express.json());

app.get("/", (req, res) => {
  res.send("...home page");
});

//all job routes will need authentication, so do here instead of in routes for simplicity
app.use("/api/v1/jobs", authenticateUser, jobRouter);
app.use("/api/v1/users", authenticateUser, userRouter);
app.use("/api/v1/auth", authRouter);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./public", "index.html"));
});

//if a route/page isn't found. needs to run after all routes, because order matters for routes (recall)
app.use("*", (req, res) => {
  res.status(404).json({ message: "not found" });
});

//error middleware. HAS to be the last one. for SYNCHRONOUS errors.
app.use(errorHandlerMiddleware);

//set up port variable
const port = process.env.PORT || 4100;
try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log("server running on port 5100");
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}

//sample simple server using local data
// import * as dotenv from "dotenv";
// dotenv.config();

// import express from "express";
// const app = express();
// import { nanoid } from "nanoid";
// import morgan from "morgan";

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

// let jobs = [
//   { id: nanoid(), company: "apple", position: "frontend" },
//   { id: nanoid(), company: "company2", position: "backend" },
// ];

// //how you get access to the req object
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("...home page");
// });
// //get all jobs
// app.get("/api/v1/jobs", (req, res) => {
//   res.status(200).json({ jobs });
// });

// //create job
// app.post("/api/v1/jobs", (req, res) => {
//   //controller will create id in future
//   const { company, position } = req.body;
//   if (!company || !position) {
//     return res
//       .status(400)
//       .json({ message: "please provide company and position" });
//   }
//   //since not connected to db, pushing manually to array
//   const id = nanoid(10);
//   const job = { id, company, position };
//   //since not connected to db, pushing manually to array
//   jobs.push(job);

//   res.status(201).json({ job });
// });

// //get one job
// app.get("/api/v1/jobs/:id", (req, res) => {
//   const { id } = req.params;
//   const job = jobs.find((job) => job.id === id);
//   if (!job) {
//     return res
//       .status(404)
//       .json({ message: `Job not found with that id ${id}` });
//   }

//   res.status(200).json({ job });
// });

// //editing job
// app.patch("/api/v1/jobs/:id", (req, res) => {
//   const { id } = req.params;
//   const { company, position } = req.body;
//   if (!company || !position) {
//     return res.status(400).json({ message: "please provide job and company" });
//   }
//   const job = jobs.find((job) => job.id === id);
//   if (!job) {
//     return res
//       .status(404)
//       .json({ message: `Job not found with that id ${id}` });
//   }
//   job.company = company;
//   job.position = position;

//   res.status(200).json({ message: "job modified", job });
// });

// //delete job
// app.delete("/api/v1/jobs/:id", (req, res) => {
//   const { id } = req.params;

//   const job = jobs.find((job) => job.id === id);
//   if (!job) {
//     return res
//       .status(404)
//       .json({ message: `Job not found with that id ${id}` });
//   }

//   const newJobs = jobs.filter((job) => job.id !== id);
//   jobs = newJobs;

//   res.status(200).json({ message: "job has been deleted" });
// });

// //set up port variable
// const port = process.env.PORT || 4100;

// app.listen(port, () => {
//   console.log("server running on port 5100");
// });
